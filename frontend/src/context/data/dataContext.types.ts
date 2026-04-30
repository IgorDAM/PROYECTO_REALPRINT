type AnyFn = (...args: any[]) => any;

/**
 * Contrato publico actual de DataContext.
 * Se mantiene estable para no romper pantallas durante la migracion incremental.
 */
export interface DataContextValue {
  // Claves legacy de catálogo: se mantienen para no romper localStorage ni pedidos históricos.
  productosFinales: any[];
  pedidos: any[];
  usuarios: any[];
  setCatalogoEmpresa: AnyFn;
  getCatalogoEmpresa: AnyFn;
  createPedidoSafe: AnyFn;
  updatePedidoSafe: AnyFn;
  deletePedidoSafe: AnyFn;
  addUsuarioSafe: AnyFn;
  updateUsuarioSafe: AnyFn;
  deleteUsuarioSafe: AnyFn;
  getEstadisticas: AnyFn;
}

