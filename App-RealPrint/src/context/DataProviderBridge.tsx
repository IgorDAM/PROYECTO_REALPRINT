import type { Context, ReactNode } from "react";

/**
 * Puente temporal para inyectar el value del dominio de datos en un Context.Provider.
 * Facilita evolucionar de DataContext monolitico a providers por dominio.
 */
interface DataProviderBridgeProps<T> {
  Context: Context<T>;
  value: T;
  children: ReactNode;
}

export function DataProviderBridge<T>({ Context, value, children }: DataProviderBridgeProps<T>) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}


