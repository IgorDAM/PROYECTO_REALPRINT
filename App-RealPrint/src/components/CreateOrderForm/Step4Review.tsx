import { Button, GlassCard } from '../ui';

interface Step4ReviewProps {
  items: any[];
  formData: any;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
  onPrev: () => void;
  loading?: boolean;
}

export function Step4Review({
  items,
  formData,
  onChange,
  onSubmit,
  onPrev,
  loading = false,
}: Step4ReviewProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const taxRate = 0.21; // IVA 21%
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Revisión y Confirmación</h2>

      {/* Items Summary */}
      <GlassCard className="p-6">
        <h3 className="font-semibold text-lg mb-4">Resumen de Items</h3>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="pb-3 border-b last:border-b-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium">
                    {item.type === 'SCREENPRINTING' ? 'Serigrafía Simple' : 'Serigrafía + Planchado'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} unidades
                    {item.measurementCm && ` • ${item.measurementCm}cm`}
                    {item.clothingType && ` • ${item.clothingType}`}
                    {item.locationPlacement && ` • ${item.locationPlacement}`}
                  </p>
                </div>
                <p className="font-semibold">€{(item.price || 0).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Price Summary */}
      <GlassCard className="bg-gradient-to-r from-orange-50 to-orange-100 p-6">
        <h3 className="font-semibold text-lg mb-4">Resumen de Precios</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>IVA (21%):</span>
            <span>€{tax.toFixed(2)}</span>
          </div>
          <div className="border-t-2 border-orange-200 pt-2 flex justify-between text-lg font-bold text-orange-600">
            <span>Total:</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>
      </GlassCard>

      {/* Terms and Conditions */}
      <GlassCard className="p-6">
        <h3 className="font-semibold mb-4">Aceptación</h3>
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.dataCorrect || false}
              onChange={(e) => onChange('dataCorrect', e.target.checked)}
              className="mt-1 w-5 h-5 text-orange-500 rounded"
            />
            <span className="text-sm text-gray-700">
              Confirmo que los datos del pedido son correctos y que he revisado toda la información.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.termsAccepted || false}
              onChange={(e) => onChange('termsAccepted', e.target.checked)}
              className="mt-1 w-5 h-5 text-orange-500 rounded"
            />
            <span className="text-sm text-gray-700">
              Acepto los{' '}
              <a href="#" className="text-orange-600 hover:underline font-medium">
                términos de servicio
              </a>{' '}
              y la{' '}
              <a href="#" className="text-orange-600 hover:underline font-medium">
                política de privacidad
              </a>
              .
            </span>
          </label>
        </div>
      </GlassCard>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onPrev}
          variant="secondary"
          disabled={loading}
          className="flex-1"
        >
          Atrás
        </Button>
        <Button
          onClick={onSubmit}
          disabled={
            loading ||
            !formData.dataCorrect ||
            !formData.termsAccepted
          }
          className="flex-1"
        >
          {loading ? 'Creando pedido...' : 'Confirmar Pedido'}
        </Button>
      </div>
    </div>
  );
}

