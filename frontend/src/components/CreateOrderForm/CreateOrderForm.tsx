import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Step2Details } from './Step2Details';
import { Step4Review } from './Step4Review';
import { GlassCard } from '../ui';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { usePedidosData } from '../../hooks/usePedidosData';
import { usePricingConfig } from '../../hooks/usePricingConfig';
import { calculateOrderPricing } from './pricing';
import { pedidosService } from '../../services/pedidosService';

interface CreateOrderFormProps {
  pedido?: any; // Pedido existente para edición
  onCancel?: () => void; // Función para cancelar edición
}

export function CreateOrderForm({ pedido, onCancel }: CreateOrderFormProps = {}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createPedidoSafe, updatePedidoSafe } = usePedidosData();
  const { pricingConfig } = usePricingConfig();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const isEditMode = !!pedido;

  // Función para inicializar el formData desde un pedido existente
  const initializeFromPedido = (pedido: any) => {
    return {
      orderType: 'SCREENPRINTING',
      fileUrls: pedido.fileUrls || [],
      pendingFiles: [] as File[],
      filesWithDimensions: pedido.filesWithDimensions || [],
      quantity: pedido.quantity || pedido.cantidad || 1,
      linearMeters: pedido.linearMetersPerUnit || pedido.linearMeters || 0,
      spacingCm: pedido.spacingCm || 0,
      unitWidthCm: pedido.unitWidthCm || pedido.measurementWidthCm || undefined,
      unitHeightCm: pedido.unitHeightCm || pedido.measurementHeightCm || undefined,
      dataCorrect: false,
      termsAccepted: false,
    };
  };

  const [formData, setFormData] = useState(() => {
    if (isEditMode && pedido) {
      return initializeFromPedido(pedido);
    }
    return {
      orderType: 'SCREENPRINTING',
      fileUrls: [] as string[],
      pendingFiles: [] as File[],
      filesWithDimensions: [] as Array<{ id: string; name: string; url?: string; widthCm?: number; heightCm?: number }>,
      quantity: 1,
      linearMeters: 0,
      spacingCm: 0,
      unitWidthCm: undefined as number | undefined,
      unitHeightCm: undefined as number | undefined,
      dataCorrect: false,
      termsAccepted: false,
    };
  });

  // Actualizar formData si cambia el pedido
  useEffect(() => {
    if (isEditMode && pedido) {
      setFormData(initializeFromPedido(pedido));
    }
  }, [pedido, isEditMode]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUploadFiles = async (files: File[]) => {
    // Guardar archivos pendientes para subirlos después de crear el pedido
    // Esto permite asociarlos correctamente al pedido en la tabla pedido_archivos
    setFormData((prev) => ({
      ...prev,
      pendingFiles: [...prev.pendingFiles, ...files],
    }));

    // Devolver nombres temporales para mostrar en UI
    return files.map((file) => file.name);
  };

  const pricing = calculateOrderPricing({
    orderType: formData.orderType,
    quantity: formData.quantity,
    linearMeters: formData.linearMeters,
    spacingCm: formData.spacingCm,
    unitWidthCm: formData.unitWidthCm,
    unitHeightCm: formData.unitHeightCm,
    pricingConfig,
  });

  const currentItem = {
    type: formData.orderType,
    fileUrls: formData.fileUrls,
    quantity: formData.quantity,
    linearMeters: formData.linearMeters,
    linearMetersRaw: pricing.totalLinearMetersRaw,
    spacingCm: formData.spacingCm,
    unitWidthCm: formData.unitWidthCm,
    unitHeightCm: formData.unitHeightCm,
    rows: pricing.rows,
    unitsPerRow: pricing.unitsPerRow,
    filesWithDimensions: formData.filesWithDimensions,
    unitPrice: pricing.unitPrice,
    billableLinearMeters: pricing.totalLinearMeters,
    totalPrice: pricing.totalPrice,
    price: pricing.unitPrice,
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('Debes estar autenticado');
      return;
    }

    setLoading(true);
    try {
      const serviceLabel = 'serigrafia';
      const fechaEntrega = pedido?.fechaEntrega || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      // Payload sincronizado con PedidoDTO.java del backend
      const pedidoPayload = {
        // NO enviar clienteId - el backend lo asigna automáticamente desde Authentication

        servicio: serviceLabel,

        // Consolidar toda la información útil en descripción
        descripcion: [
          `Tipo: Serigrafía`,
          currentItem.unitWidthCm && currentItem.unitHeightCm
            ? `Medidas unidad: ${Number(currentItem.unitWidthCm).toFixed(1)} x ${Number(currentItem.unitHeightCm).toFixed(1)} cm`
            : '',
          currentItem.linearMeters ? `Metros lineales/unidad: ${Number(currentItem.linearMeters).toFixed(2)} m` : '',
          currentItem.linearMetersRaw ? `Total metros lineales: ${Number(currentItem.linearMetersRaw).toFixed(2)} m` : '',
          currentItem.spacingCm ? `Espaciado: ${currentItem.spacingCm} cm` : '',
          currentItem.rows && currentItem.unitsPerRow ? `Distribución: ${currentItem.unitsPerRow} x ${currentItem.rows}` : '',
          currentItem.billableLinearMeters ? `Metros facturables: ${currentItem.billableLinearMeters} m` : '',
          formData.pendingFiles?.length ? `${formData.pendingFiles.length} archivo(s) adjunto(s)` : '',
        ]
          .filter(Boolean)
          .join(' | '),

        cantidad: Number(currentItem.quantity) || 1,

        fechaEntrega,

        // Campos de medidas correctamente mapeados
        measurementWidthCm: currentItem.unitWidthCm ? Number(currentItem.unitWidthCm) : undefined,
        measurementHeightCm: currentItem.unitHeightCm ? Number(currentItem.unitHeightCm) : undefined,

        // Estado inicial (opcional, backend lo asigna por defecto)
        estado: 'pendiente',

        total: Number(currentItem.totalPrice) || 0,

        // Campos adicionales para compatibilidad
        linearMeters: currentItem.linearMetersRaw,
        linearMetersPerUnit: formData.linearMeters,
        spacingCm: formData.spacingCm,
        unitWidthCm: formData.unitWidthCm,
        unitHeightCm: formData.unitHeightCm,
        billableLinearMeters: currentItem.billableLinearMeters,
      };

      let pedidoResultante;

      if (isEditMode && pedido?.id) {
        // MODO EDICIÓN: Actualizar pedido existente
        pedidoResultante = await updatePedidoSafe(pedido.id, pedidoPayload);

        if (!pedidoResultante?.id) {
          throw new Error('No se pudo actualizar el pedido');
        }

        // Subir archivos nuevos si hay
        if (formData.pendingFiles && formData.pendingFiles.length > 0) {
          toast.info(`Subiendo ${formData.pendingFiles.length} archivo(s)...`);

          const uploadResults = await Promise.allSettled(
            formData.pendingFiles.map((file) =>
              pedidosService.uploadFileToOrder(pedidoResultante.id, file)
            )
          );

          const failedUploads = uploadResults.filter(r => r.status === 'rejected').length;
          const successUploads = uploadResults.filter(r => r.status === 'fulfilled').length;

          if (failedUploads > 0) {
            toast.warning(`Pedido actualizado. ${successUploads} archivo(s) subido(s), ${failedUploads} fallaron.`);
          } else {
            toast.success(`¡Pedido actualizado con ${successUploads} archivo(s) exitosamente!`);
          }
        } else {
          toast.success('¡Pedido actualizado exitosamente!');
        }

        if (onCancel) {
          onCancel();
        } else {
          navigate('/cliente');
        }
      } else {
        // MODO CREACIÓN: Crear nuevo pedido
        pedidoResultante = await createPedidoSafe(pedidoPayload);

        if (!pedidoResultante?.id) {
          throw new Error('No se pudo crear el pedido');
        }

        // Subir archivos asociándolos al pedido creado
        if (formData.pendingFiles && formData.pendingFiles.length > 0) {
          toast.info(`Subiendo ${formData.pendingFiles.length} archivo(s)...`);

          const uploadResults = await Promise.allSettled(
            formData.pendingFiles.map((file) =>
              pedidosService.uploadFileToOrder(pedidoResultante.id, file)
            )
          );

          const failedUploads = uploadResults.filter(r => r.status === 'rejected').length;
          const successUploads = uploadResults.filter(r => r.status === 'fulfilled').length;

          if (failedUploads > 0) {
            toast.warning(`Pedido creado. ${successUploads} archivo(s) subido(s), ${failedUploads} fallaron.`);
          } else {
            toast.success(`¡Pedido creado con ${successUploads} archivo(s) exitosamente!`);
          }
        } else {
          toast.success('¡Pedido creado exitosamente!');
        }

        navigate('/cliente');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : `Error al ${isEditMode ? 'actualizar' : 'crear'} el pedido`
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step2Details
            formData={formData}
            onChange={handleFieldChange}
            onUploadFiles={handleUploadFiles}
            pricingConfig={pricingConfig}
            onNext={() => {
              setCurrentStep(2);
            }}
          />
        );

      case 2:
        return (
          <Step4Review
            items={[]}
            currentItem={currentItem}
            formData={formData}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
            onPrev={() => setCurrentStep(1)}
            loading={loading}
            isEditMode={isEditMode}
          />
        );

      default:
        return null;
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/cliente');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {isEditMode ? 'Editar Pedido' : 'Crear Nuevo Pedido'}
          </h1>
          <p className="text-gray-600">
            {isEditMode
              ? 'Modifica los detalles de tu pedido pendiente'
              : 'Completa los pasos para realizar tu pedido de serigrafía con cálculo por metros lineales'
            }
          </p>
        </div>
        {isEditMode && (
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ✕ Cancelar
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {[1, 2].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                step <= currentStep
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 2) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <GlassCard className="p-8 mb-8">
        {renderStep()}
      </GlassCard>

      {/* El flujo actual confirma un unico item por pedido */}
    </div>
  );
}

