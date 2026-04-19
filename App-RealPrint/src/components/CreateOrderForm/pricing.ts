export interface PricingBreakdownItem {
  label: string;
  price: number;
}

export interface PricingInput {
  orderType?: string;
  quantity?: number;
  clientProvidedClothing?: boolean | null;
  selectedProductPrice?: number;
  selectedProductLabel?: string;
}

export interface PricingResult {
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  breakdown: PricingBreakdownItem[];
}

const BASE_SCREENPRINTING_PRICE = 3.5;
const BASE_PRESSING_PRICE = 2.0;

export function calculateOrderPricing({
  orderType,
  quantity,
  clientProvidedClothing,
  selectedProductPrice = 0,
  selectedProductLabel = "Prenda",
}: PricingInput): PricingResult {
  let unitPrice = 0;
  const breakdown: PricingBreakdownItem[] = [];

  if (orderType === "SCREENPRINTING") {
    unitPrice = BASE_SCREENPRINTING_PRICE;
    breakdown.push({ label: "Serigrafia base", price: BASE_SCREENPRINTING_PRICE });
  } else if (orderType === "SCREENPRINTING_PRESSING") {
    unitPrice = BASE_SCREENPRINTING_PRICE + BASE_PRESSING_PRICE;
    breakdown.push({ label: "Serigrafia", price: BASE_SCREENPRINTING_PRICE });
    breakdown.push({ label: "Planchado", price: BASE_PRESSING_PRICE });

    if (clientProvidedClothing === false && selectedProductPrice > 0) {
      unitPrice += selectedProductPrice;
      breakdown.push({ label: selectedProductLabel, price: selectedProductPrice });
    }
  }

  const safeQuantity = Math.max(1, Number(quantity) || 1);

  return {
    unitPrice,
    quantity: safeQuantity,
    totalPrice: unitPrice * safeQuantity,
    breakdown,
  };
}

