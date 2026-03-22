# Guia Funcional Completa del Frontend (RealPrint)

Fecha de actualizacion: 2026-03-21
Alcance: comportamiento observable en frontend React (`App-RealPrint`) segun codigo y configuracion actual.

## 1. Vision funcional

El frontend gestiona un flujo multirol para operativa de imprenta/rotulacion:
- autenticacion por roles,
- paneles de trabajo diferenciados,
- gestion de pedidos,
- inventario,
- usuarios,
- tareas de operario,
- reportes basicos.

## 2. Acceso y autenticacion

### 2.1 Pantalla de login

Ruta:
- `/login` (definida en `App-RealPrint/src/App.jsx`)

Mecanica:
- El login se canaliza por `AuthContext` + `authService`.
- Si `VITE_USE_LOCAL_AUTH` no es `false`, se usa autenticacion local con usuarios almacenados en `realprint_usuarios`.
- Si se desactiva modo local, el flujo intenta autenticacion por API (`/auth/login`).

Referencias:
- `App-RealPrint/src/context/AuthContext.jsx`
- `App-RealPrint/src/services/authService.js`

### 2.2 Sesion y persistencia

- Usuario actual persistido para rehidratacion al recargar.
- Token persistido y validacion de expiracion JWT cuando aplica.
- Logout limpia estado React y almacenamiento de sesion.

## 3. Autorizacion por rol y navegacion

### 3.1 Guard de rutas

`ProtectedRoute` aplica este flujo:
1. espera fin de hidratacion de sesion,
2. si no hay autenticacion -> redirige a `/login`,
3. si rol no permitido -> redirige al home del rol (`/${user.role}`).

Referencia:
- `App-RealPrint/src/components/layout/ProtectedRoute.jsx`

### 3.2 Layout y menu lateral

`DashboardLayout` usa `Sidebar` para menu segun rol.

Menus actuales (`Sidebar.jsx`):
- `admin`: dashboard, pedidos, historial, inventario, productos finales, usuarios, reportes.
- `cliente`: mis pedidos, nuevo pedido, historial.
- `operario`: panel, mis tareas, pedidos.

Referencia:
- `App-RealPrint/src/components/layout/Sidebar.jsx`

## 4. Mapa de rutas del frontend

Definidas en `App-RealPrint/src/App.jsx`.

### 4.1 Publicas

- `/login`
- `/` -> redirige a `/login`

### 4.2 Admin (`allowedRoles: ["admin"]`)

- `/admin` (dashboard)
- `/admin/pedidos`
- `/admin/historial`
- `/admin/inventario`
- `/admin/usuarios`
- `/admin/productos-finales`
- `/admin/reportes`
- `/admin/configuracion`

### 4.3 Cliente (`allowedRoles: ["cliente"]`)

- `/cliente` (dashboard)
- `/cliente/nuevo-pedido`
- `/cliente/editar-pedido/:id` (carga lazy)
- `/cliente/historial`
- `/cliente/configuracion`

### 4.4 Operario (`allowedRoles: ["operario"]`)

- `/operario` (dashboard)
- `/operario/tareas`
- `/operario/pedidos`
- `/operario/configuracion`

### 4.5 Fallback global

- `*` -> redirige a `/login`

## 5. Funcionalidad por rol

## 5.1 Administrador

Pantallas en `App-RealPrint/src/pages/admin/`.

Capacidades principales (segun rutas, hooks y menu):
- seguimiento de pedidos (`AdminPedidos`, `AdminHistorial`),
- control de inventario (`AdminInventario`),
- gestion de usuarios (`AdminUsuarios`),
- gestion de productos finales (`AdminProductosFinales`),
- vista de metricas/reportes (`AdminReportes`, `AdminDashboard`).

Hooks usados:
- `usePedidosData`
- `useInventarioData`
- `useUsuariosData`

## 5.2 Cliente

Pantallas en `App-RealPrint/src/pages/cliente/`.

Capacidades principales:
- crear pedidos (`ClienteNuevoPedido`),
- consultar estado/historial (`ClienteDashboard`, `ClienteHistorial`),
- editar pedido por id (`ClienteEditarPedido`) dentro del flujo permitido por negocio.

Hook principal:
- `usePedidosData`

## 5.3 Operario

Pantallas en `App-RealPrint/src/pages/operario/`.

Capacidades principales:
- ver panel operativo (`OperarioDashboard`),
- ver y actualizar tareas (`OperarioTareas`),
- consultar pedidos asociados (`OperarioPedidos`).

Hooks usados:
- `useTareasData`
- `usePedidosData`

## 6. Modelo de datos y estado en frontend

### 6.1 Estado global de datos

El `DataProvider` mantiene y persiste en `localStorage`:
- productos finales,
- catalogos de empresa,
- pedidos,
- inventario,
- usuarios,
- tareas.

Referencias:
- `App-RealPrint/src/context/DataContext.jsx`
- `App-RealPrint/src/context/data/useDataState.js`
- `App-RealPrint/src/context/data/initialData.js`

### 6.2 Operaciones de dominio

El frontend expone operaciones por dominio:
- pedidos: create/update/delete (incluyendo variantes safe),
- inventario: create/update/delete (incluyendo variantes safe),
- usuarios: create/update/delete (incluyendo variantes safe),
- tareas: update,
- catalogos: set/get por cliente,
- estadisticas: calculo agregado para panel/reportes.

Referencia:
- `App-RealPrint/src/context/data/useDataDomains.js`

### 6.3 Feature flags de migracion

`dataConfig` define que operaciones usan capa de servicios o fallback local:
- pedidos: `VITE_USE_PEDIDOS_SERVICE_*`
- inventario: `VITE_USE_INVENTARIO_SERVICE_*`
- usuarios: `VITE_USE_USUARIOS_SERVICE_*`

Referencia:
- `App-RealPrint/src/context/data/dataConfig.js`

## 7. Manejo de acciones async y errores de UI

`useApiStatus` ofrece patron comun para:
- `loading` durante llamada,
- captura de error legible,
- limpieza de error.

Referencia:
- `App-RealPrint/src/hooks/useApiStatus.js`

## 8. Credenciales demo (modo local)

Disponibles en datos iniciales y `authService`:
- admin / `admin123`
- cliente / `cliente123`
- operario_demo_serigrafia / `operario123`
- operario_demo_rotulacion / `operario123`

Referencias:
- `App-RealPrint/src/services/authService.js`
- `App-RealPrint/src/context/data/initialData.js`

## 9. Limites conocidos de esta guia

- Esta guia describe el frontend actual y su comportamiento esperado en modo local/hibrido.
- No sustituye pruebas E2E ni contrato formal backend-frontend.
- Si se modifican flags `.env`, el comportamiento CRUD puede variar sin cambios visuales en pantallas.

## 10. Checklist rapido para validar funcionamiento completo

- Login correcto por cada rol.
- Redireccion correcta al dashboard del rol.
- Acceso denegado a rutas de otros roles.
- CRUD basico en admin (pedidos/inventario/usuarios) segun configuracion activa.
- Creacion y seguimiento de pedidos desde cliente.
- Actualizacion de tareas desde operario.
- Persistencia tras recarga (sesion y datos locales).

