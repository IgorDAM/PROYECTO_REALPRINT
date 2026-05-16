# 📮 Colección Postman - RealPrint API

Colección completa de **16 endpoints** para probar la API REST de RealPrint de forma local o automatizada.

## 📋 Contenido

- **RealPrint.postman_collection.json**: Colección con todos los endpoints
- **RealPrint.postman_environment.json**: Variables de entorno (base_url, credentials, tokens)

## 🚀 Inicio Rápido (Postman Desktop)

### 1. Importar la colección y environment

En Postman:
- **File → Import** → selecciona `RealPrint.postman_collection.json` (SIN ESPACIOS)
- **File → Import** → selecciona `RealPrint.postman_environment.json`

### 2. Seleccionar el environment

En la esquina superior derecha de Postman, despliega el selector de environments y elige **"RealPrint Local"**.

### 3. Verificar variables

Click en el ojo → **Environment** → verifica:
- `base_url` = `http://localhost:8080/api` ✅
- `username` = `admin`
- `password` = `admin123`
- `authToken` = (vacío — se llena tras ejecutar Login)

### 4. Flujo de prueba recomendado

**Orden de ejecución:**

1. **Login** (Autenticación folder)
   - Ejecuta `POST /auth/login`
   - El script de Tests guardará automáticamente el token en `{{authToken}}`
   - Todos los siguientes requests lo usarán en el header `Authorization: Bearer {{authToken}}`

2. **Usuarios** (Usuarios folder)
   - `GET /usuarios` — listar todos (requiere rol ADMIN)
   - `GET /usuarios/{id}` — obtener uno específico
   - `POST /usuarios` — crear nuevo usuario
   - `PUT /usuarios/{id}` — actualizar
   - `PUT /usuarios/{id}/cambiar-password` — cambiar contraseña (ADMIN o self)
   - `DELETE /usuarios/{id}` — eliminar

3. **Pedidos** (Pedidos folder)
   - `GET /pedidos` — listar todos (ADMIN)
   - `GET /pedidos/mis-pedidos` — listar mis pedidos (CLIENTE)
   - `GET /pedidos/{id}` — obtener uno
   - `POST /pedidos` — crear nuevo (requiere rol CLIENTE)
   - `PUT /pedidos/{id}` — actualizar estado/precio
   - `DELETE /pedidos/{id}` — eliminar
   - `POST /pedidos/{pedidoId}/archivos` — agregar archivo a pedido (CLIENTE)

4. **Archivos** (Archivos folder)
   - `POST /files` — subir file (form-data, requiere rol CLIENTE)
   - `GET /files/{fileName}` — descargar archivo (requiere rol ADMIN)

## 🔧 Usarios de Prueba

| Username | Password | Rol |
|----------|----------|-----|
| `admin` | `admin123` | ADMIN |
| `cliente1` | `cliente123` | CLIENTE |

## 🤖 Ejecución Automatizada con Newman

### Instalar Newman

```powershell
npm install -g newman
```

### Ejecutar la colección

```powershell
cd docs/postman
newman run RealPrint.postman_collection.json -e RealPrint.postman_environment.json --delay-request 200
```

### Generar reportes

```powershell
newman run RealPrint.postman_collection.json -e RealPrint.postman_environment.json \
  --reporters cli,junit,html \
  --reporter-junit-export newman-results.xml \
  --reporter-html-export newman-report.html
```

**Reportes generados:**
- `newman-results.xml` — formato JUnit (para CI/CD)
- `newman-report.html` — reporte visual interactivo

## 🔑 Variantes de Ambiente

### Local Development
```json
{
  "base_url": "http://localhost:8080/api",
  "username": "admin",
  "password": "admin123"
}
```

### Staging / Producción
```json
{
  "base_url": "https://api.realprint.example.com",
  "username": "your_username",
  "password": "your_password"
}
```

Crea un nuevo environment en Postman con estos valores y cambia según necesites.

## ⚠️ Notas Importantes

### Headers automáticos
- El `Authorization: Bearer {{authToken}}` está configurado a nivel de colección
- Después de ejecutar **Login**, se ha guardado el token automáticamente
- **Todos los endpoints** posteriores ya lo incluyen

### Validación de roles
- ✅ `GET /usuarios` — ADMIN only → Cliente obtiene 403
- ✅ `POST /pedidos` — CLIENTE only → Admin obtiene 403
- ✅ `POST /files` — CLIENTE only → Admin obtiene 403
- ✅ `GET /files/{fileName}` — ADMIN only → Cliente obtiene 403

### Upload de archivos
- En el request `POST /files`, selecciona tu archivo en el campo `file` (tipo file)
- Formatos permitidos: PDF, JPG, PNG
- Tamaño máximo: 10 MB

### Manejo de IDs
- `{{usuario_id}}` y `{{pedido_id}}` son variables
- Cambia sus valores en el environment según los IDs que obtengas de GET requests
- O copia la URL completa: `{{base_url}}/usuarios/2` en lugar de `{{base_url}}/usuarios/{{usuario_id}}`

### Paginación
Los endpoints de listado soportan paginación mediante query parameters:
- `page` — número de página (default: 0)
- `size` — elementos por página (default: 20)
- `sort` — campo y dirección (formato: `campo,asc|desc`, default: `id,desc`)

**Ejemplos:**
```
GET {{base_url}}/pedidos?page=0&size=10&sort=fechaCreacion,desc
GET {{base_url}}/usuarios?page=1&size=5&sort=username,asc
```

**Respuesta paginada:**
```json
{
  "content": [...],
  "totalElements": 42,
  "totalPages": 5,
  "size": 10,
  "number": 0,
  "first": true,
  "last": false
}
```

### Validación de datos
Todos los endpoints POST/PUT validan datos con Bean Validation:
- Respuesta HTTP **400 Bad Request** en caso de error
- Body detallado con campos inválidos:
```json
{
  "error": "Validation failed",
  "status": 400,
  "code": "VALIDATION_ERROR",
  "errors": {
    "username": "El username es obligatorio",
    "email": "Email inválido"
  }
}
```

### Rate limiting en login
El endpoint `/auth/login` tiene protección contra fuerza bruta:
- Máximo **5 intentos** por username en **5 minutos**
- Después de 5 intentos fallidos, bloqueo temporal
- Respuesta HTTP **401** con mensaje: "Demasiados intentos de login. Intenta de nuevo en 5 minutos"

## 🐛 Troubleshooting

### "401 Unauthorized"
→ El token expiró o no se guardó correctamente. Ejecuta **Login** de nuevo.

### "403 Forbidden"
→ Tu rol no tiene permiso. Verifica que usas el usuario correcto:
- ADMIN: para listar usuarios, descargar archivos, etc.
- CLIENTE: para crear pedidos, subir archivos, etc.

### "404 Not Found"
→ El endpoint existe pero el recurso no. Verifica el ID en `{{usuario_id}}` o `{{pedido_id}}`.

### CORS error
→ Verifica que el backend está levantado en `http://localhost:8080/api`. En `application.yml`:
```yaml
server.servlet.context-path: /api
cors.allowed-origins: http://localhost:5173
```

## 📖 Referencia de Endpoints

| Método | Endpoint | Autenticación | Rol |
|--------|----------|---------------|----|
| POST | `/auth/login` | ❌ | ANY |
| GET | `/usuarios` | ✅ | ADMIN |
| GET | `/usuarios/{id}` | ✅ | ADMIN / SELF |
| POST | `/usuarios` | ✅ | ADMIN |
| PUT | `/usuarios/{id}` | ✅ | ADMIN / SELF |
| PUT | `/usuarios/{id}/cambiar-password` | ✅ | ADMIN / SELF |
| DELETE | `/usuarios/{id}` | ✅ | ADMIN |
| GET | `/pedidos` | ✅ | ADMIN |
| GET | `/pedidos/mis-pedidos` | ✅ | CLIENTE |
| GET | `/pedidos/{id}` | ✅ | ADMIN / SELF |
| POST | `/pedidos` | ✅ | CLIENTE |
| PUT | `/pedidos/{id}` | ✅ | ADMIN |
| DELETE | `/pedidos/{id}` | ✅ | ADMIN |
| POST | `/pedidos/{pedidoId}/archivos` | ✅ | CLIENTE |
| POST | `/files` | ✅ | CLIENTE |
| GET | `/files/{fileName}` | ✅ | ADMIN |

---

**Última actualización**: 2026-05-16  
**Versión**: 4.0.0

