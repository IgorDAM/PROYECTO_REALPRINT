import { useData } from "../context/DataContext";
import type { DataContextValue } from "../context/data/dataContext.types";

type ProductosData = Pick<
  DataContextValue,
  "productosFinales"
>;

/**
 * Hook de dominio para el catálogo de prendas.
 * Mantiene nombres legacy (`productosFinales`) por compatibilidad de contrato.
 */
export function useProductosData(): ProductosData {
  const { productosFinales } = useData();

  return {
    productosFinales,
  };
}


