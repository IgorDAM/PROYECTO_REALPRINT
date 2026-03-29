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
 * Mantiene reglas de asignacion de operario desacopladas de DataContext.
 */
export function createTareasDomain({ tareas, setTareas, usuarios }: TareasDomainConfig): TareasDomainOps {
  const addTareaPorPedido = (pedido) => {
    const servicioKey = (pedido.servicio || "").toLowerCase();
    const operario = usuarios.find(
      (u) => u.role === "operario" && (u.especialidad || "").toLowerCase() === servicioKey,
    );

    if (!operario) return;

    const nuevaTarea = {
      id: Date.now(),
      operarioId: operario.id,
      pedidoId: pedido.id,
      tarea: `Atender pedido de ${pedido.servicio}`,
      estado: "pendiente",
      fechaCreacion: new Date().toISOString(),
    };

    setTareas((prev) => [nuevaTarea, ...prev]);
  };

  const updateTarea = (id, updates) => {
    setTareas(tareas.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  return {
    addTareaPorPedido,
    updateTarea,
  };
}


