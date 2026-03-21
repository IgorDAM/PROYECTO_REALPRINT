/**
 * Contexto global de datos (estado legacy temporal).
 *
 * Estado actual:
 * - concentra catalogos, inventario, pedidos, usuarios y tareas,
 * - persiste en localStorage,
 * - actua como backend simulado mientras migramos a src/services.
 *
 * Nota de arquitectura:
 * Este archivo se ira adelgazando por dominios (auth, pedidos, inventario, etc.)
 * para mover logica a servicios y dejar el contexto como orquestador de UI.
 */
import {
  INITIAL_PRODUCTOS_FINALES,
  INITIAL_CATALOGOS_EMPRESA,
  INITIAL_PEDIDOS,
  INITIAL_INVENTARIO,
  INITIAL_USUARIOS,
  INITIAL_TAREAS,
} from "./data/initialData.js";
import { DataContext, useDataContextStrict } from "./DataContextCore";
import { inventarioService, pedidosService, usuariosService } from "../services";
import { createDataValue } from "./data/createDataValue.js";
import { dataConfig } from "./data/dataConfig.js";
import { ESTADOS_PEDIDO, SERVICIOS } from "./data/uiContracts.js";
import { useDataDomains } from "./data/useDataDomains.js";
import { useDataState } from "./data/useDataState.js";
import { DataProviderBridge } from "./DataProviderBridge";

// Reexport temporal para mantener compatibilidad mientras migramos imports de paginas.
export { ESTADOS_PEDIDO, SERVICIOS };

export function DataProvider({ children }) {
  const {
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
  } = useDataState({
    initialProductosFinales: INITIAL_PRODUCTOS_FINALES,
    initialCatalogosEmpresa: INITIAL_CATALOGOS_EMPRESA,
    initialPedidos: INITIAL_PEDIDOS,
    initialInventario: INITIAL_INVENTARIO,
    initialUsuarios: INITIAL_USUARIOS,
    initialTareas: INITIAL_TAREAS,
  });

  const {
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
  } = useDataDomains({
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
  });

  // Contrato publico del contexto consumido por las pantallas actuales.
  const value = createDataValue({
    productosFinales,
    setProductosFinales,
    addProductoFinal,
    updateProductoFinal,
    deleteProductoFinal,
    pedidos,
    inventario,
    usuarios,
    tareas,
    catalogosEmpresa,
    setCatalogoEmpresa,
    getCatalogoEmpresa,
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
  });

  return (
    <DataProviderBridge Context={DataContext} value={value}>
      {children}
    </DataProviderBridge>
  );
}

/**
 * Hook de consumo seguro de DataContext.
 * Centraliza el mensaje de error si se usa fuera del provider.
 */
export function useData() {
  return useDataContextStrict();
}

