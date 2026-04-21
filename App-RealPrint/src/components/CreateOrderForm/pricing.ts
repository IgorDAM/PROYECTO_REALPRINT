import {
  DEFAULT_PRICING_CONFIG,
  getRangeForLinearMeters,
  type PricingConfig,
} from "../../utils/pricingConfig";

export const MATERIAL_WIDTH_CM = 60;

export interface LayoutMetricsInput {
  quantity?: number;
  spacingCm?: number;
  linearMeters?: number;
  unitWidthCm?: number;
  unitHeightCm?: number;
}

export interface LayoutMetricsResult {
  quantity: number;
  spacingCm: number;
  unitWidthCm?: number;
  unitHeightCm?: number;
  unitsPerRow: number;
  rows: number;
  linearMetersPerUnit: number;
  totalLinearMetersRaw: number;
  billableLinearMeters: number;
}

export function calculateLayoutMetrics({
  quantity,
  spacingCm,
  linearMeters,
  unitWidthCm,
  unitHeightCm,
}: LayoutMetricsInput): LayoutMetricsResult {
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  const safeSpacingCm = Math.max(0, Number(spacingCm) || 0);
  const safeUnitWidthCm = Number(unitWidthCm) > 0 ? Number(unitWidthCm) : undefined;
  const safeUnitHeightCm = Number(unitHeightCm) > 0 ? Number(unitHeightCm) : undefined;

  const canUseLayoutByDimensions = Boolean(safeUnitWidthCm && safeUnitHeightCm);
  const unitsPerRow = canUseLayoutByDimensions
    ? Math.max(1, Math.floor((MATERIAL_WIDTH_CM + safeSpacingCm) / (safeUnitWidthCm! + safeSpacingCm)))
    : 1;
  const rows = Math.max(1, Math.ceil(safeQuantity / unitsPerRow));

  const linearMetersPerUnit = canUseLayoutByDimensions
    ? safeUnitHeightCm! / 100
    : Math.max(0, Number(linearMeters) || 0);

  const totalLinearMetersRaw = canUseLayoutByDimensions
    ? (rows * safeUnitHeightCm! + Math.max(0, rows - 1) * safeSpacingCm) / 100
    : linearMetersPerUnit * safeQuantity + (safeQuantity > 1 ? ((safeQuantity - 1) * safeSpacingCm) / 100 : 0);

  const billableLinearMeters = Math.max(1, Math.ceil(totalLinearMetersRaw));

  return {
    quantity: safeQuantity,
    spacingCm: safeSpacingCm,
    unitWidthCm: safeUnitWidthCm,
    unitHeightCm: safeUnitHeightCm,
    unitsPerRow,
    rows,
    linearMetersPerUnit,
    totalLinearMetersRaw,
    billableLinearMeters,
  };
}

export interface PricingBreakdownItem {
  label: string;
  price: number;
}

export interface PricingInput {
  orderType?: string;
  quantity?: number;
  linearMeters?: number;
  spacingCm?: number;
  unitWidthCm?: number;
  unitHeightCm?: number;
  selectedProductPrice?: number;
  selectedProductLabel?: string;
  pricingConfig?: PricingConfig;
}

export interface PricingResult {
  unitPrice: number;
  quantity: number;
  linearMetersPerUnit: number;
  rows: number;
  unitsPerRow: number;
  totalLinearMetersRaw: number;
  totalLinearMeters: number;
  totalPrice: number;
  breakdown: PricingBreakdownItem[];
}

export function calculateOrderPricing({
  orderType,
  quantity,
  linearMeters,
  spacingCm,
  unitWidthCm,
  unitHeightCm,
  pricingConfig = DEFAULT_PRICING_CONFIG,
}: PricingInput): PricingResult {
  let unitPrice = 0;
  const breakdown: PricingBreakdownItem[] = [];
  const layout = calculateLayoutMetrics({
    quantity,
    linearMeters,
    spacingCm,
    unitWidthCm,
    unitHeightCm,
  });
  const billableLinearMeters = layout.billableLinearMeters;
  const activeRange = getRangeForLinearMeters(billableLinearMeters, pricingConfig);

  const isOnlyScreenPrinting = orderType === "SCREENPRINTING" || !orderType;
  if (isOnlyScreenPrinting) {
    unitPrice = activeRange?.pricePerLinearMeter || 0;
    breakdown.push({
      label: activeRange
        ? `${activeRange.label} (${billableLinearMeters} m lineales)`
        : `Metros lineales fuera de rango (${billableLinearMeters} m)`,
      price: unitPrice * billableLinearMeters,
    });
  }

  return {
    unitPrice,
    quantity: layout.quantity,
    linearMetersPerUnit: layout.linearMetersPerUnit,
    rows: layout.rows,
    unitsPerRow: layout.unitsPerRow,
    totalLinearMetersRaw: layout.totalLinearMetersRaw,
    totalLinearMeters: billableLinearMeters,
    totalPrice: unitPrice * billableLinearMeters,
    breakdown,
  };
}

