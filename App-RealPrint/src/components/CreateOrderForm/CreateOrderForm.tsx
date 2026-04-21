import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Step2Details } from './Step2Details';
import { Step4Review } from './Step4Review';
import { GlassCard } from '../ui';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { usePedidosData } from '../../hooks/usePedidosData';
import { usePricingConfig } from '../../hooks/usePricingConfig';
import { calculateOrderPricing } from './pricing';
import { orderService } from '../../services/orderService';

export function CreateOrderForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createPedidoSafe } = usePedidosData();
  const { pricingConfig } = usePricingConfig();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Tipo fijo para el flujo actual
    orderType: 'SCREENPRINTING',
    // Paso 1: detalles
    fileUrls: [] as string[],
    filesWithDimensions: [] as Array<{ id: string; name: string; url?: string; widthCm?: number; heightCm?: number }> ,
    quantity: 1,
    linearMeters: 0,
    spacingCm: 0,
    unitWidthCm: undefined as number | undefined,
    unitHeightCm: undefined as number | undefined,
    // Paso 2: confirmacion
    dataCorrect: false,
    termsAccepted: false,
  });

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUploadFiles = async (files: File[]) => {
    // Intentamos persistir en backend para que admin pueda descargar.
    // Si falla (modo local o backend no disponible), usamos nombres para no bloquear UX.
    try {
      const uploaded = await Promise.all(files.map((file) => orderService.uploadFile(file)));
      return uploaded.map((url, index) => (typeof url === 'string' && url.trim() ? url : files[index].name));
    } catch {
      toast.info('No se pudo completar la subida remota. Se guardarán nombres de archivo en local.');
      return files.map((file) => file.name);
    }
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
      const subservicioLabel = 'solo_serigrafia';
      const fechaEntrega = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const pedidoPayload = {
        clienteId: user.id,
        cliente: user.name || user.username || 'Cliente',
        servicio: serviceLabel,
        subservicio: subservicioLabel,
        opcion: 'cliente_ropa',
        pedido: `Pedido ${new Date().toISOString().split('T')[0]}`,
        descripcion: [
          `Tipo: Solo serigrafia`,
          currentItem.unitWidthCm && currentItem.unitHeightCm
            ? `Unidad referencia: ${Number(currentItem.unitWidthCm).toFixed(1)} x ${Number(currentItem.unitHeightCm).toFixed(1)} cm`
            : '',
          currentItem.linearMeters ? `Metros lineales por unidad: ${Number(currentItem.linearMeters).toFixed(2)} m` : '',
          currentItem.linearMetersRaw ? `Metros lineales reales: ${Number(currentItem.linearMetersRaw).toFixed(2)} m` : '',
          currentItem.spacingCm ? `Distancia entre unidades: ${currentItem.spacingCm} cm` : '',
          currentItem.rows && currentItem.unitsPerRow ? `Distribucion: ${currentItem.unitsPerRow} por fila x ${currentItem.rows} filas` : '',
          currentItem.billableLinearMeters ? `Metros lineales facturables: ${currentItem.billableLinearMeters} m` : '',
          currentItem.fileUrls?.length ? `Archivos: ${currentItem.fileUrls.join(', ')}` : '',
        ]
          .filter(Boolean)
          .join(' | '),
        cantidad: Number(currentItem.quantity) || 1,
        cantidadUnidades: Number(currentItem.quantity) || 1,
        fechaEntrega,
        linearMeters: Number(currentItem.linearMetersRaw) || 0,
        linearMetersPerUnit: Number(currentItem.linearMeters) || 0,
        spacingCm: Number(currentItem.spacingCm) || 0,
        materialWidthCm: 60,
        unitWidthCm: Number(currentItem.unitWidthCm) || 0,
        unitHeightCm: Number(currentItem.unitHeightCm) || 0,
        filesWithDimensions: currentItem.filesWithDimensions || [],
        billableLinearMeters: Number(currentItem.billableLinearMeters) || 0,
        fileUrls: currentItem.fileUrls || [],
        total: Number(currentItem.totalPrice) || 0,
      };

      await createPedidoSafe(pedidoPayload);
      toast.success('¡Pedido creado exitosamente!');
      navigate('/cliente');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al crear el pedido'
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
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Crear Nuevo Pedido</h1>
        <p className="text-gray-600">
          Completa los pasos para realizar tu pedido de serigrafía con cálculo por metros lineales
        </p>
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

