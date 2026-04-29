# AUDITORÍA BACKEND REALPRINT - REPORTE COMPLETO

## 📋 ESTADO ACTUAL

### ✅ ESTRUCTURA CORRECTA

```
realprint-backend/src/main/java/com/realprint/realprintbackend/
├── RealprintBackendApplication.java        ✅ OK
├── entity/                                 ✅ OK (4 archivos)
│   ├── RolUsuario.java                    ✅ Enum roles
│   ├── Usuario.java                       ✅ Entity con @Builder
│   ├── PedidoEstado.java                  ✅ Enum estados
│   └── Pedido.java                        ✅ Entity principal
├── dto/                                    ✅ OK (3 archivos)
│   ├── LoginRequest.java                  ✅ Input
│   ├── LoginResponse.java                 ✅ Output auth
│   └── PedidoDTO.java                     ✅ DTO pedidos
├── controller/                             ⚠️ REVISAR (4 archivos)
│   ├── AuthController.java                ✅ OK
│   ├── PedidoController.java              ✅ OK
│   ├── FileController.java                ✅ OK
│   └── TestSecurityController.java        ❌ INNECESARIO
├── service/                                ✅ OK (4 archivos)
│   ├── AuthService.java                   ✅ OK
│   ├── CustomUserDetailsService.java      ✅ OK
│   ├── PedidoService.java                 ✅ OK
│   └── FileStorageService.java            ✅ OK
├── repository/                             ✅ OK (2 archivos)
│   ├── UsuarioRepository.java             ✅ OK
│   └── PedidoRepository.java              ✅ OK
├── mapper/                                 ✅ OK (1 archivo)
│   └── PedidoMapper.java                  ✅ OK
├── config/                                 ⚠️ REVISAR (7 archivos)
│   ├── CorsConfig.java                    ✅ OK
│   ├── SecurityConfig.java                ✅ OK
│   ├── JwtService.java                    ✅ OK
│   ├── JwtAuthenticationFilter.java       ✅ OK
│   ├── GlobalExceptionHandler.java        ✅ OK
│   ├── DataSeeder.java                    ⚠️ DUPLICADO
│   └── DataInitializer.java               ⚠️ DUPLICADO
└── exception/                              ✅ OK (2 archivos)
    ├── UnauthorizedException.java         ✅ OK
    └── PedidoNoEncontradoException.java   ✅ OK
```

---

## 🔴 PROBLEMAS IDENTIFICADOS

### 1. **TestSecurityController - INNECESARIO**
**Archivo**: `controller/TestSecurityController.java`  
**Razón**: Solo contiene endpoints de prueba sin utilidad en producción
**Endpoints**:
- GET `/admin/ping` → "OK admin"
- GET `/cliente/ping` → "OK cliente"

**Acción**: ❌ ELIMINAR

---

### 2. **DataSeeder vs DataInitializer - DUPLICADO**
**Archivos**: 
- `config/DataSeeder.java` (43 líneas)
- `config/DataInitializer.java` (69 líneas)

**Diferencias**:
| Aspecto | DataSeeder | DataInitializer |
|--------|-----------|-----------------|
| Usuarios creados | Solo admin | admin + cliente1 |
| Verificación | Comprueba si admin existe | Comprueba si BD tiene usuarios |
| Enfoque | Mínimo | Más completo |
| Status | ⚠️ Duplicado | ⚠️ Duplicado |

**Acción**: 🔧 CONSOLIDAR → Mantener solo DataInitializer (más completo), ELIMINAR DataSeeder

---

### 3. **FALTA: UsuarioDTO**
**Razón**: Usuario es Entity que se expone pero no tiene DTO correspondiente

**Casos de uso**:
- GET `/api/usuarios` → debería devolver List<UsuarioDTO>
- GET `/api/usuarios/{id}` → debería devolver UsuarioDTO
- Frontend necesita datos de usuario sin exponer password hash

**Acción**: ✅ CREAR `UsuarioDTO.java`

---

### 4. **FALTA: UsuarioController**
**Razón**: No hay endpoint REST para gestionar usuarios (listar, ver detalles, etc.)

**Endpoints necesarios**:
- GET `/api/usuarios` (ADMIN only) - Listar todos
- GET `/api/usuarios/{id}` (ADMIN o self) - Ver detalles
- POST `/api/usuarios` (ADMIN) - Crear usuario
- PUT `/api/usuarios/{id}` (ADMIN o self) - Actualizar
- DELETE `/api/usuarios/{id}` (ADMIN) - Eliminar

**Acción**: ✅ CREAR `UsuarioController.java`

---

### 5. **FALTA: UsuarioMapper**
**Razón**: Sin mapper, no hay conversión automática Usuario → UsuarioDTO

**Métodos necesarios**: 
- `toDTO(Usuario)` → Usuario entity → UsuarioDTO
- `toEntity(UsuarioDTO)` → UsuarioDTO → Usuario entity

**Acción**: ✅ CREAR `UsuarioMapper.java`

---

### 6. **FALTA: UsuarioService**
**Razón**: No hay capa de servicio para operaciones de usuario (aparte de auth)

**Métodos necesarios**:
- `findAll()` - Listar usuarios
- `findById(Long)` - Obtener usuario
- `save(Usuario)` - Crear usuario
- `update(Long, Usuario)` - Actualizar
- `delete(Long)` - Eliminar

**Acción**: ✅ CREAR `UsuarioService.java`

---

## ✅ RECOMENDACIONES DE CAMBIOS

### Cambios Inmediatos (Críticos)

| # | Acción | Archivo | Prioridad |
|---|--------|---------|-----------|
| 1 | ❌ Eliminar | `TestSecurityController.java` | 🔴 ALTA |
| 2 | ❌ Eliminar | `DataSeeder.java` | 🔴 ALTA |
| 3 | ✅ Crear | `UsuarioDTO.java` | 🔴 ALTA |
| 4 | ✅ Crear | `UsuarioMapper.java` | 🟡 MEDIA |
| 5 | ✅ Crear | `UsuarioService.java` | 🟡 MEDIA |
| 6 | ✅ Crear | `UsuarioController.java` | 🟡 MEDIA |

---

## 📊 ANÁLISIS DE DEPENDENCIAS

### TestSecurityController
```
Usado por:
  - Ningún archivo lo referencia
  - No es necesario en producción
  - Puede removerse sin romper nada

Depende de:
  - Spring Security (trivial)
```

### DataSeeder
```
Usado por:
  - Spring Boot auto-detecta @Configuration
  - Comparte función con DataInitializer

Conflicto:
  - DataInitializer hace lo mismo pero mejor
  - Ambos crean CommandLineRunner beans
  - ADVERTENCIA: Pueden ejecutarse ambos, causando duplicación
```

### Necesidad de UsuarioDTO
```
Seria necesitada por:
  - UsuarioController (nuevo)
  - UsuarioService (nuevo)
  - Frontend cuando consume endpoints de usuario
  - LoginResponse ya usa una estructura anidada similar

Beneficio:
  - Esconder datos sensibles (passwordHash)
  - Control sobre qué campos se exponen
  - Sincronización con Frontend
```

---

## 🏗️ DIAGRAMA DE CAMBIOS

```
ANTES (Actual)
==============

realprint-backend/
├── entity/
│   └── Usuario
├── dto/
│   ├── LoginRequest
│   └── LoginResponse     ← Parcialidad de Usuario
├── controller/
│   ├── AuthController    ← Usa Usuario parcialmente
│   └── TestSecurityController ❌ NO USADO
├── service/
│   └── AuthService
├── config/
│   ├── DataSeeder ⚠️ DUPLICADO
│   └── DataInitializer ⚠️ DUPLICADO
└── repository/
    └── UsuarioRepository


DESPUÉS (Final)
===============

realprint-backend/
├── entity/
│   └── Usuario
├── dto/
│   ├── LoginRequest
│   ├── LoginResponse
│   └── UsuarioDTO ✅ NUEVO
├── controller/
│   ├── AuthController
│   ├── UsuarioController ✅ NUEVO
│   └── PedidoController
├── service/
│   ├── AuthService
│   ├── UsuarioService ✅ NUEVO
│   ├── PedidoService
│   └── CustomUserDetailsService
├── mapper/
│   ├── PedidoMapper
│   └── UsuarioMapper ✅ NUEVO
├── config/
│   ├── CorsConfig
│   ├── SecurityConfig
│   ├── JwtService
│   ├── JwtAuthenticationFilter
│   ├── GlobalExceptionHandler
│   └── DataInitializer (único)
└── repository/
    ├── UsuarioRepository
    ├── PedidoRepository
    └── sin cambios
```

---

## 📝 DETALLES DE IMPLEMENTACIÓN

### UsuarioDTO (Crear)
```java
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UsuarioDTO {
    private Long id;
    private String username;        ← Sin passwordHash
    private String nombre;
    private String email;
    private String rolle;           ← minúscula para JSON
    private boolean activo;
    // NO INCLUIR: passwordHash
}
```

### UsuarioMapper (Crear)
```java
public class UsuarioMapper {
    public static UsuarioDTO toDTO(Usuario usuario) {
        return UsuarioDTO.builder()
            .id(usuario.getId())
            .username(usuario.getUsername())
            .nombre(usuario.getNombre())
            .email(usuario.getEmail())
            .role(usuario.getRol().name().toLowerCase())
            .activo(usuario.isActivo())
            .build();
    }
    
    public static Usuario toEntity(UsuarioDTO dto) {
        return Usuario.builder()
            .id(dto.getId())
            .username(dto.getUsername())
            .nombre(dto.getNombre())
            .email(dto.getEmail())
            .rol(RolUsuario.valueOf(dto.getRole().toUpperCase()))
            .activo(dto.isActivo())
            .build();
    }
}
```

### UsuarioService (Crear)
```java
@Service @RequiredArgsConstructor @Transactional
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    
    public List<Usuario> findAll() { ... }
    
    public Usuario findById(Long id) { 
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new PedidoNoEncontradoException(...));
    }
    
    public Usuario save(Usuario usuario) { 
        return usuarioRepository.save(usuario);
    }
    
    public Usuario update(Long id, Usuario usuario) { ... }
    
    public void delete(Long id) { ... }
}
```

### UsuarioController (Crear)
```java
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioDTO>> listar() { ... }
    
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtener(@PathVariable Long id) { ... }
    
    // Otros endpoints...
}
```

---

## ⚠️ IMPACTO DE CAMBIOS

### Archivos que necesitan actualizar imports
- `AuthController.java` (usa Usuario)
- Nada de controllers (UsuarioController es nuevo)

### Frontend Impact
- NO hay impacto (endpoints nuevos, compatibles hacia atrás)

### Tests
- FileControllerTest.java (usa Usuario)
- Posiblemente agregar UsuarioControllerTest.java

---

## 🧪 PLAN DE VALIDACIÓN POST-CAMBIOS

1. **Compilación**
   ```bash
   mvn clean compile -q
   ```
   Debe pasar sin errores

2. **Tests**
   ```bash
   mvn test -q
   ```
   Todos los tests deben pasar

3. **Endpoints**
   - GET /api/usuarios (ADMIN) → devuelve List<UsuarioDTO>
   - GET /api/usuarios/1 → devuelve UsuarioDTO con role minúscula
   - POST /auth/login → sigue funcionando igual

4. **Seguridad**
   - /api/usuarios requiere JWT ✓
   - Sin token → 401 ✓
   - Rol incorrecto → 403 ✓

---

Auditoría v1.0  
Generado: 2026-04-28  
Estado: Listo para implementación

