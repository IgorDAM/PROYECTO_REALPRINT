import { useData } from "../context/DataContext";
import type { DataContextValue } from "../context/data/dataContext.types";

type PedidosData = Pick<
  DataContextValue,
  | "pedidos"
  | "addPedido"
  | "createPedidoSafe"
  | "updatePedido"
  | "updatePedidoSafe"
  | "deletePedido"
  | "deletePedidoSafe"
  | "getEstadisticas"
>;

/**
 * Hook de dominio para pedidos.
 * Reduce acoplamiento de las pantallas al contexto global.
 */
export function usePedidosData(): PedidosData {
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


