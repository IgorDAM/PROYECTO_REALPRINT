import { GlassCard } from '../ui';
import { calculateOrderPricing } from './pricing';
import type { PricingConfig } from '../../utils/pricingConfig';

interface PricesSummaryProps {
  orderType: string;
  formData: {
    quantity?: number;
    linearMeters?: number;
    spacingCm?: number;
    unitWidthCm?: number;
    unitHeightCm?: number;
  };
  showDetailedBreakdown?: boolean;
  pricingConfig?: PricingConfig;
}

export function PricesSummary({
  orderType,
  formData,
  showDetailedBreakdown = false,
  pricingConfig,
}: PricesSummaryProps) {
  // Comentario didáctico: este cálculo centraliza las reglas de tramos por metro lineal.
  const {
    unitPrice,
    totalPrice,
    breakdown,
    linearMetersPerUnit,
    totalLinearMeters,
    rows,
    unitsPerRow,
    totalLinearMetersRaw,
  } = calculateOrderPricing({
    orderType,
    quantity: formData.quantity,
    linearMeters: formData.linearMeters,
    spacingCm: formData.spacingCm,
    unitWidthCm: formData.unitWidthCm,
    unitHeightCm: formData.unitHeightCm,
    pricingConfig,
  });

  return (
    <GlassCard className="bg-green-50 p-4 border border-green-200">
      <h3 className="font-semibold text-green-900 mb-3">Desglose de Precios</h3>

      {showDetailedBreakdown && breakdown.length > 0 ? (
        <div className="space-y-2 mb-3 pb-3 border-b border-green-200">
          {breakdown.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-green-800">{item.label}:</span>
              <span className="font-medium text-green-900">
                €{item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="space-y-2">
        {/* Comentario didáctico: unitPrice ya es el precio por metro según el tramo activo. */}
        <div className="flex justify-between text-sm">
          <span className="text-green-800">Precio por metro lineal:</span>
          <span className="font-semibold text-green-900">
            €{unitPrice.toFixed(2)}
          </span>
        </div>

        {linearMetersPerUnit ? (
          <div className="flex justify-between text-sm">
            <span className="text-green-800">
              Metros lineales por unidad: {linearMetersPerUnit.toFixed(2)}
            </span>
            <span className="font-semibold text-green-900">
              × {formData.quantity || 1}
            </span>
          </div>
        ) : null}

        {formData.unitWidthCm && formData.unitHeightCm ? (
          <div className="flex justify-between text-sm">
            <span className="text-green-800">
              Unidad referencia: {formData.unitWidthCm} x {formData.unitHeightCm} cm
            </span>
            <span className="font-semibold text-green-900">
              {unitsPerRow} por fila
            </span>
          </div>
        ) : null}

        {formData.spacingCm ? (
          <div className="flex justify-between text-sm">
            <span className="text-green-800">
              Distancia entre unidades: {formData.spacingCm} cm
            </span>
            <span className="font-semibold text-green-900">Incluida</span>
          </div>
        ) : null}

        <div className="flex justify-between text-sm">
          <span className="text-green-800">
            Metros lineales reales:
          </span>
          <span className="font-semibold text-green-900">
            {totalLinearMetersRaw.toFixed(2)} m
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-green-800">
            Metros lineales facturables ({rows} filas):
          </span>
          <span className="font-semibold text-green-900">
            {totalLinearMeters.toFixed(2)} m
          </span>
        </div>

        {formData.quantity && formData.quantity > 1 ? (
          <div className="flex justify-between text-sm">
            <span className="text-green-800">
              Cantidad: {formData.quantity} unidades
            </span>
            <span className="font-semibold text-green-900">
              × €{unitPrice.toFixed(2)}
            </span>
          </div>
        ) : null}

        <div className="border-t border-green-200 pt-2 flex justify-between">
          <span className="font-semibold text-green-900">Total facturable:</span>
          <span className="text-lg font-bold text-green-900">
            €{totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}

