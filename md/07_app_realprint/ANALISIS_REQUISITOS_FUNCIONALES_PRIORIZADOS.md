# Analisis de Requisitos Funcionales Priorizados - RealPrint

**Fecha:** 2026-03-29  
**Version:** 1.0 (borrador funcional para validacion)  
**Stack objetivo:** Spring Boot + Hibernate (JPA) + MySQL  
**Nota de migracion:** `localStorage` se considera mecanismo temporal de pruebas y no forma parte de los requisitos funcionales finales de negocio.

---

## 1) Objetivo

Definir los requisitos funcionales de la app en:

1. Orden correlativo desde el inicio del flujo (login).
2. Orden de mayor a menor importancia para salida a produccion.

---

## 2) Criterio de priorizacion

Se usa una priorizacion practica combinada:

- **Critica:** sin este requisito el sistema no puede operar de forma segura o util.
- **Alta:** imprescindible para el negocio diario, pero depende de lo critico ya activo.
- **Media:** aporta valor operativo importante, no bloquea la salida minima.
- **Baja:** mejora de soporte, analitica o conveniencia.

En caso de empate, se prioriza:
1. Seguridad y control de acceso.
2. Continuidad operativa (pedidos/inventario).
3. Trazabilidad y administracion.
4. Analitica y mejoras.

---

## 3) Actores funcionales

- **Admin**: gestiona usuarios, inventario, productos finales, pedidos, reportes.
- **Cliente**: crea pedidos y consulta su seguimiento/historial.
- **Operario**: consulta y actualiza tareas/pedidos asignados.

---

## 4) Catalogo de requisitos funcionales (de mayor a menor importancia)

## Bloque A - Acceso, seguridad y sesion (Critica)

| ID | Prioridad | Requisito funcional |
|---|---|---|
| RF-001 | Critica | El sistema debe permitir **login** por credenciales (usuario/email + password) mediante `POST /api/auth/login`. |
| RF-002 | Critica | El sistema debe emitir y validar sesion autenticada (JWT o equivalente) para cada usuario valido. |
| RF-003 | Critica | El sistema debe bloquear el acceso a rutas privadas si no existe sesion valida y redirigir a login. |
| RF-004 | Critica | El sistema debe aplicar autorizacion por rol (`ADMIN`, `CLIENTE`, `OPERARIO`) en backend y frontend. |
| RF-005 | Critica | El sistema debe exponer `GET /api/auth/me` para rehidratacion de sesion y perfil activo. |
| RF-006 | Critica | El sistema debe permitir logout invalidando sesion activa en cliente y backend segun politica. |

## Bloque B - Base operativa de administracion (Alta)

| ID | Prioridad | Requisito funcional |
|---|---|---|
| RF-007 | Alta | El sistema debe permitir al Admin listar, crear, editar y desactivar usuarios (`/api/usuarios`). |
| RF-008 | Alta | El sistema debe impedir usuarios duplicados por `username` y `email`. |
| RF-009 | Alta | El sistema debe registrar metadatos minimos de usuario (rol, activo, fechas de alta/actualizacion). |

## Bloque C - Inventario (Alta)

| ID | Prioridad | Requisito funcional |
|---|---|---|
| RF-010 | Alta | El sistema debe permitir CRUD de items de inventario (`/api/inventario`) con persistencia en MySQL. |
| RF-011 | Alta | El sistema debe validar stock, stock minimo, precio y categorias en backend. |
| RF-012 | Alta | El sistema debe marcar disponibilidad de item para pedidos segun reglas (`disponible_para_pedidos`). |
| RF-013 | Alta | El sistema debe mantener trazabilidad basica de cambios de inventario (quien/cuando). |

## Bloque D - Productos finales (Alta)

| ID | Prioridad | Requisito funcional |
|---|---|---|
| RF-014 | Alta | El sistema debe permitir CRUD de productos finales (`/api/productos-finales`). |
| RF-015 | Alta | El sistema debe asociar cada producto final con materiales de inventario y cantidad requerida (N:M). |
| RF-016 | Alta | El sistema debe asociar productos finales a clientes habilitados (N:M). |
| RF-017 | Alta | El sistema debe validar datos de negocio del producto final (servicio, talla/modelo, precio, empaque). |

## Bloque E - Pedidos de cliente (Alta)

| ID | Prioridad | Requisito funcional |
|---|---|---|
| RF-018 | Alta | El cliente debe poder crear pedido (`POST /api/pedidos`) seleccionando producto final y cantidad. |
| RF-019 | Alta | El sistema debe validar existencia de cliente y producto final, y reglas de estado inicial del pedido. |
| RF-020 | Alta | El cliente debe poder consultar estado de sus pedidos activos e historico. |
| RF-021 | Alta | El admin debe poder listar y gestionar todos los pedidos con filtros por estado/cliente/fecha. |
| RF-022 | Alta | El sistema debe permitir cambio controlado de estado de pedido (`PATCH /api/pedidos/{id}/estado`). |

## Bloque F - Tareas de operario (Media)

| ID | Prioridad | Requisito funcional |
|---|---|---|
| RF-023 | Media | El sistema debe permitir crear y asociar tareas operativas a pedidos. |
| RF-024 | Media | El operario debe visualizar sus tareas y actualizar su avance/estado. |
| RF-025 | Media | El sistema debe restringir que un operario solo edite tareas asignadas o permitidas por rol. |

## Bloque G - Historial, reportes y paneles (Media)

| ID | Prioridad | Requisito funcional |
|---|---|---|
| RF-026 | Media | El sistema debe mostrar historico de pedidos para Admin y Cliente con filtros basicos. |
| RF-027 | Media | El sistema debe ofrecer reportes operativos basicos (volumen pedidos, estados, stock critico). |
| RF-028 | Media | El dashboard por rol debe mostrar metricas resumidas acorde a permisos. |

## Bloque H - Calidad funcional transversal (Baja)

| ID | Prioridad | Requisito funcional |
|---|---|---|
| RF-029 | Baja | El sistema debe estandarizar respuestas de error para validaciones y excepciones de negocio. |
| RF-030 | Baja | El sistema debe soportar paginacion y ordenacion en listados principales para escalar datos. |
| RF-031 | Baja | El sistema debe mantener auditoria minima de operaciones criticas (auth, pedidos, inventario, usuarios). |

## 4.1) Donde se comprueba cada requisito dentro de la app (trazabilidad)

> Referencias de comprobacion en frontend actual (`App-RealPrint`) y su cobertura respecto al objetivo final con Spring Boot + Hibernate + MySQL.

> Leyenda de pruebas recomendadas:
> - `unit`: validaciones/reglas aisladas (service, mapper, util).
> - `integration`: controller + service + repository + MySQL (o Testcontainers).
> - `e2e`: flujo funcional completo desde UI.

| ID | Donde se comprueba en la app | Cobertura actual | Endpoint backend objetivo | Prueba recomendada |
|---|---|---|---|---|
| RF-001 | `App-RealPrint/src/pages/Login.tsx`<br>`App-RealPrint/src/components/LoginForm.tsx`<br>`App-RealPrint/src/hooks/useLogin.ts`<br>`App-RealPrint/src/services/authService.ts` | Completa en UI (modo local/API) | `POST /api/auth/login` | integration + e2e |
| RF-002 | `App-RealPrint/src/context/AuthContext.tsx` (sesion/token)<br>`App-RealPrint/src/services/tokenStorage.ts`<br>`App-RealPrint/src/services/httpClient.ts` (Bearer token) | Parcial (JWT real depende backend) | `POST /api/auth/login`<br>`GET /api/auth/me` | unit + integration |
| RF-003 | `App-RealPrint/src/components/layout/ProtectedRoute.tsx`<br>`App-RealPrint/e2e/specs/protected-routes.spec.js` | Completa en frontend + E2E | `GET /api/auth/me` (200/401) | integration + e2e |
| RF-004 | `App-RealPrint/src/App.tsx` (`allowedRoles`)<br>`App-RealPrint/src/components/layout/ProtectedRoute.tsx`<br>`App-RealPrint/e2e/specs/auth-roles.spec.js` | Completa en frontend + E2E | `ALL /api/*` con control RBAC | integration + e2e |
| RF-005 | `App-RealPrint/src/context/AuthContext.tsx` (rehidratacion)<br>`App-RealPrint/src/services/authService.ts` (`getCurrentUser`) | Parcial (`/api/auth/me` pendiente en backend) | `GET /api/auth/me` | integration |
| RF-006 | `App-RealPrint/src/context/AuthContext.tsx` (`logout`)<br>`App-RealPrint/src/services/authService.ts`<br>`App-RealPrint/src/services/tokenStorage.ts` (`clearSession`) | Completa en frontend | `POST /api/auth/logout` | integration + e2e |
| RF-007 | `App-RealPrint/src/pages/admin/AdminUsuarios.tsx`<br>`App-RealPrint/src/hooks/useUsuariosData.ts`<br>`App-RealPrint/src/services/usuariosService.ts` | Parcial (UI completa, API final en migracion) | `GET /api/usuarios`<br>`POST /api/usuarios`<br>`PUT /api/usuarios/{id}`<br>`DELETE /api/usuarios/{id}` | integration + e2e |
| RF-008 | `App-RealPrint/src/pages/admin/AdminUsuarios.tsx` (alta/edicion UI) | Pendiente validacion fuerte en backend (unique) | `POST /api/usuarios`<br>`PUT /api/usuarios/{id}` | unit + integration |
| RF-009 | `App-RealPrint/src/pages/admin/AdminUsuarios.tsx` (rol/activo)<br>`App-RealPrint/src/context/data/usuariosDomain.ts` | Parcial (timestamps/auditoria en backend) | `POST /api/usuarios`<br>`PUT /api/usuarios/{id}` | integration |
| RF-010 | `App-RealPrint/src/pages/admin/AdminInventario.tsx`<br>`App-RealPrint/src/hooks/useInventarioData.ts`<br>`App-RealPrint/src/services/inventarioService.ts`<br>`App-RealPrint/e2e/specs/admin-inventario-crud.spec.js` | Alta cobertura en UI + E2E | `GET /api/inventario`<br>`POST /api/inventario`<br>`PUT /api/inventario/{id}`<br>`DELETE /api/inventario/{id}` | integration + e2e |
| RF-011 | `App-RealPrint/src/pages/admin/AdminInventario.tsx` (inputs/formulario) | Parcial (reglas definitivas en backend) | `POST /api/inventario`<br>`PUT /api/inventario/{id}` | unit + integration |
| RF-012 | `App-RealPrint/src/pages/admin/AdminInventario.tsx` (`disponibleParaPedidos`) | Parcial (regla final server-side pendiente) | `POST /api/inventario`<br>`PUT /api/inventario/{id}` | unit + integration |
| RF-013 | `App-RealPrint/src/services/logger.ts` (logs locales) | Pendiente trazabilidad negocio en backend/BD | `PUT /api/inventario/{id}` (con auditoria) | integration |
| RF-014 | `App-RealPrint/src/pages/admin/AdminProductosFinales.tsx`<br>`App-RealPrint/src/hooks/useProductosData.ts`<br>`App-RealPrint/src/context/data/productosDomain.ts` | Parcial (CRUD hoy local) | `GET /api/productos-finales`<br>`POST /api/productos-finales`<br>`PUT /api/productos-finales/{id}`<br>`DELETE /api/productos-finales/{id}` | integration + e2e |
| RF-015 | `App-RealPrint/src/pages/admin/AdminProductosFinales.tsx` (materiales asociados) | Parcial (persistencia N:M pendiente backend) | `POST /api/productos-finales`<br>`PUT /api/productos-finales/{id}` | unit + integration |
| RF-016 | `App-RealPrint/src/pages/admin/AdminProductosFinales.tsx` (`clientesPermitidos`)<br>`App-RealPrint/src/pages/cliente/ClienteNuevoPedido.tsx` (filtro por cliente) | Parcial | `POST /api/productos-finales`<br>`PUT /api/productos-finales/{id}` | integration + e2e |
| RF-017 | `App-RealPrint/src/pages/admin/AdminProductosFinales.tsx` (campos y reglas UI) | Parcial (validacion de negocio final en backend) | `POST /api/productos-finales`<br>`PUT /api/productos-finales/{id}` | unit + integration |
| RF-018 | `App-RealPrint/src/pages/cliente/ClienteNuevoPedido.tsx`<br>`App-RealPrint/src/hooks/usePedidosData.ts`<br>`App-RealPrint/src/context/data/pedidosDomain.ts` | Parcial (flujo funciona, API final en migracion) | `POST /api/pedidos` | integration + e2e |
| RF-019 | `App-RealPrint/src/pages/cliente/ClienteNuevoPedido.tsx`<br>`App-RealPrint/src/context/data/pedidosDomain.ts` | Parcial (validacion fuerte backend pendiente) | `POST /api/pedidos` | unit + integration |
| RF-020 | `App-RealPrint/src/pages/cliente/ClienteDashboard.tsx`<br>`App-RealPrint/src/pages/cliente/ClienteHistorial.tsx` | Completa en frontend | `GET /api/pedidos` (filtrado por cliente autenticado) | integration + e2e |
| RF-021 | `App-RealPrint/src/pages/admin/AdminPedidos.tsx` (listado/filtros) | Completa en UI, parcial en API final | `GET /api/pedidos?estado=&cliente=&fechaDesde=&fechaHasta=` | integration + e2e |
| RF-022 | `App-RealPrint/src/pages/admin/AdminPedidos.tsx` (`handleUpdateEstado`)<br>`App-RealPrint/src/context/data/pedidosDomain.ts` | Parcial (`PATCH /estado` pendiente backend) | `PATCH /api/pedidos/{id}/estado` | unit + integration + e2e |
| RF-023 | `App-RealPrint/src/context/data/pedidosDomain.ts` (`addTareaPorPedido`)<br>`App-RealPrint/src/context/data/tareasDomain.ts` | Parcial (sin servicio `tareas` dedicado aun) | `POST /api/tareas` | unit + integration |
| RF-024 | `App-RealPrint/src/pages/operario/OperarioTareas.tsx`<br>`App-RealPrint/src/pages/operario/OperarioDashboard.tsx` | Completa en frontend | `GET /api/tareas`<br>`PUT /api/tareas/{id}` | integration + e2e |
| RF-025 | `App-RealPrint/src/pages/operario/OperarioTareas.tsx` (`misTareas` por `operarioId`) | Parcial (enforcement backend pendiente) | `PUT /api/tareas/{id}` (control de propietario/rol) | integration + e2e |
| RF-026 | `App-RealPrint/src/pages/admin/AdminHistorial.tsx`<br>`App-RealPrint/src/pages/cliente/ClienteHistorial.tsx` | Completa en frontend | `GET /api/pedidos` con filtros de historico | integration + e2e |
| RF-027 | `App-RealPrint/src/pages/admin/AdminReportes.tsx` | Completa en frontend (basado en datos locales/contexto) | `GET /api/reportes/resumen` | integration |
| RF-028 | `App-RealPrint/src/pages/admin/AdminDashboard.tsx`<br>`App-RealPrint/src/pages/cliente/ClienteDashboard.tsx`<br>`App-RealPrint/src/pages/operario/OperarioDashboard.tsx` | Completa en frontend | `GET /api/reportes/dashboard?rol=` | integration + e2e |
| RF-029 | `App-RealPrint/src/services/errors.ts`<br>`App-RealPrint/src/hooks/useApiStatus.ts` | Parcial (falta contrato uniforme backend) | `ALL /api/*` (schema comun de error) | unit + integration |
| RF-030 | `App-RealPrint/src/hooks/usePagination.tsx` (hook disponible) | Pendiente aplicacion transversal en listados | `GET /api/usuarios?page=&size=&sort=`<br>`GET /api/inventario?page=&size=&sort=`<br>`GET /api/pedidos?page=&size=&sort=` | integration + e2e |
| RF-031 | `App-RealPrint/src/services/logger.ts` + logs auth en `App-RealPrint/src/services/authService.ts` | Parcial (auditoria persistente backend pendiente) | Auditoria en servicios criticos (`/api/auth/*`, `/api/pedidos/*`, `/api/inventario/*`, `/api/usuarios/*`) | integration |

---

## 5) Flujo correlativo principal (desde login)

1. **RF-001 a RF-006**: autenticacion, sesion y roles.
2. **RF-007 a RF-009**: base de usuarios y control de acceso operativo.
3. **RF-010 a RF-017**: inventario y productos finales disponibles para vender/fabricar.
4. **RF-018 a RF-022**: ciclo de pedido (creacion, seguimiento, cambio de estado).
5. **RF-023 a RF-025**: ejecucion operativa por tareas.
6. **RF-026 a RF-031**: visibilidad historica, reportes y robustez funcional.

---

## 6) Alcance de migracion (sin localStorage de negocio)

Para considerar esta especificacion cumplida en entorno objetivo:

- Ningun CRUD de negocio depende de `localStorage`.
- El frontend usa servicios API como fuente unica de verdad.
- Las entidades de negocio persisten en MySQL via Spring Data JPA/Hibernate.
- Las reglas criticas se ejecutan en capa `service` del backend.

---

## 7) Propuesta de MVP funcional (primera salida)

Se recomienda como corte minimo de produccion:

- **Obligatorio:** RF-001 a RF-022.
- **Siguiente iteracion:** RF-023 a RF-028.
- **Endurecimiento:** RF-029 a RF-031.

Esto permite salir con un flujo completo de negocio: acceso seguro -> administracion base -> inventario/producto -> pedidos.

