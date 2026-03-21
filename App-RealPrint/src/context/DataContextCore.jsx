import { createContext, useContext } from "react";

/**
 * Nucleo del contexto de datos.
 * Se separa para desacoplar la definicion del contexto de la implementacion del provider.
 */
export const DataContext = createContext(null);

/**
 * Guard estricto de consumo del contexto.
 * Mantiene el error explicito cuando se usa fuera del provider.
 */
export function useDataContextStrict() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData debe usarse dentro de DataProvider");
  }
  return context;
}

