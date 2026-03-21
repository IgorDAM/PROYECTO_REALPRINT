import { useData } from "../context/DataContext";

/**
 * Hook de dominio para usuarios y catalogos asociados de cliente.
 */
export function useUsuariosData() {
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

