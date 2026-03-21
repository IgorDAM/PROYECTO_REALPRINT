import { useData } from "../context/DataContext";

/**
 * Hook de dominio para inventario.
 * Expone operaciones legacy y safe para migracion incremental.
 */
export function useInventarioData() {
  const {
    inventario,
    updateInventario,
    updateInventarioSafe,
    addInventario,
    addInventarioSafe,
    deleteInventario,
    deleteInventarioSafe,
  } = useData();

  return {
    inventario,
    updateInventario,
    updateInventarioSafe,
    addInventario,
    addInventarioSafe,
    deleteInventario,
    deleteInventarioSafe,
  };
}

