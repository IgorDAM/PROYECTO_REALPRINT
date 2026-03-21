# Informe de Refactorizacion Frontend (RealPrint)

Fecha de actualizacion: 2026-03-21
Estado: documento de trazabilidad tecnica de lo ya implementado en `App-RealPrint`.

## 1. Objetivo de la refactorizacion

Desacoplar `DataContext` monolitico en modulos por dominio para facilitar mantenimiento, preparar transicion a servicios/API y conservar compatibilidad con el contrato publico actual (`DataProvider` y `useData`).

Referencia principal: `App-RealPrint/SESSION_HANDOFF.md`.

## 2. Resumen ejecutivo de cambios realizados

- Se creo una capa de servicios HTTP y autenticacion para separar acceso a datos de la UI.
- Se introdujo configuracion por feature flags para activar/desactivar operaciones por dominio.
- Se extrajo estado persistido y wiring de dominios fuera de `DataContext`.
- Se mantuvo el contrato publico del contexto mediante `createDataValue`.
- Se migraron pantallas para consumir hooks de dominio (`usePedidosData`, `useInventarioData`, etc.) en lugar de acoplarse directamente al contexto completo.

## 3. Cambios tecnicos por capa

### 3.1 Capa de servicios

Archivos:
- `App-RealPrint/src/services/httpClient.js`
- `App-RealPrint/src/services/errors.js`
- `App-RealPrint/src/services/tokenStorage.js`
- `App-RealPrint/src/services/authService.js`
- `App-RealPrint/src/services/pedidosService.js`
- `App-RealPrint/src/services/inventarioService.js`
- `App-RealPrint/src/services/usuariosService.js`
- `App-RealPrint/src/services/index.js`

Cambios relevantes:
- Se normaliza manejo de errores de red/API en una capa comun.
- `authService` soporta estrategia local (`VITE_USE_LOCAL_AUTH`) y estrategia API.
- Se centraliza persistencia de sesion/token fuera de componentes.

### 3.2 Configuracion de migracion incremental

Archivo:
- `App-RealPrint/src/context/data/dataConfig.js`

Cambios relevantes:
- Lectura centralizada de flags por dominio (`pedidos`, `inventario`, `usuarios`).
- Permite habilitar operaciones create/update/delete por servicio sin cambiar UI.

### 3.3 Refactor del contexto de datos

Archivos:
- `App-RealPrint/src/context/DataContext.jsx`
- `App-RealPrint/src/context/DataContextCore.jsx`
- `App-RealPrint/src/context/DataProviderBridge.jsx`
- `App-RealPrint/src/context/data/useDataState.js`
- `App-RealPrint/src/context/data/useDataDomains.js`
- `App-RealPrint/src/context/data/createDataValue.js`
- `App-RealPrint/src/context/data/useLocalStorageState.js`

Cambios relevantes:
- `useDataState` concentra el estado persistido de productos, catalogos, pedidos, inventario, usuarios y tareas.
- `useDataDomains` encapsula el ensamblado de dominios (`pedidos`, `inventario`, `usuarios`, `tareas`, `catalogos`, `estadisticas`, `productos`).
- `createDataValue` mantiene estable la forma publica del contexto para no romper pantallas legacy.
- `DataContext.jsx` pasa a ser orquestador de estado + dominios, sin logica pesada embebida.

### 3.4 Dominios funcionales extraidos

Archivos:
- `App-RealPrint/src/context/data/pedidosDomain.js`
- `App-RealPrint/src/context/data/inventarioDomain.js`
- `App-RealPrint/src/context/data/usuariosDomain.js`
- `App-RealPrint/src/context/data/tareasDomain.js`
- `App-RealPrint/src/context/data/productosDomain.js`
- `App-RealPrint/src/context/data/catalogosDomain.js`
- `App-RealPrint/src/context/data/estadisticasDomain.js`

Cambios relevantes:
- Logica de negocio dividida por dominio.
- Wrappers safe con fallback local para operaciones criticas durante transicion.

### 3.5 Hooks de dominio para UI

Archivos:
- `App-RealPrint/src/hooks/usePedidosData.js`
- `App-RealPrint/src/hooks/useInventarioData.js`
- `App-RealPrint/src/hooks/useUsuariosData.js`
- `App-RealPrint/src/hooks/useProductosData.js`
- `App-RealPrint/src/hooks/useTareasData.js`
- `App-RealPrint/src/hooks/useApiStatus.js`

Cambios relevantes:
- Las paginas consumen interfaces acotadas por dominio.
- Se unifica manejo de estado async (`loading`/`error`) con `useApiStatus`.

## 4. Compatibilidad y no regresion

Compatibilidad preservada en:
- `DataProvider` (`App-RealPrint/src/context/DataContext.jsx`)
- `useData` (`App-RealPrint/src/context/DataContext.jsx`)
- claves del `value` de contexto (construidas en `createDataValue.js`)

Resultado esperado de esta estrategia:
- Reducir riesgo de regresion durante migraciones por micro-pasos.
- Permitir coexistencia temporal de flujo legacy y flujo por servicios.

## 5. Evidencia de migracion en pantallas

Rastreo de uso de hooks por dominio en `App-RealPrint/src/pages/**`:
- Admin: pedidos, inventario, usuarios, reportes y dashboard consumen hooks especificos.
- Cliente: dashboard, nuevo pedido, historial y edicion consumen `usePedidosData`.
- Operario: dashboard y tareas combinan `usePedidosData` y `useTareasData`.

## 6. Configuracion de entorno considerada

Variables identificadas en `App-RealPrint/SESSION_HANDOFF.md` y usadas por el codigo:
- `VITE_API_URL`
- `VITE_API_TIMEOUT`
- `VITE_USE_LOCAL_AUTH`
- `VITE_USE_PEDIDOS_SERVICE_CREATE|UPDATE|DELETE`
- `VITE_USE_INVENTARIO_SERVICE_CREATE|UPDATE|DELETE`
- `VITE_USE_USUARIOS_SERVICE_CREATE|UPDATE|DELETE`

## 7. Riesgos y deuda tecnica abierta

- Coexistencia temporal de contrato legacy y nueva capa de servicios (duplicidad controlada).
- Dependencia fuerte de `localStorage` en modo demo/local.
- Falta documentacion central de decisiones arquitectonicas (ADR) para siguientes iteraciones.
- El `README.md` de `App-RealPrint` aun conserva plantilla base de Vite y no refleja arquitectura actual.

## 8. Checklist para revisar esta refactorizacion

- Verificar que `DataProvider` y `useData` no hayan cambiado de contrato.
- Verificar que las operaciones safe mantengan fallback local cuando flags esten en `false`.
- Verificar rutas por rol en `App-RealPrint/src/App.jsx` y proteccion en `ProtectedRoute.jsx`.
- Verificar login local/API en `authService.js` segun `VITE_USE_LOCAL_AUTH`.
- Verificar que paginas usen hooks de dominio y no accedan a logica transversal innecesaria.

## 9. Proximo paso recomendado

- Completar documentacion de arquitectura y pruebas de regresion por dominio.
- Actualizar `App-RealPrint/README.md` con stack real, scripts y modelo de capas.
- Si se activa backend real por flags, registrar matriz de pruebas por operacion CRUD y rol.

