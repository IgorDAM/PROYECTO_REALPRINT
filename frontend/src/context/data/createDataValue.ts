/**
 * Construye el contrato publico de DataContext.
 * Centraliza la forma del value para facilitar la transicion a providers por dominio.
 */
import type { DataContextValue } from "./dataContext.types";

export function createDataValue({
  productosFinales,
  pedidos,
  usuarios,
  setCatalogoEmpresa,
  getCatalogoEmpresa,
  createPedidoSafe,
  updatePedidoSafe,
  deletePedidoSafe,
  addUsuarioSafe,
  updateUsuarioSafe,
  deleteUsuarioSafe,
  getEstadisticas,
}: DataContextValue): DataContextValue {
  return {
    productosFinales,
    pedidos,
    usuarios,
    setCatalogoEmpresa,
    getCatalogoEmpresa,
    createPedidoSafe,
    updatePedidoSafe,
    deletePedidoSafe,
    addUsuarioSafe,
    updateUsuarioSafe,
    deleteUsuarioSafe,
    getEstadisticas,
  };
}


