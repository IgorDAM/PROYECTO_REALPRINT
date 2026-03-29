type AnyFn = (...args: any[]) => any;

/**
 * Contrato publico actual de DataContext.
 * Se mantiene estable para no romper pantallas durante la migracion incremental.
 */
export interface DataContextValue {
  productosFinales: any[];
  setProductosFinales: AnyFn;
  addProductoFinal: AnyFn;
  updateProductoFinal: AnyFn;
  deleteProductoFinal: AnyFn;
  pedidos: any[];
  inventario: any[];
  usuarios: any[];
  tareas: any[];
  catalogosEmpresa: Record<string, any>;
  setCatalogoEmpresa: AnyFn;
  getCatalogoEmpresa: AnyFn;
  addPedido: AnyFn;
  createPedidoSafe: AnyFn;
  updatePedido: AnyFn;
  updatePedidoSafe: AnyFn;
  deletePedido: AnyFn;
  deletePedidoSafe: AnyFn;
  updateInventario: AnyFn;
  updateInventarioSafe: AnyFn;
  addInventario: AnyFn;
  addInventarioSafe: AnyFn;
  deleteInventario: AnyFn;
  deleteInventarioSafe: AnyFn;
  addUsuario: AnyFn;
  addUsuarioSafe: AnyFn;
  updateUsuario: AnyFn;
  updateUsuarioSafe: AnyFn;
  deleteUsuario: AnyFn;
  deleteUsuarioSafe: AnyFn;
  updateTarea: AnyFn;
  getEstadisticas: AnyFn;
}

