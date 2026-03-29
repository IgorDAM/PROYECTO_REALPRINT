type SetState<T> = (value: T | ((prev: T) => T)) => void;

interface CatalogoDomainConfig {
  catalogosEmpresa: Record<string, any>;
  setCatalogosEmpresa: SetState<Record<string, any>>;
}

interface CatalogoDomainOps {
  setCatalogoEmpresa: (empresaId: string | number, servicio: string, prendas: any[]) => void;
  getCatalogoEmpresa: (empresaId: string | number, servicio: string) => any[];
}

/**
 * Construye operaciones del dominio catalogos por empresa/servicio.
 */
export function createCatalogosDomain({ catalogosEmpresa, setCatalogosEmpresa }: CatalogoDomainConfig): CatalogoDomainOps {
  const setCatalogoEmpresa = (empresaId, servicio, prendas) => {
    setCatalogosEmpresa((prev) => ({
      ...prev,
      [empresaId]: {
        ...(prev[empresaId] || {}),
        [servicio]: prendas,
      },
    }));
  };

  const getCatalogoEmpresa = (empresaId, servicio) => {
    return (catalogosEmpresa[empresaId] && catalogosEmpresa[empresaId][servicio]) || [];
  };

  return {
    setCatalogoEmpresa,
    getCatalogoEmpresa,
  };
}


