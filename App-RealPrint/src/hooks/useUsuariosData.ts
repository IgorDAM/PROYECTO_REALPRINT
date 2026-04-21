import { useData } from "../context/DataContext";
import type { DataContextValue } from "../context/data/dataContext.types";

type UsuariosData = Pick<
  DataContextValue,
  | "usuarios"
  | "addUsuarioSafe"
  | "updateUsuarioSafe"
  | "deleteUsuarioSafe"
  | "setCatalogoEmpresa"
  | "getCatalogoEmpresa"
>;

/**
 * Hook de dominio para usuarios y catalogos asociados de cliente.
 */
export function useUsuariosData(): UsuariosData {
  const {
    usuarios,
    addUsuarioSafe,
    updateUsuarioSafe,
    deleteUsuarioSafe,
    setCatalogoEmpresa,
    getCatalogoEmpresa,
  } = useData();

  return {
    usuarios,
    addUsuarioSafe,
    updateUsuarioSafe,
    deleteUsuarioSafe,
    setCatalogoEmpresa,
    getCatalogoEmpresa,
  };
}


