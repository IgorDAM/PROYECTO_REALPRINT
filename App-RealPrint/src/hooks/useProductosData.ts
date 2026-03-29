import { useData } from "../context/DataContext";
import type { DataContextValue } from "../context/data/dataContext.types";

type ProductosData = Pick<
  DataContextValue,
  "productosFinales" | "addProductoFinal" | "updateProductoFinal" | "deleteProductoFinal"
>;

/**
 * Hook de dominio para productos finales.
 */
export function useProductosData(): ProductosData {
  const {
    productosFinales,
    addProductoFinal,
    updateProductoFinal,
    deleteProductoFinal,
  } = useData();

  return {
    productosFinales,
    addProductoFinal,
    updateProductoFinal,
    deleteProductoFinal,
  };
}


