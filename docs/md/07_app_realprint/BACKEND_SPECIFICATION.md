# 📋 AUDITORÍA FRONTEND → READINESS PARA BACKEND

**Fecha:** 2026-04-19  
**Estado:** ✅ **LISTO PARA EMPEZAR BACKEND**

---

## 1. ESTADO GENERAL DEL FRONTEND

### ✅ Completado y Funcional

- **Autenticación local** funcionando (demo users en localStorage).
- **Nuevo Pedido** con flujo completo:
  - Solo Serigrafía (multiarchivo, medidas 2D, rango de precios).
  - Serigrafía + Planchado con prenda propia (multiarchivo, medidas, ubicación).
  - Serigrafía + Planchado con prenda de RealPrint (producto final, multiarchivo, medidas).
- **Admin de Productos Finales** permite crear/editar/ver.
- **Admin de Inventario** permite crear/editar/ver materiales.
- **Admin de Pedidos** muestra estado y permite cambiar.
- **Cliente** ve sus pedidos activos en dashboard y historial.
- **Precios por rangos** editables en admin (pequeño/mediano/grande).
- **Estados de pedido** consistentes (pendiente → en_proceso → completado).

### 🔴 Crítico: Falta Backend API Real

Actualmente:
- `VITE_USE_LOCAL_AUTH=true` → autenticación local solo.
- `VITE_USE_PEDIDOS_SERVICE_*=false` → pedidos guardados en localStorage (pérdida al limpiar caché).
- `VITE_USE_INVENTARIO_SERVICE_*=false` → inventario en localStorage.
- `VITE_USE_USUARIOS_SERVICE_*=false` → usuarios en localStorage.

---

## 2. CONTRATOS HTTP ESPERADOS POR EL FRONTEND

Todos los endpoints esperan **JSON request/response** con auth bearer token.

### 🔐 Autenticación

#### `POST /auth/login`

```json
Request:
{
  "username": "admin",
  "password": "admin123"
}

Response (200):
{
  "user": {
    "id": 1,
    "username": "admin",
    "nombre": "Administrador",
    "role": "admin",
    "email": "admin@realprint.com",
    "activo": true
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### 📦 PEDIDOS (CRITICAL)

#### `POST /pedidos` - Crear pedido

```json
Request:
{
  "clienteId": 2,
  "cliente": "Cliente Demo",
  "servicio": "serigrafia",
  "subservicio": "solo_serigrafia" | "serigrafia+planchado",
  "opcion": "cliente_ropa" | "realprint_ropa" | "",
  "productoFinalId": 1769000000000,
  "pedido": "Pedido 2026-04-19",
  "descripcion": "Prenda: Camiseta | Producto: ... | Ubicacion: pecho izquierdo | Archivos: ...",
  "cantidad": 10,
  "cantidadUnidades": 10,
  "fechaEntrega": "2026-04-26",
  "measurementWidthCm": 10,
  "measurementHeightCm": 10,
  "fileUrls": ["file1.pdf", "file2.png"],
  "total": 35.00
}

Response (201):
{
  "id": "1713571200000",
  "clienteId": 2,
  "cliente": "Cliente Demo",
  "servicio": "serigrafia",
  "subservicio": "solo_serigrafia",
  "opcion": "",
  "productoFinalId": null,
  "pedido": "Pedido 2026-04-19",
  "descripcion": "...",
  "cantidad": 10,
  "cantidadUnidades": 10,
  "fecha": "2026-04-19",
  "fechaEntrega": "2026-04-26",
  "measurementWidthCm": 10,
  "measurementHeightCm": 10,
  "fileUrls": ["file1.pdf", "file2.png"],
  "estado": "pendiente",
  "total": 35.00,
  "boxTotal": 1,
  "cajasCompletadas": 0,
  "tamanoCaja": 50
}
```

#### `GET /pedidos` - Listar pedidos

```json
Query: ?clienteId=2 (opcional, devuelve todos si admin)

Response (200):
[
  { id, clienteId, pedido, estado, ... },
  ...
]
```

#### `GET /pedidos/:id` - Obtener pedido

```json
Response (200):
{ id, clienteId, pedido, descripcion, estado, ... }
```

#### `PUT /pedidos/:id` - Actualizar pedido

```json
Request:
{
  "estado": "en_proceso" | "completado" | "cancelado",
  "descripcion": "...",
  ...
}

Response (200):
{ id, ... (pedido actualizado) }
```

#### `DELETE /pedidos/:id` - Eliminar pedido

```
Response (204): No content
```

---

### 📦 INVENTARIO

#### `GET /inventario` - Listar inventario

```json
Response (200):
[
  {
    "id": 1768852685196,
    "nombre": "ESCUDO ADULTO",
    "categoria": "Transfer",
    "stock": 20000,
    "stockMinimo": 2500,
    "precio": 2,
    "disponibleParaPedidos": false,
    "serviciosDisponibles": ["serigrafia"],
    "clientesPermitidos": [],
    "usados": 0
  },
  ...
]
```

#### `POST /inventario` - Crear item

```json
Request:
{
  "nombre": "NUEVO TRANSFER",
  "categoria": "Transfer",
  "stock": 1000,
  "stockMinimo": 100,
  "precio": 1.5,
  "disponibleParaPedidos": false,
  "serviciosDisponibles": ["serigrafia"],
  "clientesPermitidos": []
}

Response (201):
{ id, nombre, ... }
```

#### `PUT /inventario/:id` - Actualizar

```json
Request:
{
  "stock": 19000,
  "usados": 1000,
  "precio": 2.0
}

Response (200):
{ id, stock, usados, ... }
```

#### `DELETE /inventario/:id`

```
Response (204): No content
```

---

### 🎨 PRODUCTOS FINALES

#### `GET /productos-finales` - Listar

```json
Response (200):
[
  {
    "id": 1769000000000,
    "nombre": "CAMISETA 1ª EQUIPACIÓN 128 (niño)",
    "servicio": "serigrafia",
    "subservicio": "serigrafia+planchado",
    "quienRopa": "cliente_ropa" | "realprint_ropa" | "ambas",
    "prenda": "Camiseta",
    "modelo": "1ª equipación",
    "talla": "128",
    "precio": 11,
    "enCaja": true,
    "tamanoCaja": 50,
    "materiales": [
      { "id": 1768852685196, "cantidad": 1 },
      ...
    ],
    "clientesPermitidos": ["2"],
    "productosInventario": [1768852685196, 1768852729362, ...]
  },
  ...
]
```

#### `POST /productos-finales` - Crear

```json
Request:
{
  "nombre": "NUEVA CAMISETA",
  "servicio": "serigrafia",
  "subservicio": "solo_serigrafia",
  "quienRopa": "cliente_ropa",
  "prenda": "Camiseta",
  "modelo": "Custom",
  "talla": "L",
  "precio": 15,
  "enCaja": true,
  "tamanoCaja": 50,
  "materiales": [
    { "id": 1768852685196, "cantidad": 1 }
  ],
  "clientesPermitidos": ["2"]
}

Response (201):
{ id, nombre, ... }
```

#### `PUT /productos-finales/:id` - Actualizar

```json
Response (200):
{ id, ... (producto actualizado) }
```

#### `DELETE /productos-finales/:id`

```
Response (204): No content
```

---

### 👥 USUARIOS

#### `GET /usuarios` - Listar

```json
Response (200):
[
  {
    "id": 1,
    "username": "admin",
    "nombre": "Administrador",
    "email": "admin@realprint.com",
    "role": "admin",
    "activo": true
  },
  ...
]
```

#### `POST /usuarios` - Crear

```json
Request:
{
  "username": "newuser",
  "password": "pass123",
  "nombre": "Nuevo Usuario",
  "email": "new@realprint.com",
  "role": "cliente",
  "activo": true
}

Response (201):
{ id, username, nombre, ... (sin password) }
```

#### `PUT /usuarios/:id` - Actualizar

```json
Response (200):
{ id, ... }
```

#### `DELETE /usuarios/:id`

```
Response (204): No content
```

---

### ⚙️ CONFIGURACIÓN DE PRECIOS (NUEVA - Opcional fase 1)

#### `GET /precios-config`

```json
Response (200):
{
  "ranges": [
    {
      "id": "small",
      "label": "Pequeno",
      "maxWidthCm": 10,
      "maxHeightCm": 10,
      "soloSerigrafiaPrice": 3.5,
      "serigrafiaPlanchadoPrice": 5.5
    },
    ...
  ]
}
```

#### `PUT /precios-config`

```json
Request: { "ranges": [...] }
Response (200): { ranges: [...] }
```

---

## 3. PLAN DE ACTIVACIÓN INCREMENTAL DEL BACKEND

### Fase 1 (MVP - Semana 1)

- [ ] Endpoint `/auth/login` + `/auth/logout`
- [ ] CRUD `/pedidos` (create, read, update, delete)
- [ ] CRUD `/inventario` (create, read, update, delete)
- [ ] CRUD `/productos-finales` (create, read, update, delete)
- [ ] CRUD `/usuarios` (básico)
- [ ] Activar flags en `.env`:
  ```
  VITE_USE_LOCAL_AUTH=false
  VITE_USE_PEDIDOS_SERVICE_CREATE=true
  VITE_USE_PEDIDOS_SERVICE_UPDATE=true
  VITE_USE_PEDIDOS_SERVICE_DELETE=true
  VITE_USE_INVENTARIO_SERVICE_CREATE=true
  VITE_USE_INVENTARIO_SERVICE_UPDATE=true
  VITE_USE_INVENTARIO_SERVICE_DELETE=true
  VITE_USE_USUARIOS_SERVICE_CREATE=true
  VITE_USE_USUARIOS_SERVICE_UPDATE=true
  VITE_USE_USUARIOS_SERVICE_DELETE=true
  ```

### Fase 2 (Mejoras - Semana 2+)

- [ ] `/precios-config` GET/PUT
- [ ] Validación de stock en creación de pedidos
- [ ] Cambio automático de estado según operaciones
- [ ] Persistencia de archivos multiarchivo
- [ ] Reportes y estadísticas

---

## 4. ESTRUCTURA DE CARPETAS ESPERADA EN BACKEND

Recomendación (Spring Boot):

```
src/main/java/com/realprint/
├── controller/
│   ├── AuthController.java
│   ├── PedidosController.java
│   ├── InventarioController.java
│   ├── ProductosFinalesController.java
│   ├── UsuariosController.java
│   └── PreciosConfigController.java (opcional)
├── service/
│   ├── AuthService.java
│   ├── PedidosService.java
│   ├── InventarioService.java
│   ├── ProductosFinalesService.java
│   ├── UsuariosService.java
│   └── PreciosConfigService.java (opcional)
├── repository/
│   ├── PedidoRepository.java
│   ├── InventarioRepository.java
│   ├── ProductoFinalRepository.java
│   ├── UsuarioRepository.java
│   └── PreciosConfigRepository.java (opcional)
├── entity/
│   ├── Pedido.java
│   ├── InventarioItem.java
│   ├── ProductoFinal.java
│   ├── Usuario.java
│   ├── Material.java
│   └── PreciosConfig.java (opcional)
├── dto/
│   ├── LoginRequest/Response
│   ├── PedidoDTO
│   ├── InventarioDTO
│   ├── ProductoFinalDTO
│   ├── UsuarioDTO
│   └── PreciosConfigDTO
├── exception/
│   ├── ResourceNotFoundException
│   ├── UnauthorizedException
│   └── ValidationException
└── config/
    ├── SecurityConfig.java
    ├── CorsConfig.java
    └── JwtTokenProvider.java
```

---

## 5. DEPENDENCIAS Y TECNOLOGÍAS RECOMENDADAS

### Spring Boot (Recomendado para este proyecto)

```xml
<!-- pom.xml -->
<dependencies>
  <!-- Spring Web -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>3.2.0</version>
  </dependency>

  <!-- JPA / Hibernate -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
    <version>3.2.0</version>
  </dependency>

  <!-- JWT -->
  <dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
  </dependency>

  <!-- Base de datos (H2 para desarrollo, MySQL para producción) -->
  <dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
  </dependency>

  <!-- Validación -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
    <version>3.2.0</version>
  </dependency>

  <!-- Lombok (opcional pero recomendado) -->
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
  </dependency>

  <!-- Tests -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <version>3.2.0</version>
    <scope>test</scope>
  </dependency>
</dependencies>
```

---

## 6. VERIFICACIÓN DE READINESS

### ✅ Frontend Checklist

- [x] Contrato de datos consistente y bien definido.
- [x] Servicios HTTP preparados (`httpClient` + `pedidosService`, `inventarioService`, etc.).
- [x] Feature flags para activación incremental.
- [x] Estados de error normalizados (`ApiError`).
- [x] Auth token almacenado y reenviado en cada request.
- [x] Formularios con validación en cliente.
- [x] UX preparada para estados `pendiente/en_proceso/completado`.

### 🔧 Backend Checklist (TODO)

- [ ] Base de datos relacional (MySQL / PostgreSQL).
- [ ] Entidades JPA mapeadas.
- [ ] Controllers con rutas HTTP.
- [ ] JWT token generator/validator.
- [ ] CORS configurado.
- [ ] Validación de permisos (admin vs cliente).
- [ ] Manejo de errores centralizado.
- [ ] Tests básicos.

---

## 7. PRÓXIMOS PASOS

### Ahora (Backend)

1. **Crear proyecto base** Spring Boot con dependencias.
2. **Configurar BD** (H2 en dev, schema.sql).
3. **Implementar entidades** (Pedido, Inventario, ProductoFinal, Usuario).
4. **Crear Controllers** para `/auth`, `/pedidos`, `/inventario`, `/productos-finales`, `/usuarios`.
5. **Tests básicos** de integración.

### Entonces (Frontend ↔ Backend)

1. Cambiar `.env` para activar flags de servicios.
2. Validar flujos de creación/edición con backend real.
3. Manejar offline gracefully si backend no disponible.

---

## 🎯 CONCLUSIÓN

✅ **SÍ, EL FRONTEND ESTÁ LISTO PARA BACKEND.**

El frontend define contratos claros, tiene servicios HTTP preparados, y puede activar el backend de forma incremental sin romper la UX. Puedes empezar a desarrollar backend ahora mismo siguiendo la especificación de endpoints y DTOs de este documento.

