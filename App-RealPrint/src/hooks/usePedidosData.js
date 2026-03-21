import { useData } from "../context/DataContext";

/**
 * Hook de dominio para pedidos.
 * Reduce acoplamiento de las pantallas al contexto global.
 */
export function usePedidosData() {
  const {
    pedidos,
    addPedido,
    createPedidoSafe,
    updatePedido,
    updatePedidoSafe,
    deletePedido,
    deletePedidoSafe,
    getEstadisticas,
  } = useData();

  return {
    pedidos,
    addPedido,
    createPedidoSafe,
    updatePedido,
    updatePedidoSafe,
    deletePedido,
    deletePedidoSafe,
    getEstadisticas,
  };
}

