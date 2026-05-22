import { useEffect, useState } from "react";
import {
  DEFAULT_PRICING_CONFIG,
  normalizePricingConfig,
  PRICING_CONFIG_KEY,
  type PricingConfig,
} from "../utils/pricingConfig";

/** Hook para manejar la configuracion de precios en localStorage.
 * - Carga la configuracion al iniciar (o usa default).
 *  - Sincroniza cambios a localStorage.
 *  - Retorna la configuracion actual y una funcion para actualizarla.
 *
 * Esto permite que la configuracion de precios sea persistente y editable desde la UI.
 * Las pantallas pueden usar esta configuracion para calcular precios sin acoplarse a detalles de almacenamiento.
 *
 * Nota: Este hook asume que solo una instancia de la app modificará la configuracion. Si hay múltiples pestañas, podrían sobrescribirse entre sí.
 * Para casos más complejos, se podría considerar usar un estado global (Context) o una solución de sincronización entre pestañas
*/

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

  // Sincroniza cambios en pricingConfig a localStorage.

  useEffect(() => {
    localStorage.setItem(PRICING_CONFIG_KEY, JSON.stringify(pricingConfig));
  }, [pricingConfig]);

  return { pricingConfig, setPricingConfig };
}

