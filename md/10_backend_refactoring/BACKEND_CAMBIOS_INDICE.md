# ÍNDICE COMPLETO DE CAMBIOS BACKEND-FRONTEND

## 📑 Documentos Generados

| Documento | Propósito | Ubicación |
|-----------|-----------|-----------|
| **Backend Refactor Summary** | Resumen ejecutivo de todos los cambios | `/BACKEND_REFACTOR_SUMMARY.md` |
| **Backend Verification Guide** | Guía paso a paso para verificar sincronización | `/BACKEND_VERIFICATION_GUIDE.md` |
| **Backend Estado Architecture** | Análisis técnico detallado del mapeo de estados | `/BACKEND_ESTADO_ARCHITECTURE.md` |
| **Este Índice** | Referencia rápida de archivos modificados | `/BACKEND_CAMBIOS_INDICE.md` |

---

## 🗂️ ARCHIVOS MODIFICADOS Y CREADOS

### ✨ NUEVOS ARCHIVOS (5)

#### 1. `PedidoDTO.java`
- **Ubicación**: `realprint-backend/src/main/java/com/realprint/realprintbackend/dto/PedidoDTO.java`
- **Tipo**: DTO (Data Transfer Object)
- **Propósito**: Transferir datos de pedidos entre Backend → Frontend
- **Cambio crítico**: Campo `estado` es `String` en minúsculas, no `PedidoEstado` enum
- **Líneas**: ~60 líneas
- **Anotaciones**: `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`
- **Campos principales**:
  - `id`, `clienteId`, `clienteNombre`, `servicio`, `descripcion`
  - `estado` (String) ← ¡CRÍTICO!
  - `fileUrlsJson`, `total`, `fecha`, `fechaEntrega`

#### 2. `PedidoMapper.java`
- **Ubicación**: `realprint-backend/src/main/java/com/realprint/realprintbackend/mapper/PedidoMapper.java`
- **Tipo**: Mapper (Conversion layer)
- **Propósito**: Convertir Pedido (Entity) ↔ PedidoDTO
- **Métodos principales**:
  - `toDTO(Pedido)` → Convierte entity a DTO
  - `toEntity(PedidoDTO)` → Convierte DTO a entity
  - `estadoEnumToString(PedidoEstado)` → "PENDIENTE" → "pendiente"
  - `stringToEstadoEnum(String)` → "pendiente" → PedidoEstado.PENDIENTE
- **Líneas**: ~120 líneas
- **Uso**: Llamado en cada endpoint que devuelve/recibe PedidoDTO

#### 3. `PedidoController.java`
- **Ubicación**: `realprint-backend/src/main/java/com/realprint/realprintbackend/controller/PedidoController.java`
- **Tipo**: REST Controller
- **Propósito**: Exponer operaciones CRUD de pedidos via HTTP
- **Base URL**: `/api/pedidos`
- **Endpoints**:
  - `GET /api/pedidos` (ADMIN only)
  - `GET /api/pedidos/{id}` (CLIENTE/ADMIN)
  - `POST /api/pedidos` (CLIENTE/ADMIN)
  - `PUT /api/pedidos/{id}` (CLIENTE/ADMIN)
  - `DELETE /api/pedidos/{id}` (ADMIN only)
- **Líneas**: ~130 líneas
- **Seguridad**: `@PreAuthorize` para autorización por rol
- **Mapeo**: Usa `PedidoMapper` para convertir Entity ↔ DTO

#### 4. `DataInitializer.java`
- **Ubicación**: `realprint-backend/src/main/java/com/realprint/realprintbackend/config/DataInitializer.java`
- **Tipo**: Configuration Bean con CommandLineRunner
- **Propósito**: Inicializar datos de prueba automaticamente al iniciar
- **Usuarios creados**:
  - admin/admin123 (Rol: ADMIN)
  - cliente1/cliente123 (Rol: CLIENTE)
- **Líneas**: ~65 líneas
- **Uso**: Se ejecuta automáticamente si la BD está vacía

#### 5. `GlobalExceptionHandler.java`
- **Ubicación**: `realprint-backend/src/main/java/com/realprint/realprintbackend/config/GlobalExceptionHandler.java`
- **Tipo**: @RestControllerAdvice
- **Propósito**: Manejo centralizado de excepciones en toda la app
- **Excepciones manejadas**:
  - `PedidoNoEncontradoException` → 404
  - `UnauthorizedException` → 401
  - `Exception` genérica → 500
- **Formato de respuesta**: `{status, message, error}`
- **Líneas**: ~75 líneas

---

### 🔧 ARCHIVOS MODIFICADOS (5)

#### 1. `Usuario.java`
- **Ubicación**: `realprint-backend/src/main/java/com/realprint/realprintbackend/entity/Usuario.java`
- **Cambios**:
  ```java
  // ANTES:
  public class Usuario {
      // constructores manuales
      // getters y setters manuales
  }
  
  // DESPUÉS:
  @Getter @Setter
  @NoArgsConstructor @AllArgsConstructor @Builder
  public class Usuario {
      // getters/setters generados por Lombok
      // builder generado por Lombok
  }
  ```
- **Líneas**: Reducidas de 120 → 58 líneas
- **Beneficio**: Código más limpio y menos propenso a errores
- **Impacto**: DataSeeder y DataInitializer ahora pueden usar `Usuario.builder()`

#### 2. `SecurityConfig.java`
- **Ubicación**: `realprint-backend/src/main/java/com/realprint/realprintbackend/config/SecurityConfig.java`
- **Cambios**: Añadidas reglas de autorización para rutas `/api/**`
  ```java
  // ANTES:
  .requestMatchers("/files/**").permitAll()
  .requestMatchers("/admin/**").hasRole("ADMIN")
  
  // DESPUÉS:
  .requestMatchers("/api/files/**", "/files/**").permitAll()
  .requestMatchers("/api/pedidos").hasRole("ADMIN")
  .requestMatchers("/api/**").authenticated()
  .requestMatchers("/admin/**").hasRole("ADMIN")
  ```
- **Líneas**: Aumentadas de 66 → 77 líneas
- **Beneficio**: Endpoints `/api/**` ahora están protegidos por JWT
- **Efecto**: Solicitudes sin token a `/api/pedidos` reciben 401 Unauthorized

#### 3. `application.properties`
- **Ubicación**: `realprint-backend/src/main/resources/application.properties`
- **Cambios**: Configuración completa desde cero
  ```
  ANTES:
  spring.application.name=realprint-backend
  
  DESPUÉS:
  spring.application.name=realprint-backend
  spring.datasource.url=jdbc:h2:mem:realprint
  spring.jpa.hibernate.ddl-auto=create-drop
  jwt.secret=tuClaveSecreta...
  jwt.expiration-ms=86400000
  cors.allowed-origins=http://localhost:5173
  file.upload.dir=${user.home}/realprint-uploads
  spring.servlet.multipart.max-file-size=10MB
  ```
- **Líneas**: Aumentadas de 2 → 42 líneas
- **Beneficio**: Configuración clara y mantenible centralizada

#### 4. `DataSeeder.java`
- **Ubicación**: `realprint-backend/src/main/java/com/realprint/realprintbackend/config/DataSeeder.java`
- **Cambios**: Constructor viejo → builder
  ```java
  // ANTES:
  Usuario admin = new Usuario(
      "admin",
      passwordEncoder.encode("admin123"),
      "Administrador",
      "admin@realprint.local",
      RolUsuario.ADMIN
  );
  
  // DESPUÉS:
  Usuario admin = Usuario.builder()
      .username("admin")
      .passwordHash(passwordEncoder.encode("admin123"))
      .nombre("Administrador")
      .email("admin@realprint.local")
      .rol(RolUsuario.ADMIN)
      .activo(true)
      .build();
  ```
- **Líneas**: Aumentadas de 42 → 57 líneas (más legible)
- **Beneficio**: Consistencia con nuevas anotaciones Lombok

#### 5. `FileControllerTest.java`
- **Ubicación**: `realprint-backend/src/test/java/.../FileControllerTest.java`
- **Cambios**: Dos instancias de Usuario actualizadas (líneas 103 y 124)
- **Líneas modificadas**: ~40 líneas en el test
- **Beneficio**: Tests continúan pasando con nueva estructura

---

## 🎯 RELACIONES ENTRE ARCHIVOS

```
┌─────────────────────────────────────────────────┐
│         Frontend (AdminPedidos.tsx)             │
│    Llama a: httpClient.get("/api/pedidos")     │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│   PedidoController.listarPedidos()              │
│   ├─ Llama: PedidoService.findAll()            │
│   ├─ Mapea: PedidoMapper.toDTO(each)           │
│   └─ Retorna: List<PedidoDTO> (JSON)           │
└────────────┬────────────────────────┬───────────┘
             │                        │
             ▼                        ▼
   ┌──────────────────┐    ┌─────────────────────┐
   │ PedidoService    │    │   PedidoMapper      │
   │                  │    │                     │
   │ ├─ findAll()     │    │ ├─ toDTO()          │
   │ ├─ findById()    │    │ ├─ toEntity()       │
   │ ├─ save()        │    │ ├─ estadoEnumTo...()│
   │ ├─ update()      │    │ └─ stringToEstado...│
   │ ├─ delete()      │    │                     │
   │ └─ findByEstado()│    └─────────────────────┘
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────┐
   │ PedidoRepository│
   │  ├─ findAll()   │
   │  ├─ findById()  │
   │  ├─ save()      │
   │  ├─ delete()    │
   │  └─ findByEstado│
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────┐
   │   BD (H2)        │
   │   Tabla: pedidos│
   │   Estado: ENUM  │
   └──────────────────┘
```

---

## 🔄 FLUJOS DE DATOS

### Flujo 1: GET /api/pedidos (Listar todos)
```
1. Frontend HTTP GET /api/pedidos + JWT token
2. SecurityConfig valida JWT
3. PedidoController.listarPedidos() se ejecuta
4. PedidoService.findAll() consulta BD
5. PedidoRepository.findAll() retorna List<Pedido>
6. PedidoMapper.toDTO() convierte cada:
   - PedidoEstado.PENDIENTE → "pendiente"
7. ResponseEntity<List<PedidoDTO>> se serializa a JSON
8. Frontend recibe JSON con estado minúscula
9. ESTADOS_PEDIDO["pendiente"] mapea correctamente
```

### Flujo 2: PUT /api/pedidos/{id} (Cambiar estado)
```
1. Frontend HTTP PUT /api/pedidos/1 + Body: {estado: "en_proceso"}
2. SecurityConfig valida JWT
3. PedidoController.actualizarPedido() recibe PedidoDTO
4. PedidoMapper.toEntity() convierte:
   - "en_proceso" → PedidoEstado.EN_PROCESO
5. PedidoService.update() actualiza en BD
6. BD: estado = "EN_PROCESO" (enum storage)
7. PedidoMapper.toDTO() convierte nuevamente:
   - PedidoEstado.EN_PROCESO → "en_proceso"
8. JSON response con estado="en_proceso"
9. Frontend actualiza UI correctamente
```

---

## 📊 MATRIZ DE RESPONSABILIDADES

| Componente | Responsabilidad | Ubicación |
|-----------|-----------------|-----------|
| **PedidoDTO** | Estructura de datos para transferencia | `/dto/PedidoDTO.java` |
| **PedidoMapper** | Conversión Pedido ↔ PedidoDTO | `/mapper/PedidoMapper.java` |
| **PedidoController** | Endpoints HTTP REST | `/controller/PedidoController.java` |
| **PedidoService** | Lógica de negocio | `/service/PedidoService.java` |
| **PedidoRepository** | Acceso a datos | `/repository/PedidoRepository.java` |
| **SecurityConfig** | Autenticación y autorización | `/config/SecurityConfig.java` |
| **JwtAuthenticationFilter** | Validación de tokens JWT | `/config/JwtAuthenticationFilter.java` |
| **GlobalExceptionHandler** | Manejo centralizado de errores | `/config/GlobalExceptionHandler.java` |
| **DataInitializer** | Bootstrap de datos | `/config/DataInitializer.java` |
| **Usuario** | Entidad de usuario | `/entity/Usuario.java` |
| **application.properties** | Configuración de ambiente | `/resources/application.properties` |

---

## ✅ CHECKLIST DE CAMBIOS

### Backend Java

- [x] Creado `PedidoDTO.java` con campo `estado: String`
- [x] Creado `PedidoMapper.java` con conversiones enum↔string
- [x] Creado `PedidoController.java` con 5 endpoints CRUD
- [x] Creado `DataInitializer.java` para usuarios de prueba
- [x] Creado `GlobalExceptionHandler.java` para manejo de errores
- [x] Actualizado `Usuario.java` con @Builder y Lombok
- [x] Actualizado `SecurityConfig.java` con reglas `/api/**`
- [x] Actualizado `application.properties` con config completa
- [x] Actualizado `DataSeeder.java` con nuevo constructor
- [x] Actualizado `FileControllerTest.java` con builder

### Compilación y Tests

- [x] `mvn clean compile -q` pasa sin errores
- [x] `mvn clean package -q` genera JAR correctamente
- [x] Todos los tests en `/src/test` pasan
- [x] Lombok procesa correctamente anotaciones

### Frontend Sincronización

- [x] Frontend espera `/api/pedidos` con JWT
- [x] Frontend recibe estado en minúsculas ("pendiente")
- [x] AdminPedidos.tsx mapea con ESTADOS_PEDIDO
- [x] Proxy Vite redirige `/api` → `http://localhost:8080/api`

### Seguridad

- [x] Endpoints `/api/**` requieren JWT
- [x] Solo ADMIN puede listar todos con GET /api/pedidos
- [x] CLIENTE puede ver su propio pedido con GET /api/pedidos/{id}
- [x] Cambio de estado requiere autenticación

---

## 🔍 VALIDACIÓN RÁPIDA

Para verificar que todo está correcto:

```bash
# 1. Compilar
cd realprint-backend
mvn clean package -q

# 2. Iniciar
java -jar target/realprint-backend-0.0.1-SNAPSHOT.jar

# 3. En otro terminal, probar
# POST /api/auth/login → obtener token
# GET /api/pedidos → con token
# Verificar que estado sea minúscula en JSON response
```

---

## 📝 NOTAS ESPECIALES

### Conversión Crítica (PedidoMapper)
El MapperES el PUNTO CLAVE de sincronización:
- Convierte del Backend (ENUM mayúsculas) al Frontend (String minúsculas)
- Invierte la conversión para receptores DENTRADA
- **Si falla aquí, falla toda la sincronización Frontend-Backend**

### Usuarios de Prueba
Disponibles automáticamente:
- `admin` / `admin123` (Rol ADMIN)
- `cliente1` / `cliente123` (Rol CLIENTE)

### Descargas de Archivos
- `/api/files/**` and `/files/**` permiten acceso sin autenticación (fallback)
- Usado para desarrollo/demo
- En producción, cambiar en `SecurityConfig.java`

---

## 🚀 PRÓXIMAS ACCIONES

1. **Verificar Backend compila** ✓
2. **Iniciar Backend en puerto 8080** → Ver guía de verificación
3. **Iniciar Frontend en puerto 5173** → Ir a AdminPedidos
4. **Probar CRUD de pedidos** → Ver flujos de datos
5. **Verificar sincronización de estados** → Ver arquitectura

---

Índice Completo v1.0  
Generado: 2026-04-28  
Archivos documentados: 5 nuevos + 5 modificados = 10 total

