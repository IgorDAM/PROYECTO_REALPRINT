type Entity = Record<string, any>;
type SetState<T> = (value: T | ((prev: T) => T)) => void;
type Direction = "consume" | "restore";

interface PedidosDomainConfig {
  pedidos: Entity[];
  setPedidos: SetState<Entity[]>;
  tareas: Entity[];
  setTareas: SetState<Entity[]>;
  // Nombre legacy por compatibilidad del contrato actual del DataContext.
  productosFinales: Entity[];
  inventario: Entity[];
  updateInventario: (id: number | string, updates: Record<string, any>) => void;
  addTareaPorPedido: (tarea: Entity) => void;
  pedidosService: Record<string, any>;
  useCreateService: boolean;
  useUpdateService: boolean;
  useDeleteService: boolean;
}

interface PedidosDomainOps {
  addPedido: (pedido: Entity) => Entity | Entity[];
  createPedidoSafe: (pedido: Entity) => Promise<Entity | Entity[]>;
  updatePedido: (id: number | string, updates: Record<string, any>) => void;
  updatePedidoSafe: (id: number | string, updates: Record<string, any>) => Promise<void>;
  deletePedido: (id: number | string) => void;
  deletePedidoSafe: (id: number | string) => Promise<void>;
}

/**
 * Construye operaciones del dominio pedidos con sus dependencias externas.
 * Permite ir separando DataContext sin romper contrato publico.
 */
export function createPedidosDomain({
  pedidos,
  setPedidos,
  setTareas,
  productosFinales,
  inventario,
  updateInventario,
  addTareaPorPedido,
  pedidosService,
  useCreateService,
  useUpdateService,
  useDeleteService,
}: PedidosDomainConfig): PedidosDomainOps {
  const getCantidadMovimiento = (pedido: Entity): number => {
    if (typeof pedido?.cantidadUnidades === "number") return pedido.cantidadUnidades;
    if (typeof pedido?.cantidad === "number") return pedido.cantidad;
    if (typeof pedido?.unidadesPorCaja === "number") return pedido.unidadesPorCaja;
    return 1;
  };

  const applyInventarioMovement = (pedido: Entity, direction: Direction): void => {
    // `productoFinalId` se conserva como clave legacy en pedidos persistidos.
    const prendaCatalogo = productosFinales.find((pf) => pf.id == pedido?.productoFinalId);
    if (!prendaCatalogo) return;

    const cantidad = getCantidadMovimiento(pedido);
    const materialMovements = Array.isArray(prendaCatalogo.materiales)
      ? prendaCatalogo.materiales
          .filter((m) => m && m.id !== undefined)
          .map((m) => ({ id: m.id, cantidad: Number(m.cantidad) || 1 }))
      : Array.isArray(prendaCatalogo.productosInventario)
        ? prendaCatalogo.productosInventario.map((id) => ({ id, cantidad: 1 }))
        : [];

    if (!materialMovements.length) return;

    materialMovements.forEach(({ id, cantidad: materialQty }) => {
      const prod = inventario.find((item) => item.id == id);
      if (!prod) return;

      const movementQty = cantidad * materialQty;

      if (direction === "consume") {
        updateInventario(id, {
          stock: Math.max(0, prod.stock - movementQty),
          usados: (prod.usados || 0) + movementQty,
        });
        return;
      }

      if (direction === "restore") {
        updateInventario(id, {
          stock: prod.stock + movementQty,
          usados: Math.max(0, (prod.usados || 0) - movementQty),
        });
      }
    });
  };

  const applyInventoryForEstadoTransition = (currentPedido: Entity, updates: Record<string, any>): void => {
    if (!currentPedido || !Object.prototype.hasOwnProperty.call(updates, "estado")) return;

    const nextEstado = updates.estado;
    if (nextEstado === currentPedido.estado) return;

    if (currentPedido.estado !== "en_proceso" && nextEstado === "en_proceso") {
      applyInventarioMovement(currentPedido, "consume");
      return;
    }

    if (currentPedido.estado === "en_proceso" && nextEstado === "pendiente") {
      applyInventarioMovement(currentPedido, "restore");
    }
  };

  const addPedido = (pedido) => {
    // `productoFinalId` se conserva por compatibilidad con pedidos previos.
    const prendaCatalogo = productosFinales.find((pf) => pf.id == pedido.productoFinalId);

    const cantidad = Number(pedido?.cantidad) || 1;
    const unidadesPorCaja = Number(pedido?.tamanoCaja || prendaCatalogo?.tamanoCaja || 50) || 50;

    const newPedido = {
      ...pedido,
      id: Date.now().toString(),
      fecha: new Date().toISOString().split("T")[0],
      estado: "pendiente",
      // Si el producto va en caja, mantener metadata de cajas en un único pedido.
      boxTotal: prendaCatalogo?.enCaja ? (Number(pedido?.boxTotal) || cantidad) : 1,
      cajasCompletadas: Number(pedido?.cajasCompletadas) || 0,
      tamanoCaja: prendaCatalogo?.enCaja ? unidadesPorCaja : pedido?.tamanoCaja,
    };

    setPedidos((prev) => [newPedido, ...prev]);
    addTareaPorPedido(newPedido);
    return newPedido;
  };

  const createPedidoSafe = async (pedido) => {
    if (!useCreateService) {
      return addPedido(pedido);
    }

    try {
      // ✅ TRANSFORMAR fileUrls → fileUrlsJson para compatibilidad backend
      const pedidoPayload = {
        ...pedido,
        fileUrlsJson: Array.isArray(pedido.fileUrls) && pedido.fileUrls.length > 0
          ? JSON.stringify(pedido.fileUrls)
          : undefined,
      };
      // Remover fileUrls para evitar conflictos (backend no espera este campo)
      delete pedidoPayload.fileUrls;

      return await pedidosService.create(pedidoPayload);
    } catch {
      return addPedido(pedido);
    }
  };

  const updatePedido = (id, updates) => {
    const currentPedido = pedidos.find((p) => p.id === id);
    applyInventoryForEstadoTransition(currentPedido, updates);
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const updatePedidoSafe = async (id, updates) => {
    if (!useUpdateService) {
      updatePedido(id, updates);
      return;
    }

    try {
      await pedidosService.update(id, updates);
      updatePedido(id, updates);
    } catch {
      updatePedido(id, updates);
    }
  };

  const deletePedido = (id) => {
    setPedidos((prev) => prev.filter((p) => p.id !== id));
    setTareas((prev) => prev.filter((t) => t.pedidoId !== id));
  };

  const deletePedidoSafe = async (id) => {
    if (!useDeleteService) {
      deletePedido(id);
      return;
    }

    try {
      await pedidosService.remove(id);
      deletePedido(id);
    } catch {
      deletePedido(id);
    }
  };

  return {
    addPedido,
    createPedidoSafe,
    updatePedido,
    updatePedidoSafe,
    deletePedido,
    deletePedidoSafe,
  };
}
