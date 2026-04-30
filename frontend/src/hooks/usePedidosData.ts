import { useData } from "../context/DataContext";
import type { DataContextValue } from "../context/data/dataContext.types";

type PedidosData = Pick<
  DataContextValue,
  | "pedidos"
  | "createPedidoSafe"
  | "updatePedidoSafe"
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
    createPedidoSafe,
    updatePedidoSafe,
    deletePedidoSafe,
    getEstadisticas,
  } = useData();

  return {
    pedidos,
    createPedidoSafe,
    updatePedidoSafe,
    deletePedidoSafe,
    getEstadisticas,
  };
}


