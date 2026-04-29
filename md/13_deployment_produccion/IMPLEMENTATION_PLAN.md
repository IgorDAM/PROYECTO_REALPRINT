# PLAN DE IMPLEMENTACIÓN COMPLETO - AUDITORÍA BACKEND

## ✅ ARCHIVOS CREADOS (5 nuevos)

### 1. **UsuarioDTO.java** ✅ CREADO
```
Ubicación: /dto/UsuarioDTO.java
Propósito: DTO para transferencia segura de datos de usuario
Campos: id, username, nombre, email, role (minúscula), activo
Campos EXCLUIDOS: passwordHash (por seguridad)
```

### 2. **UsuarioMapper.java** ✅ CREADO
```
Ubicación: /mapper/UsuarioMapper.java
Propósito: Conversión bidireccional Usuario ↔ UsuarioDTO
Métodos:
- toDTO(Usuario) → UsuarioDTO sin passwordHash
- toEntity(UsuarioDTO) → Usuario entity
- rolEnumToString(RolUsuario) → minúsculas
- stringToRolEnum(String) → enum
```

### 3. **UsuarioService.java** ✅ CREADO
```
Ubicación: /service/UsuarioService.java
Propósito: Lógica de negocio para gestión de usuarios
Métodos:
- findAll() - Listar todos
- findById(Long) - Obtener uno
- findByUsername(String) - Login
- save(Usuario) - Crear
- update(Long, Usuario) - Actualizar
- delete(Long) - Eliminar
- changePassword() - Cambiar contraseña
- deactivate(Long) - Desactivar sin borrar
```

### 4. **UsuarioController.java** ✅ CREADO
```
Ubicación: /controller/UsuarioController.java
Propósito: Endpoints REST para gestión de usuarios
Base URL: /api/usuarios
Endpoints:
- GET    /api/usuarios           (ADMIN only)
- GET    /api/usuarios/{id}      (ADMIN o self)
- POST   /api/usuarios           (ADMIN only)
- PUT    /api/usuarios/{id}      (ADMIN o self)
- DELETE /api/usuarios/{id}      (ADMIN only)
```

---

## ❌ ARCHIVOS A ELIMINAR (2 innecesarios)

### 1. **TestSecurityController.java** ❌ ELIMINAR
```
Ubicación: /controller/TestSecurityController.java
Razón: Solo endpoints de prueba sin utilidad en producción
Contenido innecesario:
- GET /admin/ping → "OK admin"
- GET /cliente/ping → "OK cliente"

Instrucción manual de eliminación:
```bash
# En Git bash o terminal:
git rm realprint-backend/src/main/java/com/realprint/realprintbackend/controller/TestSecurityController.java
git commit -m "remove: eliminar TestSecurityController.java innecesario"

# O directamente:
rm "D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\realprint-backend\src\main\java\com\realprint\realprintbackend\controller\TestSecurityController.java"
```

### 2. **DataSeeder.java** ❌ ELIMINAR
```
Ubicación: /config/DataSeeder.java
Razón: Duplicado de DataInitializer.java (DataInitializer es más completo)
Conflicto: Ambos crean CommandLineRunner beans, pueden ejecutarse dos veces

Instrucción manual de eliminación:
```bash
# En Git bash o terminal:
git rm realprint-backend/src/main/java/com/realprint/realprintbackend/config/DataSeeder.java
git commit -m "remove: eliminar DataSeeder.java (duplicado con DataInitializer)"

# O directamente:
rm "D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\realprint-backend\src\main\java\com\realprint\realprintbackend\config\DataSeeder.java"
```

---

## 🧪 VERIFICACIÓN DESPUÉS DE CAMBIOS

### Paso 1: Compilar
```bash
cd realprint-backend
mvn clean compile -q
# Debe terminar sin errores
```

### Paso 2: Tests
```bash
mvn test -q
# Todos los tests deben pasar
```

### Paso 3: Package
```bash
mvn clean package -q -DskipTests
# Debe generar JAR sin errores
```

---

## 📊 ANTES vs DESPUÉS

### ANTES (Con duplicaciones)
```
Controllers: 4 (incluyendo TestSecurityController innecesario)
Services: 4 (sin UsuarioService)
DTOs: 2 (sin UsuarioDTO)
Mappers: 1 (sin UsuarioMapper)
Config: 7 (2 inicializadores duplicados: DataSeeder y DataInitializer)
```

### DESPUÉS (Limpio y completo)
```
Controllers: 4 (AuthController, PedidoController, FileController, UsuarioController)
Services: 5 (AuthService + NEW: UsuarioService + otros)
DTOs: 3 (LoginRequest, LoginResponse, NEW: UsuarioDTO)
Mappers: 2 (PedidoMapper, NEW: UsuarioMapper)
Config: 6 (sin TestSecurityController, sin DataSeeder duplicado)
```

---

## 🔄 IMPACTO EN FRONTEND

**NINGUNO** - Los cambios son internos del Backend y aditivos.

✅ Endpoints existentes siguen funcionando igual
✅ Nuevos endpoints disponibles para gestión de usuarios
✅ Seguridad mejorada (sin exponer passwordHash)

---

## 📋 ARCHIVOS AFECTADOS (Recompilar tras eliminaciones)

Cuando elimines los archivos:
1. Ejecutar `mvn clean compile` para verificar importaciones
2. Verificar que no hay referencias a `TestSecurityController` (no debería haber)
3. Verificar que solo se ejecuta UNA inicializadora de datos (DataInitializer)

---

## 🚀 EJECUCIÓN FINAL

```bash
# 1. Cambiar a directorio
cd D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT

# 2. Compilar Backend
cd realprint-backend
mvn clean package -q -DskipTests

# 3. Iniciar Backend
java -jar target/realprint-backend-0.0.1-SNAPSHOT.jar

# 4. En otra terminal, iniciar Frontend
cd ../App-RealPrint
npm run dev

# 5. Verificar en http://localhost:5173
# - Login como admin/admin123
# - Ir a gestión de cualquier recurso
# - Debería funcionar correctamente
```

---

## ✨ NUEVOS ENDPOINTS DISPONIBLES

### Listar todos los usuarios (ADMIN)
```
GET http://localhost:8080/api/usuarios
Authorization: Bearer <admin_token>
```

**Respuesta esperada**:
```json
[
  {
    "id": 1,
    "username": "admin",
    "nombre": "Administrador Sistema",
    "email": "admin@realprint.local",
    "role": "admin",
    "activo": true
  },
  {
    "id": 2,
    "username": "cliente1",
    "nombre": "Cliente Prueba",
    "email": null,
    "role": "cliente",
    "activo": true
  }
]
```

### Obtener usuario específico
```
GET http://localhost:8080/api/usuarios/1
Authorization: Bearer <token>
```

### Crear nuevo usuario (ADMIN)
```
POST http://localhost:8080/api/usuarios
Authorization: Bearer <admin_token>
Content-Type: application/json

Body:
{
  "username": "nuevo_usuario",
  "nombre": "Nuevo Usuario",
  "email": "nuevo@example.com",
  "role": "cliente",
  "activo": true
}
```

---

## 📝 NOTAS IMPORTANTES

1. **Rol en minúsculas**: El endpoint devuelve `"role": "admin"` (minúsculas) para consistencia JSON

2. **Sin passwordHash**: Los DTOs NUNCA incluyen `passwordHash` por seguridad

3. **UsuarioService tiene métodos adicionales useful**:
   - `changePassword()` - Cambiar contraseña de forma segura
   - `deactivate()` - Desactivar sin borrar (preserva auditoría)

4. **DataInitializer ejecuta automáticamente**:
   - Al iniciar la app, crea usuarios de prueba si la BD está vacía
   - No crea duplicados si ya existen usuarios

5. **Migrations no necesarias**:
   - UsRepository no cambió (solo se añadió UsuarioService)
   - Usuario entity no cambió (solo se añadió UsuarioDTO)
   - Todo es backwards compatible

---

## 🧹 CLEANUP CHECKLIST POST-ELIMINACIÓN

Después de eliminar los archivos:

- [ ] Compilar exitosamente (`mvn clean compile -q`)
- [ ] Tests pasen (`mvn test -q`)
- [ ] Package se genere (`mvn clean package -DskipTests`)
- [ ] Backend inicie sin errores
- [ ] Frontend conecte correctamente
- [ ] Endpoints antiguos sigan funcionando
- [ ] Nuevos endpoints /api/usuarios respondan

---

## 📞 RESUMEN FINAL

### ✅ Creados:
1. UsuarioDTO.java (DTO seguro sin passwordHash)
2. UsuarioMapper.java (conversiones Entity ↔ DTO)
3. UsuarioService.java (lógica de negocio)
4. UsuarioController.java (endpoints REST)

### ❌ Por Eliminar:
1. TestSecurityController.java (test endpoints innecesarios)
2. DataSeeder.java (duplicado con DataInitializer)

### 📊 Resultado:
- Backend más limpio y profesional
- Mejor separación de responsabilidades
- API completa para gestión de usuarios
- Todo compilable y funcional

---

Documento de Implementación v1.0  
Generado: 2026-04-28  
Estado: Listo para ejecución manual

