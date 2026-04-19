import { useEffect, useState } from "react";
import {
  DEFAULT_PRICING_CONFIG,
  normalizePricingConfig,
  PRICING_CONFIG_KEY,
  type PricingConfig,
} from "../utils/pricingConfig";

export function usePricingConfig() {
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(() => {
    const raw = localStorage.getItem(PRICING_CONFIG_KEY);
    if (!raw) return DEFAULT_PRICING_CONFIG;

    try {
      return normalizePricingConfig(JSON.parse(raw));
    } catch {
      return DEFAULT_PRICING_CONFIG;
    }
  });

  useEffect(() => {
    localStorage.setItem(PRICING_CONFIG_KEY, JSON.stringify(pricingConfig));
  }, [pricingConfig]);

  return { pricingConfig, setPricingConfig };
}

