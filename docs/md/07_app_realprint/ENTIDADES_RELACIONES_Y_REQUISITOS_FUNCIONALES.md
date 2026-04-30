# Entidades, Relaciones y Requisitos Funcionales - RealPrint

**Fecha:** 2026-04-21  
**Alcance:** Sintesis basada en el estado actual del backend y la documentacion funcional del proyecto.

---

## 1) Entidades del backend (implementado hoy)

Fuente principal: `realprint-backend/src/main/java/com/realprint/realprintbackend/entity`

### 1.1 `Usuario`

Archivo: `realprint-backend/src/main/java/com/realprint/realprintbackend/entity/Usuario.java`

Campos relevantes:
- `id`
- `username` (unico)
- `passwordHash`
- `nombre`
- `email`
- `rol` (`RolUsuario`)
- `activo`

Uso funcional:
- Base de autenticacion y autorizacion por rol.
- Control de cuentas activas/inactivas.

### 1.2 `Pedido`

Archivo: `realprint-backend/src/main/java/com/realprint/realprintbackend/entity/Pedido.java`

Campos relevantes:
- Identidad y ownership: `id`, `clienteId`, `clienteNombre`
- Negocio: `servicio`, `subservicio`, `opcion`, `productoFinalId`, `descripcion`
- Cantidades y fechas: `cantidad`, `cantidadUnidades`, `fecha`, `fechaEntrega`
- Medidas y archivos: `measurementWidthCm`, `measurementHeightCm`, `fileUrlsJson`
- Estado/precio: `estado` (`PedidoEstado`), `total`
- Operativa: `boxTotal`, `cajasCompletadas`, `tamanoCaja`
- Auditoria tecnica: `createdAt`, `updatedAt`

Uso funcional:
- Entidad central del flujo de pedidos (cliente/admin).

### 1.3 `RolUsuario` (enum)

Archivo: `realprint-backend/src/main/java/com/realprint/realprintbackend/entity/RolUsuario.java`

Valores actuales:
- `ADMIN`
- `CLIENTE`

### 1.4 `PedidoEstado` (enum)

Archivo: `realprint-backend/src/main/java/com/realprint/realprintbackend/entity/PedidoEstado.java`

Valores actuales:
- `PENDIENTE`
- `EN_PROCESO`
- `COMPLETADO`

---

## 2) Relaciones entre entidades (estado actual)

> Nota: varias relaciones estan implementadas de forma logica (por IDs), no con mapeos JPA explicitos `@OneToMany/@ManyToOne`.

### 2.1 `Usuario` -> `RolUsuario` (1:1 logica)
- Cada usuario tiene un solo rol.
- Referencia: `Usuario.rol` en `Usuario.java`.

### 2.2 `Pedido` -> `PedidoEstado` (1:1 logica)
- Cada pedido tiene un estado actual.
- Referencia: `Pedido.estado` en `Pedido.java`.

### 2.3 `Usuario (cliente)` -> `Pedido` (1:N logica)
- Un cliente puede tener multiples pedidos.
- Se implementa por `Pedido.clienteId` + repositorio:
  - `findByClienteId(...)` en `realprint-backend/src/main/java/com/realprint/realprintbackend/repository/PedidoRepository.java`.

### 2.4 `Pedido` -> archivos (lista serializada)
- Los archivos del pedido se guardan en `fileUrlsJson` (texto JSON simple).
- Se usa para validar permisos de descarga:
  - `existsByClienteIdAndFileUrlsJsonContaining(...)` en `PedidoRepository.java`.
  - Control de acceso en `realprint-backend/src/main/java/com/realprint/realprintbackend/controller/FileController.java`.

### 2.5 Relacion de seguridad por rol (rutas)
- Definicion en `realprint-backend/src/main/java/com/realprint/realprintbackend/config/SecurityConfig.java`:
  - `/admin/**` -> solo `ADMIN`
  - `/cliente/**` -> `CLIENTE` o `ADMIN`
  - `/auth/login` publico

---

## 3) Modelo objetivo de dominio (documentado)

Fuente: `DIAGRAMAS/DiagramaEntidadRelacion.md`

El diagrama ER propone un dominio mas amplio que el backend actual:
- `USUARIO`, `ADMINISTRADOR`, `OPERARIO`, `CLIENTE`
- `PEDIDO`, `PAGO`, `CARRITO`, `ARTICULO`, `PRODUCTO`, `CONTACTO`
- Especializacion de usuario por perfiles
- Relaciones de negocio completas (por ejemplo carrito-articulos, pedido-pago, cliente-pedido, operario-procesa)

### Diferencia clave actual vs objetivo
- **Actual backend:** nucleo minimo (`Usuario`, `Pedido`, seguridad JWT, upload/download de archivos).
- **Objetivo documental:** modelo empresarial completo multientidad con operativa extendida.

---

## 4) Requisitos funcionales de la app

Fuente principal: `md/07_app_realprint/ANALISIS_REQUISITOS_FUNCIONALES_PRIORIZADOS.md`

## 4.1 Bloques funcionales priorizados

### A) Criticos (RF-001 a RF-006)
- Login con credenciales.
- Sesion autenticada JWT.
- Proteccion de rutas privadas.
- Autorizacion por rol.
- Rehidratacion de sesion (`me`).
- Logout.

### B) Altos (RF-007 a RF-022)
- CRUD usuarios.
- CRUD inventario.
- CRUD productos finales.
- Ciclo completo de pedidos (crear, consultar, listar, cambio de estado).

### C) Medios (RF-023 a RF-028)
- Tareas para operarios.
- Historico.
- Reportes.
- Dashboards por rol.

### D) Bajos / calidad (RF-029 a RF-031)
- Estandar de errores.
- Paginacion y ordenacion.
- Auditoria de operaciones criticas.

---

## 5) Estado funcional observado (resumen ejecutivo)

Con base en backend Java actual + documentacion:

- **Implementado hoy en backend:**
  - Login JWT base (`/auth/login`) en `AuthController` + `AuthService`.
  - Seguridad por roles/rutas en `SecurityConfig`.
  - Entidades base `Usuario` y `Pedido`.
  - Subida y descarga de archivos con control de acceso (`FileController`).

- **Parcial/Pendiente para objetivo funcional completo:**
  - CRUD completos de `/pedidos`, `/inventario`, `/productos-finales`, `/usuarios` al nivel definido en especificacion.
  - Rol `OPERARIO` en backend (en enum actual no aparece).
  - Modelo relacional completo del diagrama ER (pagos, carrito, articulos, contacto, etc.).

---

## 6) Cambios Implementados en Este Ciclo (2026-04-21)

### Frontend Enhancements
- **pricing.ts:** Función centralizada de cálculo de distribución + precios con soporte dual (dimensiones vs. legacy).
- **OrderLayoutPreview.tsx:** Preview responsive del paño 60×100 cm con distribución visual en tiempo real.
- **Step2Details.tsx:** Flujo de carga de archivos + definición de ancho/alto POR unidad (NEW).
- **pricing.test.ts:** Suite de 7 tests unitarios validando cálculos en casos frontera.

### Código & Documentación
- Comentarios didácticos agregados a `pricing.ts` y `OrderLayoutPreview.tsx`.
- Test coverage para distribución, legacy fallback y redondeo facturable.
- `.gitignore` actualizado para ignorar `realprint-backend/` como repo embebido.

### Documentación del Proyecto
- `VALIDACION_BACKEND_FRONTEND_CONSISTENCY.md` creado: matriz de mapping Pedido ↔ FormData.
- Estructura de archivos validada: no hay archivos sobrantes, código limpio.

---

## 7) Referencias Utilizadas

- `realprint-backend/src/main/java/com/realprint/realprintbackend/entity/Usuario.java`
- `realprint-backend/src/main/java/com/realprint/realprintbackend/entity/Pedido.java`
- `realprint-backend/src/main/java/com/realprint/realprintbackend/entity/RolUsuario.java`
- `realprint-backend/src/main/java/com/realprint/realprintbackend/entity/PedidoEstado.java`
- `realprint-backend/src/main/java/com/realprint/realprintbackend/repository/PedidoRepository.java`
- `realprint-backend/src/main/java/com/realprint/realprintbackend/controller/FileController.java`
- `realprint-backend/src/main/java/com/realprint/realprintbackend/config/SecurityConfig.java`
- `realprint-backend/src/main/java/com/realprint/realprintbackend/controller/AuthController.java`
- `realprint-backend/src/main/java/com/realprint/realprintbackend/service/AuthService.java`
- `DIAGRAMAS/DiagramaEntidadRelacion.md`
- `md/07_app_realprint/ANALISIS_REQUISITOS_FUNCIONALES_PRIORIZADOS.md`
- `md/07_app_realprint/BACKEND_SPECIFICATION.md`
- `App-RealPrint/src/components/CreateOrderForm/pricing.ts` (actualizado con didácticos)
- `App-RealPrint/src/components/CreateOrderForm/OrderLayoutPreview.tsx` (actualizado con didácticos)
- `App-RealPrint/src/components/CreateOrderForm/pricing.test.ts` (7 tests, 100% passing)

