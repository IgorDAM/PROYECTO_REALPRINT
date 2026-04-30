# VERIFICACIÓN DE ALINEACIÓN BACKEND-FRONTEND

## ✅ CHECKLIST DE VALIDACIÓN

### Paso 1: Compilación Backend
```powershell
cd realprint-backend
mvn clean package -q
```
**Resultado esperado**: `BUILD SUCCESS` sin errores ✓

---

### Paso 2: Iniciar Backend en Puerto 8080
```powershell
# Opción A: JAR directo
java -jar target/realprint-backend-0.0.1-SNAPSHOT.jar --server.port=8080

# Opción B: Maven
mvn spring-boot:run
```

**Señales de éxito**:
```
Tomcat started on port 8080 (http)
Usuarios de prueba creados exitosamente:
  - admin / admin123
  - cliente1 / cliente123
```

---

### Paso 3: Verificar Usuarios Iniciales
**URL**: `http://localhost:8080/h2-console`
- Usuario: `sa`
- Contraseña: (vacío)
- Driver: `org.h2.Driver`
- URL JDBC: `jdbc:h2:mem:realprint`

**Tabla `usuarios` debe contener**:
| id | username | nombre | rol |
|----|----------|--------|-----|
| 1  | admin    | Administrador Sistema | ADMIN |
| 2  | cliente1 | Cliente Prueba | CLIENTE |

---

### Paso 4: Probar Autenticación (Login)
```powershell
# Crear JSON payload
$payload = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

# Enviar POST
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $payload

$response.Content | ConvertFrom-Json | Format-List
```

**Resultado esperado**:
```json
{
  "token": "eyJhbGc...[JWT token]...vQ",
  "user": {
    "id": 1,
    "username": "admin",
    "name": "Administrador Sistema",
    "role": "admin"
  }
}
```

**✓ Guardar el token para pruebas posteriores**

---

### Paso 5: Probar Endpoint GET /api/pedidos
```powershell
$token = "eyJhbGc...[token obtenido anterior]...vQ"

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/pedidos" `
    -Method GET `
    -Headers @{"Authorization" = "Bearer $token"} `
    -ContentType "application/json"

$response.Content | ConvertFrom-Json | Format-List
```

**Resultado esperado**:
- Array vacío (sin pedidos): `[]`
- O si hay pedidos, array con estructura correcta

**Verificar que cada pedido tiene**:
```json
{
  "id": 1,
  "clienteId": 1,
  "clienteNombre": "Admin",
  "estado": "pendiente",         ← ¡MINÚSCULAS!
  "fecha": "2026-04-28",
  "total": 99.99,
  "fileUrlsJson": null,
  ...
}
```

---

### Paso 6: Crear Pedido de Prueba
```powershell
$token = "eyJhbGc...[token]...vQ"

$newPedido = @{
    clienteId = 1
    clienteNombre = "Admin"
    servicio = "serigrafia"
    descripcion = "Pedido de prueba"
    cantidad = 10
    estado = "pendiente"
    total = 150.00
    fecha = "2026-04-28"
    fechaEntrega = "2026-05-05"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/pedidos" `
    -Method POST `
    -Headers @{"Authorization" = "Bearer $token"} `
    -ContentType "application/json" `
    -Body $newPedido

$response.Content | ConvertFrom-Json | Format-List
```

**Resultado esperado**:
```json
{
  "id": 1,  ← ID autogenerado
  "clienteId": 1,
  "estado": "pendiente",  ← minúsculas
  "total": 150.00
  ...
}
```

---

### Paso 7: Cambiar Estado de Pedido
```powershell
$token = "eyJhbGc...[token]...vQ"

$updatePayload = @{
    estado = "en_proceso"  ← cambiar a en_proceso
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/pedidos/1" `
    -Method PUT `
    -Headers @{"Authorization" = "Bearer $token"} `
    -ContentType "application/json" `
    -Body $updatePayload

$response.Content | ConvertFrom-Json | Format-List
```

**Verificar que respuesta contiene**:
```json
{
  "id": 1,
  "estado": "en_proceso",  ← cambió correctamente
  ...
}
```

---

### Paso 8: Probar Seguridad (Acceso sin Token)
```powershell
# SIN token → debe fallar
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/pedidos" `
    -Method GET `
    -ErrorAction SilentlyContinue

# Debería devolver 401 Unauthorized
```

**Resultado esperado**: `HTTP 401 Unauthorized`

---

### Paso 9: Iniciar Frontend y Verificar Integración
```powershell
cd App-RealPrint
npm run dev
```

**Instancia Frontend**: `http://localhost:5173`

**Pruebas en Frontend**:

1. ✅ **Login**
   - Usuario: admin
   - Contraseña: admin123
   - Resultado: Debe mostrar dashboard

2. ✅ **Ir a Gestión de Pedidos**
   - URL: `/admin/pedidos`
   - Debe cargar lista de pedidos desde `/api/pedidos`
   - Estados deben mostrar correctamente:
     - "Pendiente" (label)
     - "En Proceso" (label)
     - Etc.

3. ✅ **Crear Nuevo Pedido**
   - Ir a nuevo servicio
   - Completar formulario
   - Submit
   - Debe hacerse POST a `/api/pedidos`

4. ✅ **Ver Detalles de Pedido**
   - Click en "Ver" en una fila
   - Modal debe mostrar todos los datos
   - Estados disponibles en botones

5. ✅ **Cambiar Estado**
   - Click en botón de estado diferente
   - Debe hacer PUT a `/api/pedidos/{id}`
   - Debe actualizar sin recargar

6. ✅ **Cargar Archivo**
   - En formulario de pedido, subir archivo
   - POST a `/api/upload`
   - Debe guardarse en `fileUrlsJson`

---

## 🔍 VALIDACIÓN DE SINCRONIZACIÓN

### Enumeración de Estados

**Backend Enum** (`PedidoEstado.java`):
```java
PENDIENTE       // Java enum
EN_PROCESO
COMPLETADO
ENVIADO
CANCELADO
```

**Frontend Constant** (`uiContracts.ts`):
```typescript
pendiente,      // string JSON (minúsculas)
en_proceso,
completado,
enviado,
cancelado
```

**Mapper Convierte**:
```
PedidoEstado.PENDIENTE  ←→  "pendiente"
PedidoEstado.EN_PROCESO ←→  "en_proceso"
etc.
```

**✓ VALIDAR**: Al listar `/api/pedidos`, cada `estado` debe ser minúscula:
```
❌ {"estado": "PENDIENTE"}     ← MALO
❌ {"estado": "Pendiente"}     ← MALO
✓ {"estado": "pendiente"}      ← CORRECTO
```

---

## 🐛 TROUBLESHOOTING

### Error: `HTTP 404` en `/api/pedidos`
**Causa**: Endpoint no está registrado correctamente  
**Solución**: 
- Verificar que `PedidoController.java` existe
- Verificar anotaciones `@RestController` y `@RequestMapping("/api/pedidos")`
- Reiniciar backend

### Error: `HTTP 401` sin token
**Causa**: JWT está activo y requiere token  
**Solución**:
- Hacer login primero para obtener token
- Incluir token en header: `Authorization: Bearer <token>`

### Error: `HTTP 403` con token de cliente
**Causa**: Intentando acceder a endpoint solo para ADMIN  
**Solución**:
- Para `/api/pedidos` (listar todos), necesitas rol ADMIN
- Cliente puede acceder a `/api/pedidos/{id}` específico

### Estados muestran en MAYÚSCULAS
**Causa**: Mapper no está convertiendo estados a minúsculas  
**Solución**:
- Verificar que se usa `PedidoMapper.toDTO(pedido)` antes de serializar a JSON
- Verificar que el campo `estado` en `PedidoDTO` es de tipo `String`

### Archivo no compila
**Causa**: Lombok no está procesando correctamente  
**Solución**:
```bash
# Limpiar y recompilar
mvn clean compile -q

# O reconstruir proyecto en IDE
# En IntelliJ: Build → Rebuild Project
```

---

## 📊 MATRIZ DE VERIFICACIÓN FINAL

| Componente | Prueba | Resultado |
|-----------|--------|-----------|
| Backend compila | `mvn clean package` | ✓ Sin errores |
| Backend inicia | `java -jar ...` | ✓ Puerto 8080 escuchando |
| Login funciona | POST `/api/auth/login` | ✓ Devuelve token |
| Listar pedidos | GET `/api/pedidos` (ADMIN) | ✓ Array JSON |
| Estados minúsculas | Verificar JSON | ✓ `"pendiente"` no `"PENDIENTE"` |
| Crear pedido | POST `/api/pedidos` | ✓ ID autogenerado |
| Actualizar estado | PUT `/api/pedidos/{id}` | ✓ Cambia estado |
| Eliminar pedido | DELETE `/api/pedidos/{id}` (ADMIN) | ✓ 204 No Content |
| Seguridad JWT | GET sin token | ✓ 401 Unauthorized |
| Frontend integrado | Gestión de Pedidos | ✓ Carga desde `/api/pedidos` |
| Mapper funciona | Estados en UI | ✓ Labels correctas (ej: "Pendiente") |

**✅ LISTA DE CONTROL**: Cuando todos los ✓ sean verdes, la sincronización es correcta.

---

## 🎯 VALIDACIÓN RÁPIDA (5 minutos)

```powershell
# Terminal 1: Backend
cd realprint-backend
mvn spring-boot:run

# Terminal 2: TEST
Start-Sleep -Seconds 5
$token = (Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"username":"admin","password":"admin123"}').Content | ConvertFrom-Json | Select -ExpandProperty token

$pedidos = (Invoke-WebRequest -Uri "http://localhost:8080/api/pedidos" `
    -Method GET `
    -Headers @{"Authorization" = "Bearer $token"} `
    -ContentType "application/json").Content | ConvertFrom-Json

Write-Host "✓ Pedidos cargados: $($pedidos.Length) items"
Write-Host "✓ Estructura: $($pedidos[0] | ConvertTo-Json | Select-String 'estado')" -ForegroundColor Green
```

---

Documento de Verificación v1.0  
Generado: 2026-04-28

