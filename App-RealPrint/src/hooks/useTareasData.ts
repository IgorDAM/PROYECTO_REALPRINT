import { useData } from "../context/DataContext";
import type { DataContextValue } from "../context/data/dataContext.types";

type TareasData = Pick<DataContextValue, "tareas" | "updateTarea">;

/**
 * Hook de dominio para tareas de operario.
 */
export function useTareasData(): TareasData {
  const { tareas, updateTarea } = useData();

  return {
    tareas,
    updateTarea,
  };
}


