import { useData } from "../context/DataContext";
import type { DataContextValue } from "../context/data/dataContext.types";

type UsuariosData = Pick<
  DataContextValue,
  | "usuarios"
  | "addUsuario"
  | "addUsuarioSafe"
  | "updateUsuario"
  | "updateUsuarioSafe"
  | "deleteUsuario"
  | "deleteUsuarioSafe"
  | "catalogosEmpresa"
  | "setCatalogoEmpresa"
  | "getCatalogoEmpresa"
>;

/**
 * Hook de dominio para usuarios y catalogos asociados de cliente.
 */
export function useUsuariosData(): UsuariosData {
  const {
    usuarios,
    addUsuario,
    addUsuarioSafe,
    updateUsuario,
    updateUsuarioSafe,
    deleteUsuario,
    deleteUsuarioSafe,
    catalogosEmpresa,
    setCatalogoEmpresa,
    getCatalogoEmpresa,
  } = useData();

  return {
    usuarios,
    addUsuario,
    addUsuarioSafe,
    updateUsuario,
    updateUsuarioSafe,
    deleteUsuario,
    deleteUsuarioSafe,
    catalogosEmpresa,
    setCatalogoEmpresa,
    getCatalogoEmpresa,
  };
}


