/**
 * Puente temporal para inyectar el value del dominio de datos en un Context.Provider.
 * Facilita evolucionar de DataContext monolitico a providers por dominio.
 */
export function DataProviderBridge({ Context, value, children }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

