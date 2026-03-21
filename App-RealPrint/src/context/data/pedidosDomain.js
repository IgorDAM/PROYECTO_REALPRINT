/**
 * Construye operaciones del dominio pedidos con sus dependencias externas.
 * Permite ir separando DataContext sin romper contrato publico.
 */
export function createPedidosDomain({
  pedidos,
  setPedidos,
  tareas,
  setTareas,
  productosFinales,
  inventario,
  updateInventario,
  addTareaPorPedido,
  pedidosService,
  useCreateService,
  useUpdateService,
  useDeleteService,
}) {
  const getCantidadMovimiento = (pedido) => {
    if (typeof pedido?.cantidadUnidades === "number") return pedido.cantidadUnidades;
    if (typeof pedido?.cantidad === "number") return pedido.cantidad;
    if (typeof pedido?.unidadesPorCaja === "number") return pedido.unidadesPorCaja;
    return 1;
  };

  const applyInventarioMovement = (pedido, direction) => {
    const productoFinal = productosFinales.find((pf) => pf.id == pedido?.productoFinalId);
    if (!productoFinal?.productosInventario) return;

    const cantidad = getCantidadMovimiento(pedido);

    productoFinal.productosInventario.forEach((id) => {
      const prod = inventario.find((item) => item.id == id);
      if (!prod) return;

      if (direction === "consume") {
        updateInventario(id, {
          stock: Math.max(0, prod.stock - cantidad),
          usados: (prod.usados || 0) + cantidad,
        });
        return;
      }

      if (direction === "restore") {
        updateInventario(id, {
          stock: prod.stock + cantidad,
          usados: Math.max(0, (prod.usados || 0) - cantidad),
        });
      }
    });
  };

  const applyInventoryForEstadoTransition = (currentPedido, updates) => {
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
    const productoFinal = productosFinales.find((pf) => pf.id == pedido.productoFinalId);

    if (productoFinal && productoFinal.enCaja && pedido.cantidad > 1) {
      const pedidosPorCaja = [];
      for (let i = 0; i < pedido.cantidad; i++) {
        const boxId = `${Date.now()}_${i}`;
        const pedidoCaja = {
          ...pedido,
          id: boxId,
          fecha: new Date().toISOString().split("T")[0],
          estado: "pendiente",
          boxIndex: i + 1,
          boxTotal: pedido.cantidad,
        };

        pedidosPorCaja.push(pedidoCaja);
        addTareaPorPedido(pedidoCaja);
      }

      setPedidos([...pedidosPorCaja, ...pedidos]);
      return pedidosPorCaja;
    }

    const newPedido = {
      ...pedido,
      id: Date.now().toString(),
      fecha: new Date().toISOString().split("T")[0],
      estado: "pendiente",
    };

    setPedidos([newPedido, ...pedidos]);
    addTareaPorPedido(newPedido);
    return newPedido;
  };

  const createPedidoSafe = async (pedido) => {
    if (!useCreateService) {
      return addPedido(pedido);
    }

    try {
      return await pedidosService.create(pedido);
    } catch {
      return addPedido(pedido);
    }
  };

  const updatePedido = (id, updates) => {
    const currentPedido = pedidos.find((p) => p.id === id);
    applyInventoryForEstadoTransition(currentPedido, updates);
    setPedidos(pedidos.map((p) => (p.id === id ? { ...p, ...updates } : p)));
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
    setPedidos(pedidos.filter((p) => p.id !== id));
    setTareas(tareas.filter((t) => t.pedidoId !== id));
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

