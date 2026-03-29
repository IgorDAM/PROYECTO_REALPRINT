import { useData } from "../context/DataContext";
import type { DataContextValue } from "../context/data/dataContext.types";

type InventarioData = Pick<
  DataContextValue,
  | "inventario"
  | "updateInventario"
  | "updateInventarioSafe"
  | "addInventario"
  | "addInventarioSafe"
  | "deleteInventario"
  | "deleteInventarioSafe"
>;

/**
 * Hook de dominio para inventario.
 * Expone operaciones legacy y safe para migracion incremental.
 */
export function useInventarioData(): InventarioData {
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


