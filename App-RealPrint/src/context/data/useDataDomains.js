import { createCatalogosDomain } from "./catalogosDomain";
import { createEstadisticasDomain } from "./estadisticasDomain";
import { createInventarioDomain } from "./inventarioDomain";
import { createPedidosDomain } from "./pedidosDomain";
import { createProductosDomain } from "./productosDomain";
import { createTareasDomain } from "./tareasDomain";
import { createUsuariosDomain } from "./usuariosDomain";

/**
 * Ensambla todos los dominios de datos para el DataProvider actual.
 *
 * Nota:
 * - no altera el contrato publico, solo encapsula el wiring interno
 * - facilita evolucionar a providers por dominio en pasos pequenos
 */
export function useDataDomains({
  productosFinales,
  setProductosFinales,
  catalogosEmpresa,
  setCatalogosEmpresa,
  pedidos,
  setPedidos,
  inventario,
  setInventario,
  usuarios,
  setUsuarios,
  tareas,
  setTareas,
  inventarioService,
  pedidosService,
  usuariosService,
  dataConfig,
}) {
  const { setCatalogoEmpresa, getCatalogoEmpresa } = createCatalogosDomain({
    catalogosEmpresa,
    setCatalogosEmpresa,
  });

  const { addProductoFinal, updateProductoFinal, deleteProductoFinal } = createProductosDomain({
    productosFinales,
    setProductosFinales,
  });

  const { addTareaPorPedido, updateTarea } = createTareasDomain({
    tareas,
    setTareas,
    usuarios,
  });

  const {
    updateInventario,
    updateInventarioSafe,
    addInventario,
    addInventarioSafe,
    deleteInventario,
    deleteInventarioSafe,
  } = createInventarioDomain({
    inventario,
    setInventario,
    inventarioService,
    useCreateService: dataConfig.inventario.useCreateService,
    useUpdateService: dataConfig.inventario.useUpdateService,
    useDeleteService: dataConfig.inventario.useDeleteService,
  });

  const {
    addPedido,
    createPedidoSafe,
    updatePedido,
    updatePedidoSafe,
    deletePedido,
    deletePedidoSafe,
  } = createPedidosDomain({
    pedidos,
    setPedidos,
    tareas,
    setTareas,
    productosFinales,
    inventario,
    updateInventario,
    addTareaPorPedido,
    pedidosService,
    useCreateService: dataConfig.pedidos.useCreateService,
    useUpdateService: dataConfig.pedidos.useUpdateService,
    useDeleteService: dataConfig.pedidos.useDeleteService,
  });

  const {
    addUsuario,
    addUsuarioSafe,
    updateUsuario,
    updateUsuarioSafe,
    deleteUsuario,
    deleteUsuarioSafe,
  } = createUsuariosDomain({
    usuarios,
    setUsuarios,
    usuariosService,
    useCreateService: dataConfig.usuarios.useCreateService,
    useUpdateService: dataConfig.usuarios.useUpdateService,
    useDeleteService: dataConfig.usuarios.useDeleteService,
  });

  const { getEstadisticas } = createEstadisticasDomain({
    pedidos,
    inventario,
    usuarios,
  });

  return {
    setCatalogoEmpresa,
    getCatalogoEmpresa,
    addProductoFinal,
    updateProductoFinal,
    deleteProductoFinal,
    addPedido,
    createPedidoSafe,
    updatePedido,
    updatePedidoSafe,
    deletePedido,
    deletePedidoSafe,
    updateInventario,
    updateInventarioSafe,
    addInventario,
    addInventarioSafe,
    deleteInventario,
    deleteInventarioSafe,
    addUsuario,
    addUsuarioSafe,
    updateUsuario,
    updateUsuarioSafe,
    deleteUsuario,
    deleteUsuarioSafe,
    updateTarea,
    getEstadisticas,
  };
}

