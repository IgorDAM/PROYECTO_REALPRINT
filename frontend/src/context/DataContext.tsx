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
  type ReactNode,
} from "react";
import type { DataContextValue } from "./data/dataContext.types";
import {
  INITIAL_PRODUCTOS_FINALES,
  INITIAL_CATALOGOS_EMPRESA,
  INITIAL_PEDIDOS,
  INITIAL_INVENTARIO,
  INITIAL_USUARIOS,
  INITIAL_TAREAS,
} from "./data/initialData";
import { DataContext, useDataContextStrict } from "./DataContextCore";
import { pedidosService, usuariosService } from "../services";
import { createDataValue } from "./data/createDataValue";
import { dataConfig } from "./data/dataConfig";
import { ESTADOS_PEDIDO, SERVICIOS } from "./data/uiContracts";
import { useDataDomains } from "./data/useDataDomains";
import { useDataState } from "./data/useDataState";
import { DataProviderBridge } from "./DataProviderBridge";

// Reexport temporal para mantener compatibilidad mientras migramos imports de paginas.
export { ESTADOS_PEDIDO, SERVICIOS };

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
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
    createPedidoSafe,
    updatePedidoSafe,
    deletePedidoSafe,
    addUsuarioSafe,
    updateUsuarioSafe,
    deleteUsuarioSafe,
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
    pedidosService,
    usuariosService,
    dataConfig,
  });

  // Contrato publico del contexto consumido por las pantallas actuales.
  const value: DataContextValue = createDataValue({
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


