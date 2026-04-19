export interface PriceRange {
  id: string;
  label: string;
  maxWidthCm: number;
  maxHeightCm: number;
  soloSerigrafiaPrice: number;
  serigrafiaPlanchadoPrice: number;
}

export interface PricingConfig {
  ranges: PriceRange[];
}

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  ranges: [
    {
      id: "small",
      label: "Pequeno",
      maxWidthCm: 10,
      maxHeightCm: 10,
      soloSerigrafiaPrice: 3.5,
      serigrafiaPlanchadoPrice: 5.5,
    },
    {
      id: "medium",
      label: "Mediano",
      maxWidthCm: 15,
      maxHeightCm: 15,
      soloSerigrafiaPrice: 4.25,
      serigrafiaPlanchadoPrice: 6.25,
    },
    {
      id: "large",
      label: "Grande",
      maxWidthCm: 25,
      maxHeightCm: 30,
      soloSerigrafiaPrice: 5.5,
      serigrafiaPlanchadoPrice: 7.5,
    },
  ],
};

export const PRICING_CONFIG_KEY = "realprint_pricing_config_v1";

export function getRangeForMeasurement(
  widthCm: number,
  heightCm: number,
  config: PricingConfig,
): PriceRange | null {
  if (!widthCm || !heightCm) return null;
  const safeWidth = Math.max(0, Number(widthCm));
  const safeHeight = Math.max(0, Number(heightCm));

  return (
    [...config.ranges]
      .sort((a, b) => a.maxWidthCm * a.maxHeightCm - b.maxWidthCm * b.maxHeightCm)
      .find((range) => safeWidth <= range.maxWidthCm && safeHeight <= range.maxHeightCm) || null
  );
}

export function normalizePricingConfig(input: unknown): PricingConfig {
  if (!input || typeof input !== "object") return DEFAULT_PRICING_CONFIG;
  const maybeRanges = (input as PricingConfig).ranges;
  if (!Array.isArray(maybeRanges) || maybeRanges.length === 0) return DEFAULT_PRICING_CONFIG;

  const normalizedRanges = maybeRanges
    .filter((range) => range && typeof range === "object")
    .map((range: any, idx: number) => ({
      id: String(range.id || `range-${idx}`),
      label: String(range.label || `Rango ${idx + 1}`),
      maxWidthCm: Math.max(1, Number(range.maxWidthCm) || 1),
      maxHeightCm: Math.max(1, Number(range.maxHeightCm) || 1),
      soloSerigrafiaPrice: Math.max(0, Number(range.soloSerigrafiaPrice) || 0),
      serigrafiaPlanchadoPrice: Math.max(0, Number(range.serigrafiaPlanchadoPrice) || 0),
    }));

  return normalizedRanges.length ? { ranges: normalizedRanges } : DEFAULT_PRICING_CONFIG;
}

