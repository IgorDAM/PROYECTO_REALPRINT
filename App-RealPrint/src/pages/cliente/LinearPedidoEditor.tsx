import { useEffect, useMemo, useState } from 'react';
import { Button, GlassCard, Input } from '../../components/ui';
import { OrderLayoutPreview } from '../../components/CreateOrderForm/OrderLayoutPreview';
import { PricesSummary } from '../../components/CreateOrderForm/PricesSummary';
import { calculateOrderPricing } from '../../components/CreateOrderForm/pricing';
import { useApiStatus } from '../../hooks/useApiStatus';
import { usePedidosData } from '../../hooks/usePedidosData';
import { usePricingConfig } from '../../hooks/usePricingConfig';

type PedidoLike = Record<string, any>;

interface LinearPedidoEditorProps {
  pedido: PedidoLike;
  onCancel: () => void;
}

function buildInitialState(pedido: PedidoLike) {
  return {
    fileUrls: Array.isArray(pedido.fileUrls) && pedido.fileUrls.length > 0 ? pedido.fileUrls : [],
    quantity: Number(pedido.quantity ?? pedido.cantidad ?? 1) || 1,
    linearMeters: Number(pedido.linearMeters ?? 1) || 1,
    spacingCm: Number(pedido.spacingCm ?? 0) || 0,
  };
}

export default function LinearPedidoEditor({ pedido, onCancel }: LinearPedidoEditorProps) {
  const { updatePedidoSafe } = usePedidosData();
  const { pricingConfig } = usePricingConfig();
  const { loading: guardando, error: errorGuardado, runApi } = useApiStatus();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState(() => buildInitialState(pedido));

  useEffect(() => {
    setFormData(buildInitialState(pedido));
    setErrors({});
  }, [pedido]);

  const pricing = useMemo(
    () =>
      calculateOrderPricing({
        orderType: 'SCREENPRINTING',
        quantity: formData.quantity,
        linearMeters: formData.linearMeters,
        spacingCm: formData.spacingCm,
        pricingConfig,
      }),
    [formData.linearMeters, formData.quantity, formData.spacingCm, pricingConfig]
  );

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!Array.isArray(formData.fileUrls) || formData.fileUrls.length === 0) {
      nextErrors.fileUrls = 'Por favor sube al menos un archivo';
    }
    if (!formData.quantity || formData.quantity < 1) {
      nextErrors.quantity = 'La cantidad debe ser mayor a 0';
    }
    if (!formData.linearMeters || formData.linearMeters < 1) {
      nextErrors.linearMeters = 'Los metros lineales deben ser mayores a 0';
    }
    if (formData.spacingCm < 0) {
      nextErrors.spacingCm = 'La distancia no puede ser negativa';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const totalLinearMeters = pricing.totalLinearMeters;
    const payload = {
      ...pedido,
      servicio: 'serigrafia',
      subservicio: 'solo_serigrafia',
      opcion: 'cliente_ropa',
      fileUrls: formData.fileUrls,
      quantity: formData.quantity,
      cantidad: formData.quantity,
      cantidadUnidades: formData.quantity,
      linearMeters: formData.linearMeters,
      spacingCm: formData.spacingCm,
      materialWidthCm: 60,
      billableLinearMeters: totalLinearMeters,
      total: pricing.totalPrice,
      descripcion: [
        'Tipo: Solo serigrafia',
        `Metros lineales por unidad: ${Number(formData.linearMeters).toFixed(2)} m`,
        formData.spacingCm ? `Distancia entre unidades: ${formData.spacingCm} cm` : '',
        `Metros lineales facturables: ${totalLinearMeters} m`,
        formData.fileUrls.length ? `Archivos: ${formData.fileUrls.join(', ')}` : '',
      ]
        .filter(Boolean)
        .join(' | '),
    };

    await runApi(async () => {
      await updatePedidoSafe(pedido.id, payload);
      onCancel();
    }, 'No se ha podido guardar el pedido');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">Editar pedido de serigrafía</h1>
        <p className="text-surface-500 mt-1">
          Actualiza archivos, cantidad, metros lineales y separación con el mismo flujo que en la creación.
        </p>
      </div>

      {errorGuardado && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorGuardado}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form className="xl:col-span-2 space-y-6" onSubmit={handleSubmit}>
          <GlassCard className="p-5 sm:p-6" hover={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivos de diseño
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []).map((file) => file.name);
                    if (files.length > 0) {
                      handleChange('fileUrls', files);
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-orange-500"
                />
                <p className="mt-1 text-xs text-surface-500">
                  Seleccionar nuevos archivos reemplaza los actuales.
                </p>
                {Array.isArray(formData.fileUrls) && formData.fileUrls.length > 0 ? (
                  <ul className="mt-2 space-y-1 text-xs text-slate-600">
                    {formData.fileUrls.map((fileUrl, index) => (
                      <li key={`${fileUrl}-${index}`} className="rounded bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                        {fileUrl}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {errors.fileUrls && <p className="mt-1 text-sm text-red-500">{errors.fileUrls}</p>}
              </div>

              <Input
                label="Cantidad de unidades"
                type="number"
                min="1"
                max="1000"
                value={formData.quantity || ''}
                onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
                error={errors.quantity}
              />

              <Input
                label="Metros lineales por unidad"
                type="number"
                min="1"
                step="0.01"
                value={formData.linearMeters || ''}
                onChange={(e) => handleChange('linearMeters', parseFloat(e.target.value) || 0)}
                error={errors.linearMeters}
              />

              <Input
                label="Distancia entre unidades (cm)"
                type="number"
                min="0"
                step="0.1"
                value={formData.spacingCm ?? 0}
                onChange={(e) => handleChange('spacingCm', Math.max(0, parseFloat(e.target.value) || 0))}
                error={errors.spacingCm}
              />
            </div>
          </GlassCard>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="button" variant="secondary" onClick={onCancel} className="sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </form>

        <div className="space-y-6">
          <OrderLayoutPreview
            fileUrls={formData.fileUrls}
            quantity={formData.quantity}
            linearMeters={formData.linearMeters}
            spacingCm={formData.spacingCm}
          />
          <PricesSummary orderType="SCREENPRINTING" formData={formData} pricingConfig={pricingConfig} />
        </div>
      </div>
    </div>
  );
}

