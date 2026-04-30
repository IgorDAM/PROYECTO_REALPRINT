# SESSION HANDOFF - RealPrint Frontend Refactor

Fecha de corte: 2026-03-21

## Objetivo global
Refactor frontend incremental para desacoplar `DataContext` monolitico y preparar migracion a providers por dominio, manteniendo compatibilidad con `DataProvider`/`useData` y sin romper pantallas.

## Estado actual (hecho)

### 1) Capa servicios
- `src/services/httpClient.js`
- `src/services/errors.js`
- `src/services/tokenStorage.js`
- `src/services/authService.js`
- `src/services/pedidosService.js`
- `src/services/inventarioService.js`
- `src/services/usuariosService.js`
- `src/services/index.js` (barrel)

### 2) Migracion safe + flags por dominio
- Pedidos: create/update/delete safe con fallback local
- Inventario: create/update/delete safe con fallback local
- Usuarios: create/update/delete safe con fallback local
- Flags centralizados en `src/context/data/dataConfig.js`

### 3) UI y hooks
- Hook comun async: `src/hooks/useApiStatus.js`
- Hooks de dominio:
  - `src/hooks/usePedidosData.js`
  - `src/hooks/useInventarioData.js`
  - `src/hooks/useUsuariosData.js`
  - `src/hooks/useProductosData.js`
  - `src/hooks/useTareasData.js`
- Pantallas migradas para evitar `useData` directo en `src/pages/**`.

### 4) Context refactor por etapas
- Nucleo separado:
  - `src/context/DataContextCore.jsx`
  - `src/context/DataProviderBridge.jsx`
- Contrato de value separado:
  - `src/context/data/createDataValue.js`
- Dominios extraidos:
  - `src/context/data/pedidosDomain.js`
  - `src/context/data/inventarioDomain.js`
  - `src/context/data/usuariosDomain.js`
  - `src/context/data/tareasDomain.js`
  - `src/context/data/productosDomain.js`
  - `src/context/data/catalogosDomain.js`
  - `src/context/data/estadisticasDomain.js`
- Contratos de UI:
  - `src/context/data/uiContracts.js`
- Persistencia reutilizable:
  - `src/context/data/useLocalStorageState.js`
- Wiring de dominios separado:
  - `src/context/data/useDataDomains.js`

## Configuracion de entorno actual
Archivo: `.env`

- `VITE_API_URL=http://localhost:8080/api`
- `VITE_API_TIMEOUT=10000`
- `VITE_USE_LOCAL_AUTH=true`
- `VITE_USE_PEDIDOS_SERVICE_CREATE=false`
- `VITE_USE_PEDIDOS_SERVICE_UPDATE=false`
- `VITE_USE_PEDIDOS_SERVICE_DELETE=false`
- `VITE_USE_INVENTARIO_SERVICE_CREATE=false`
- `VITE_USE_INVENTARIO_SERVICE_UPDATE=false`
- `VITE_USE_INVENTARIO_SERVICE_DELETE=false`
- `VITE_USE_USUARIOS_SERVICE_CREATE=false`
- `VITE_USE_USUARIOS_SERVICE_UPDATE=false`
- `VITE_USE_USUARIOS_SERVICE_DELETE=false`

## Pendiente inmediato (siguiente micro-paso recomendado)
1. Extraer bloque de estado persistido a `src/context/data/useDataState.js`.
2. Hacer que `DataContext` use `useDataState` + `useDataDomains` + `createDataValue`.
3. Mantener contrato publico de `useData` intacto.

## Criterios de no regresion
- No cambiar nombres de claves del `value` de contexto.
- No cambiar firma de `DataProvider` ni `useData`.
- Mantener fallback local en wrappers safe.
- Build en verde tras cada micro-paso.

## Comandos minimos de verificacion
```powershell
Set-Location "D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\App-RealPrint"
npm run build
```

## Prompt listo para pegar en chat nuevo
```md
Continuamos este proyecto desde un chat anterior.

Contexto:
- Workspace: `D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT`
- App: `App-RealPrint`
- Objetivo: seguir refactor incremental de `DataContext` sin romper contrato publico.

Estado ya hecho:
- Servicios por dominio (auth/pedidos/inventario/usuarios).
- Wrappers safe + fallback y flags centralizados en `src/context/data/dataConfig.js`.
- Dominios extraidos en `src/context/data/*Domain.js`.
- `DataContextCore`, `DataProviderBridge`, `createDataValue`, `useLocalStorageState`, `useDataDomains`.
- Paginas migradas a hooks de dominio (`src/hooks/use*Data.js`) y `useApiStatus` en flujos async.

Siguiente paso concreto:
1) Crear `src/context/data/useDataState.js` para centralizar estados persistidos.
2) Refactorizar `src/context/DataContext.jsx` para usar `useDataState` + `useDataDomains` + `createDataValue`.
3) Mantener `DataProvider` y `useData` sin cambios de contrato.
4) Validar con build.

Restricciones:
- No rehacer lo ya hecho.
- Cambios minimos por micro-paso.
- Mantener compatibilidad de imports y rutas actuales.
```

