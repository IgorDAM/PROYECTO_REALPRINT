export interface PriceRange {
  id: string;
  label: string;
  minLinearMeters: number;
  maxLinearMeters: number;
  pricePerLinearMeter: number;
}

export interface PricingConfig {
  materialWidthCm: number;
  tiers: PriceRange[];
}

export const MATERIAL_WIDTH_CM = 60;

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  materialWidthCm: MATERIAL_WIDTH_CM,
  tiers: [
    {
      id: "tier-1",
      label: "1 metro lineal",
      minLinearMeters: 1,
      maxLinearMeters: 1,
      pricePerLinearMeter: 12,
    },
    {
      id: "tier-2-5",
      label: "2-5 metros lineales",
      minLinearMeters: 2,
      maxLinearMeters: 5,
      pricePerLinearMeter: 11,
    },
    {
      id: "tier-6-20",
      label: "6-20 metros lineales",
      minLinearMeters: 6,
      maxLinearMeters: 20,
      pricePerLinearMeter: 10,
    },
    {
      id: "tier-21-50",
      label: "21-50 metros lineales",
      minLinearMeters: 21,
      maxLinearMeters: 50,
      pricePerLinearMeter: 9,
    },
    {
      id: "tier-51-plus",
      label: "+51 metros lineales",
      minLinearMeters: 51,
      maxLinearMeters: 999999,
      pricePerLinearMeter: 8,
    },
  ],
};

export const PRICING_CONFIG_KEY = "realprint_pricing_config_v2";

export function getRangeForLinearMeters(
  linearMeters: number,
  config: PricingConfig,
): PriceRange | null {
  const safeMeters = Math.max(1, Math.ceil(Number(linearMeters) || 0));

  return (
    [...config.tiers]
      .sort((a, b) => a.minLinearMeters - b.minLinearMeters)
      .find((tier) => safeMeters >= tier.minLinearMeters && safeMeters <= tier.maxLinearMeters) ||
    null
  );
}

function normalizeTier(candidate: any, idx: number): PriceRange | null {
  if (!candidate || typeof candidate !== "object") return null;

  const isLegacyShape =
    "maxWidthCm" in candidate ||
    "maxHeightCm" in candidate ||
    "soloSerigrafiaPrice" in candidate;
  if (isLegacyShape && !("minLinearMeters" in candidate) && !("pricePerLinearMeter" in candidate)) {
    return null;
  }

  const minLinearMeters = Math.max(1, Number(candidate.minLinearMeters) || 0);
  const maxCandidate = Number(candidate.maxLinearMeters);
  const maxLinearMeters = Number.isFinite(maxCandidate)
    ? Math.max(minLinearMeters, maxCandidate)
    : 999999;

  return {
    id: String(candidate.id || `tier-${idx}`),
    label: String(candidate.label || `Tramo ${idx + 1}`),
    minLinearMeters,
    maxLinearMeters,
    pricePerLinearMeter: Math.max(0, Number(candidate.pricePerLinearMeter) || 0),
  };
}

export function normalizePricingConfig(input: unknown): PricingConfig {
  if (!input || typeof input !== "object") return DEFAULT_PRICING_CONFIG;

  const rawConfig = input as Record<string, unknown>;
  const materialWidthCm = Math.max(
    1,
    Number(rawConfig.materialWidthCm) || MATERIAL_WIDTH_CM,
  );
  const candidates = Array.isArray(rawConfig.tiers)
    ? rawConfig.tiers
    : Array.isArray(rawConfig.ranges)
      ? rawConfig.ranges
      : [];

  const normalizedTiers = candidates
    .filter((tier) => tier && typeof tier === "object")
    .map((tier, idx) => normalizeTier(tier, idx))
    .filter((tier): tier is PriceRange => Boolean(tier));

  return normalizedTiers.length
    ? { materialWidthCm, tiers: normalizedTiers }
    : DEFAULT_PRICING_CONFIG;
}

