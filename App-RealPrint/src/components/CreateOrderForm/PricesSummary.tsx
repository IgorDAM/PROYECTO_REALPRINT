import { GlassCard } from '../ui';

interface PricesSummaryProps {
  orderType: string;
  formData: any;
  showDetailedBreakdown?: boolean;
}

export function PricesSummary({
  orderType,
  formData,
  showDetailedBreakdown = false,
}: PricesSummaryProps) {
  // Precios base (estos deberían venir de la API en producción)
  const BASE_SCREENPRINTING_PRICE = 3.5;
  const BASE_PRESSING_PRICE = 2.0;

  let pricePerUnit = 0;
  let breakdown = [];

  if (orderType === 'SCREENPRINTING') {
    pricePerUnit = BASE_SCREENPRINTING_PRICE;
    breakdown = [
      { label: 'Serigrafía base', price: BASE_SCREENPRINTING_PRICE },
    ];
  } else if (orderType === 'SCREENPRINTING_PRESSING') {
    pricePerUnit = BASE_SCREENPRINTING_PRICE + BASE_PRESSING_PRICE;
    breakdown = [
      { label: 'Serigrafía', price: BASE_SCREENPRINTING_PRICE },
      { label: 'Planchado', price: BASE_PRESSING_PRICE },
    ];

    // Agregar marcaje si está seleccionado
    if (formData.locationPlacementId) {
      pricePerUnit += 5.0; // Precio base de la ubicación
      breakdown.push({ label: 'Marcaje (ubicación)', price: 5.0 });
    }

    // Agregar prenda si es RealPrint quien la proporciona
    if (
      formData.clientProvidedClothing === false &&
      formData.inventoryProductId
    ) {
      const productPrice = 5.5; // Mock - obtener de API
      pricePerUnit += productPrice;
      breakdown.push({ label: 'Prenda', price: productPrice });
    }
  }

  const totalPrice = pricePerUnit * (formData.quantity || 1);

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
        <div className="flex justify-between text-sm">
          <span className="text-green-800">Precio unitario:</span>
          <span className="font-semibold text-green-900">
            €{pricePerUnit.toFixed(2)}
          </span>
        </div>

        {formData.quantity && formData.quantity > 1 ? (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-green-800">
                Cantidad: {formData.quantity} unidades
              </span>
              <span className="font-semibold text-green-900">
                × €{pricePerUnit.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-green-200 pt-2 flex justify-between">
              <span className="font-semibold text-green-900">Total:</span>
              <span className="text-lg font-bold text-green-900">
                €{totalPrice.toFixed(2)}
              </span>
            </div>
          </>
        ) : null}
      </div>
    </GlassCard>
  );
}

