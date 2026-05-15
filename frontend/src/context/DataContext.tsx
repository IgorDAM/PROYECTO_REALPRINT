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
import { pedidosService, usuariosService, authService } from "../services";
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

  // Fetch pedidos from backend when component mounts
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const user = authService.getCurrentUser() as any;
        if (!user) return;

        let fetchedPedidos;
        if (user.role === "admin") {
          // Admin can fetch all pedidos
          fetchedPedidos = await pedidosService.list();
        } else if (user.role === "cliente") {
          // Cliente fetches only their own pedidos
          fetchedPedidos = await pedidosService.listMisPedidos();
        }

        if (fetchedPedidos && fetchedPedidos.length > 0) {
          setPedidos(fetchedPedidos);
        }
      } catch (error) {
        console.error("Error fetching pedidos:", error);
        // Keep using localStorage data on error
      }
    };

    fetchPedidos();
  }, [setPedidos]);

  // Fetch usuarios from backend when component mounts (admin only)
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const user = authService.getCurrentUser() as any;
        if (!user) return;

        // Only admin can fetch all usuarios
        if (user.role === "admin") {
          const fetchedUsuarios = await usuariosService.list();
          if (fetchedUsuarios && fetchedUsuarios.length > 0) {
            setUsuarios(fetchedUsuarios);
          }
        }
      } catch (error) {
        console.error("Error fetching usuarios:", error);
        // Keep using localStorage data on error
      }
    };

    fetchUsuarios();
  }, [setUsuarios]);

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


