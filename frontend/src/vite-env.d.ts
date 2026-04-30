/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_USE_LOCAL_AUTH?: string;
  readonly VITE_USE_PEDIDOS_SERVICE_CREATE?: string;
  readonly VITE_USE_PEDIDOS_SERVICE_UPDATE?: string;
  readonly VITE_USE_PEDIDOS_SERVICE_DELETE?: string;
  readonly VITE_USE_USUARIOS_SERVICE_CREATE?: string;
  readonly VITE_USE_USUARIOS_SERVICE_UPDATE?: string;
  readonly VITE_USE_USUARIOS_SERVICE_DELETE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

