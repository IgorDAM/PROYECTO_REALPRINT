import { useData } from "../context/DataContext";

/**
 * Hook de dominio para tareas de operario.
 */
export function useTareasData() {
  const { tareas, updateTarea } = useData();

  return {
    tareas,
    updateTarea,
  };
}

