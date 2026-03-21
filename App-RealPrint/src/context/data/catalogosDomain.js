/**
 * Construye operaciones del dominio catalogos por empresa/servicio.
 */
export function createCatalogosDomain({ catalogosEmpresa, setCatalogosEmpresa }) {
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

