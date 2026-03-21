import { useData } from "../context/DataContext";

/**
 * Hook de dominio para productos finales.
 */
export function useProductosData() {
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

