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
  useEffect,
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
import { useAuth } from "./AuthContext";
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
  // En producción: inicializar vacío y cargar solo desde backend
  // En desarrollo: usar datos mock como fallback
  const isDevelopment = import.meta.env.DEV;

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
    initialProductosFinales: isDevelopment ? INITIAL_PRODUCTOS_FINALES : [],
    initialCatalogosEmpresa: isDevelopment ? INITIAL_CATALOGOS_EMPRESA : [],
    initialPedidos: isDevelopment ? INITIAL_PEDIDOS : [],
    initialInventario: isDevelopment ? INITIAL_INVENTARIO : [],
    initialUsuarios: isDevelopment ? INITIAL_USUARIOS : [],
    initialTareas: isDevelopment ? INITIAL_TAREAS : [],
  });

  // Con backend real (produccion o VITE_USE_LOCAL_AUTH=false) el servidor es la fuente de verdad.
  // En desarrollo con login local se conserva el comportamiento antiguo (datos mock/localStorage).
  const { user } = useAuth();
  const usesRemoteData = !import.meta.env.DEV || import.meta.env.VITE_USE_LOCAL_AUTH === "false";
  const userRole = user?.role;
  const userId = user?.id;

  // Carga pedidos (y usuarios si es admin) cada vez que cambia la sesion, no solo al montar.
  // Sin sesion y con backend real se vacian: asi no quedan datos de un usuario anterior.
  useEffect(() => {
    if (!userRole) {
      if (usesRemoteData) {
        setPedidos([]);
        setUsuarios([]);
      }
      return;
    }

    let cancelled = false;

    // El backend devuelve a veces { content: [...] } (Page) y a veces un array.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apply = (response: unknown, setter: (value: any[]) => void) => {
      const list = (response as { content?: unknown } | null)?.content ?? response;
      if (!Array.isArray(list)) return;
      // Con backend real una lista vacia es un resultado valido y debe reemplazar la cache.
      if (usesRemoteData || list.length > 0) setter(list);
    };

    const loadPedidos = async () => {
      try {
        const response =
          userRole === "admin"
            ? await pedidosService.list()
            : userRole === "cliente"
              ? await pedidosService.listMisPedidos()
              : null;
        if (!cancelled && response) apply(response, setPedidos);
      } catch (error) {
        console.error("Error fetching pedidos:", error);
        // Se mantienen los datos locales si falla la peticion.
      }
    };

    const loadUsuarios = async () => {
      if (userRole !== "admin") return;
      try {
        const response = await usuariosService.list();
        if (!cancelled) apply(response, setUsuarios);
      } catch (error) {
        console.error("Error fetching usuarios:", error);
      }
    };

    void loadPedidos();
    void loadUsuarios();

    return () => {
      cancelled = true;
    };
  }, [userId, userRole, usesRemoteData, setPedidos, setUsuarios]);

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


