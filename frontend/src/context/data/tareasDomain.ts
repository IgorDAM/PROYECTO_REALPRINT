type Entity = Record<string, any>;
type SetState<T> = (value: T | ((prev: T) => T)) => void;

interface TareasDomainConfig {
  tareas: Entity[];
  setTareas: SetState<Entity[]>;
  usuarios: Entity[];
}

interface TareasDomainOps {
  addTareaPorPedido: (pedido: Entity) => void;
  updateTarea: (id: number | string, updates: Record<string, any>) => void;
}

/**
 * Construye operaciones del dominio tareas.
 * NOTA: La asignación automática de tareas fue eliminada después de unificar operarios con administradores.
 */
export function createTareasDomain({ tareas, setTareas, usuarios }: TareasDomainConfig): TareasDomainOps {
  const addTareaPorPedido = (pedido) => {
    // Funcionalidad de asignación de operarios removida
    // Los administradores ahora manejan todas las operativas de producción
    return;
  };

  const updateTarea = (id, updates) => {
    setTareas(tareas.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  return {
    addTareaPorPedido,
    updateTarea,
  };
}


