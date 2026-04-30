# Mapa de Arquitectura Objetivo - RealPrint (MySQL + Spring Boot + Hibernate)

**Fecha:** 2026-03-28  
**Estado:** Documento de arquitectura objetivo  
**Decision de proyecto:** eliminar `localStorage` para datos de negocio y persistir en MySQL via API REST

---

## 1) Objetivo del documento

Definir una vista completa del proyecto RealPrint para su estado final:

- Frontend React enfocado en UI/UX y orquestacion.
- Backend Spring Boot como capa unica de negocio.
- Hibernate/JPA para persistencia en MySQL.
- Eliminacion progresiva de `localStorage` (solo usado temporalmente durante migracion).

Este documento sirve como guia tecnica para decidir implementacion total o parcial por fases.

---

## 2) Mapa global del sistema

```text
[Usuario Admin/Cliente/Operario]
            |
            v
      [Frontend React]
  (paginas, rutas, forms, guards)
            |
            v
       [HTTP Client]
 (fetch + token + manejo errores)
            |
            v
   [API REST Spring Boot]
 (controllers -> services -> repositories)
            |
            v
      [MySQL + Hibernate]
  (entidades, relaciones, indices)
```

### Responsabilidades por capa

- **Frontend:** renderizar pantallas, validar entrada basica, mostrar estados/carga/error.
- **Backend:** reglas de negocio, autorizacion por rol, transacciones, integridad de datos.
- **Base de datos:** almacenamiento persistente, consistencia referencial, historico.

---

## 3) Estado actual vs estado objetivo

### Estado actual (segun codigo existente)

- `App-RealPrint/src/context/DataContext.tsx` centraliza estado de dominios.
- `App-RealPrint/src/context/data/useLocalStorageState.ts` persiste datos en navegador.
- Inventario ya tiene via de API opcional por flags (`dataConfig` + `inventarioService`).
- Productos finales aun se crean y guardan en estado local/contexto.

### Estado objetivo

- Todo CRUD de negocio pasa por backend.
- `localStorage` queda solo para preferencias de UI (si se desea).
- Frontend consume contratos estables REST + DTOs.
- Backend aplica reglas de negocio como fuente de verdad.

---

## 4) Frontend objetivo (React)

## 4.1 Modulos principales

- **Auth y rutas protegidas:** control de sesion y redireccion por rol.
- **Inventario (Admin):** CRUD de items y alertas de stock.
- **Productos Finales (Admin):** CRUD y asociacion de materiales/clientes.
- **Pedidos (Admin/Cliente):** alta, seguimiento y cambios de estado.
- **Tareas (Operario):** asignacion y avance de trabajo.

## 4.2 Estructura recomendada

```text
src/
  components/
  pages/
    admin/
    cliente/
    operario/
  services/
    httpClient.ts
    authService.ts
    inventarioService.ts
    productosFinalesService.ts   <- nuevo
    pedidosService.ts
    usuariosService.ts
    tareasService.ts             <- recomendado
  context/
    AuthContext.tsx
    DataContext.tsx (adelgazado)
  hooks/
  utils/
```

## 4.3 Rol de `DataContext` tras migracion

- Mantener estado de UI (filtros, seleccion, modales, cache corto).
- Eliminar persistencia de negocio local.
- Delegar lectura/escritura a servicios API.

---

## 5) Backend objetivo (Spring Boot + Hibernate)

## 5.1 Capas

```text
Controller (REST)
   -> Service (reglas de negocio)
      -> Repository (Spring Data JPA)
         -> MySQL (tablas)
```

## 5.2 Paquetes sugeridos

```text
com.realprint
  config/
  security/
  auth/
  usuarios/
  inventario/
  productosfinales/
  pedidos/
  tareas/
  common/
```

## 5.3 Principios de implementacion

- DTOs para request/response (no exponer entidades directamente).
- Validaciones con `jakarta.validation`.
- Manejo global de errores (`@ControllerAdvice`).
- Transacciones en operaciones compuestas (`@Transactional`).
- Logs estructurados de operaciones criticas.

---

## 6) Modelo de datos conceptual (MySQL)

> Nota: modelo conceptual orientado a tu dominio actual. Puede ajustarse en detalle durante implementacion.

## 6.1 Entidades nucleares

### `usuarios`

- `id` (PK)
- `username` (unique)
- `password_hash`
- `nombre`
- `email` (unique)
- `role` (`ADMIN`, `CLIENTE`, `OPERARIO`)
- `activo`
- `created_at`, `updated_at`

### `inventario_items`

- `id` (PK)
- `nombre`
- `categoria`
- `stock`
- `stock_minimo`
- `precio`
- `disponible_para_pedidos`
- `usados`
- `created_at`, `updated_at`

### `inventario_item_servicios`

- `inventario_item_id` (FK)
- `servicio` (`serigrafia`, `rotulacion`)

### `productos_finales`

- `id` (PK)
- `nombre`
- `servicio`
- `subservicio`
- `quien_ropa`
- `prenda`
- `modelo`
- `talla`
- `precio`
- `en_caja`
- `tamano_caja`
- `created_at`, `updated_at`

### `producto_final_materiales` (N:M con cantidad)

- `producto_final_id` (FK)
- `inventario_item_id` (FK)
- `cantidad`

### `producto_final_clientes` (N:M)

- `producto_final_id` (FK)
- `cliente_id` (FK -> usuarios.id)

### `pedidos`

- `id` (PK)
- `cliente_id` (FK)
- `producto_final_id` (FK)
- `cantidad`
- `estado`
- `fecha_entrega`
- `observaciones`
- `created_at`, `updated_at`

### `tareas`

- `id` (PK)
- `pedido_id` (FK)
- `operario_id` (FK -> usuarios.id)
- `estado`
- `descripcion`
- `created_at`, `updated_at`

## 6.2 Relaciones clave

- Un **producto final** usa muchos **items de inventario** con cantidad.
- Un **producto final** puede estar habilitado para muchos **clientes**.
- Un **pedido** pertenece a un **cliente** y referencia un **producto final**.
- Un **pedido** puede generar una o mas **tareas** para operarios.

---

## 7) Contrato REST recomendado

## 7.1 Auth

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## 7.2 Usuarios

- `GET /api/usuarios`
- `GET /api/usuarios/{id}`
- `POST /api/usuarios`
- `PUT /api/usuarios/{id}`
- `DELETE /api/usuarios/{id}`

## 7.3 Inventario

- `GET /api/inventario`
- `GET /api/inventario/{id}`
- `POST /api/inventario`
- `PUT /api/inventario/{id}`
- `DELETE /api/inventario/{id}`

## 7.4 Productos finales

- `GET /api/productos-finales`
- `GET /api/productos-finales/{id}`
- `POST /api/productos-finales`
- `PUT /api/productos-finales/{id}`
- `DELETE /api/productos-finales/{id}`

## 7.5 Pedidos

- `GET /api/pedidos`
- `GET /api/pedidos/{id}`
- `POST /api/pedidos`
- `PUT /api/pedidos/{id}`
- `PATCH /api/pedidos/{id}/estado`
- `DELETE /api/pedidos/{id}`

## 7.6 Tareas

- `GET /api/tareas`
- `GET /api/tareas/{id}`
- `POST /api/tareas`
- `PUT /api/tareas/{id}`

---

## 8) Flujos funcionales clave (end-to-end)

## 8.1 Crear producto de inventario

```text
AdminInventario (UI)
  -> useInventarioData
    -> inventarioService.create
      -> POST /api/inventario
        -> InventarioController
          -> InventarioService
            -> InventarioRepository
              -> MySQL
```

## 8.2 Crear producto final

```text
AdminProductosFinales (UI)
  -> productosFinalesService.create
    -> POST /api/productos-finales
      -> valida materiales/clientes
      -> guarda producto + relaciones (transaccion)
      -> MySQL
```

## 8.3 Crear pedido

```text
ClienteNuevoPedido (UI)
  -> pedidosService.create
    -> POST /api/pedidos
      -> valida cliente + producto + reglas
      -> guarda pedido
      -> genera tareas iniciales (si aplica)
      -> responde estado inicial
```

## 8.4 Login y autorizacion

```text
Login UI
  -> authService.login
    -> POST /api/auth/login
      -> JWT
      -> frontend adjunta token en Authorization
      -> backend autoriza por rol en cada endpoint
```

---

## 9) Estrategia para eliminar `localStorage`

## 9.1 Principio

- Migrar por dominio, sin romper UI.
- Mantener fallback corto solo durante pruebas.
- Retirar fallback al cerrar cada fase.

## 9.2 Fases propuestas

### Fase 1 - Inventario API first

- Activar operaciones API de inventario.
- Confirmar persistencia real en MySQL.
- Quitar dependencia de `realprint_inventario`.

### Fase 2 - Productos finales

- Crear `productosFinalesService` en frontend.
- Implementar endpoints backend y relaciones N:M.
- Quitar `realprint_productos_finales`.

### Fase 3 - Pedidos y tareas

- Mover reglas de negocio de pedidos al backend.
- Integrar tareas por estado de pedido.
- Retirar persistencia local de pedidos/tareas.

### Fase 4 - Cierre

- Limpiar codigo legacy de contexto.
- Endurecer seguridad (roles finos, expiracion token, auditoria).
- Estabilizar con tests integracion/e2e.

---

## 10) Riesgos tecnicos y mitigaciones

- **Riesgo:** duplicar logica entre frontend y backend.  
  **Mitigacion:** mover reglas criticas a services backend y dejar frontend para validacion UX.

- **Riesgo:** inconsistencias en relaciones N:M.  
  **Mitigacion:** DTOs claros + validacion FK + transacciones.

- **Riesgo:** migracion parcial larga con doble fuente de verdad.  
  **Mitigacion:** cerrar cada fase retirando fallback local al terminar.

- **Riesgo:** rendimiento en listados grandes.  
  **Mitigacion:** paginacion backend (`page`, `size`, `sort`) e indices.

- **Riesgo:** seguridad incompleta en primeros sprints.  
  **Mitigacion:** definir auth/roles desde inicio, aunque sea version minima.

---

## 11) Orden recomendado de implementacion

1. Base backend (proyecto Spring Boot, conexion MySQL, seguridad minima, manejo de errores).
2. Dominio Inventario completo (entity/repo/service/controller + FE conectado).
3. Dominio Productos Finales con relaciones a inventario/clientes.
4. Dominio Pedidos + Tareas con reglas de negocio.
5. Endurecimiento: tests integracion, observabilidad, optimizacion y limpieza legacy.

---

## 12) Criterios de finalizacion (Definition of Done)

Un dominio se considera migrado cuando:

- CRUD completo funciona contra API.
- Datos persisten en MySQL y sobreviven reinicios.
- No depende de `localStorage` para negocio.
- Tiene validaciones backend y manejo de errores consistente.
- Tiene pruebas minimas (unitarias/integracion) y flujo E2E principal.

---

## 13) Anexo de alineacion con frontend actual

Referencias utiles en el workspace:

- `App-RealPrint/src/context/DataContext.tsx`
- `App-RealPrint/src/context/data/useDataState.ts`
- `App-RealPrint/src/context/data/useLocalStorageState.ts`
- `App-RealPrint/src/context/data/inventarioDomain.ts`
- `App-RealPrint/src/context/data/productosDomain.ts`
- `App-RealPrint/src/services/httpClient.ts`
- `App-RealPrint/src/services/inventarioService.ts`
- `App-RealPrint/src/pages/admin/AdminInventario.tsx`
- `App-RealPrint/src/pages/admin/AdminProductosFinales.tsx`

Este anexo permite mapear rapidamente que parte del frontend ya esta preparada para API y cual todavia depende del estado local.

