/**
 * Configuracion de feature flags para migracion incremental por dominios.
 * Centraliza lectura de variables de entorno para evitar duplicacion.
 */
export const dataConfig = {
  pedidos: {
    useCreateService: import.meta.env.VITE_USE_PEDIDOS_SERVICE_CREATE === "true",
    useUpdateService: import.meta.env.VITE_USE_PEDIDOS_SERVICE_UPDATE === "true",
    useDeleteService: import.meta.env.VITE_USE_PEDIDOS_SERVICE_DELETE === "true",
  },
  inventario: {
    useCreateService: import.meta.env.VITE_USE_INVENTARIO_SERVICE_CREATE === "true",
    useUpdateService: import.meta.env.VITE_USE_INVENTARIO_SERVICE_UPDATE === "true",
    useDeleteService: import.meta.env.VITE_USE_INVENTARIO_SERVICE_DELETE === "true",
  },
  usuarios: {
    useCreateService: import.meta.env.VITE_USE_USUARIOS_SERVICE_CREATE === "true",
    useUpdateService: import.meta.env.VITE_USE_USUARIOS_SERVICE_UPDATE === "true",
    useDeleteService: import.meta.env.VITE_USE_USUARIOS_SERVICE_DELETE === "true",
  },
};

