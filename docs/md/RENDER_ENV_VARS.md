# Variables de Entorno para Render (Backend)

## Variables requeridas en el servicio de Render

Para que el backend funcione correctamente en producción, configura estas variables en el dashboard de Render (Settings → Environment):

### Base de datos PostgreSQL

**Opción 1: Dejar que Render inyecte DATABASE_URL (RECOMENDADO)**

Render automáticamente inyecta `DATABASE_URL=postgresql://user:pass@host:port/db` cuando conectas una base de datos PostgreSQL.
El backend normaliza automáticamente esta URL a formato JDBC y extrae usuario/contraseña.

```bash
SPRING_PROFILES_ACTIVE=production
SPRING_PROFILE=production
```

**Opción 2: Usar SPRING_DATASOURCE_URL (si no tienes DATABASE_URL)**

```bash
SPRING_PROFILES_ACTIVE=production
SPRING_PROFILE=production
SPRING_DATASOURCE_URL=jdbc:postgresql://<HOST>:<PUERTO>/<BD>
SPRING_DATASOURCE_USERNAME=<USUARIO>
SPRING_DATASOURCE_PASSWORD=<CONTRASEÑA>
```

**⚠️ IMPORTANTE**: 
- El backend extrae automáticamente usuario y contraseña de `DATABASE_URL` si están presentes
- Con `DATABASE_URL=postgresql://user:pass@host:port/db`, no necesitas SPRING_DATASOURCE_USERNAME/PASSWORD
- **NUNCA** commitees credenciales reales en el repositorio

### Configuración del servidor

```bash
SERVER_CONTEXT_PATH=/api
PORT=8080
```

### Seguridad JWT

```bash
JWT_SECRET=<GENERA_UNO_CON: openssl rand -base64 32>
JWT_EXPIRATION_MS=86400000
```

**⚠️ IMPORTANTE**: Genera un JWT_SECRET único con: `openssl rand -base64 32` y nunca reutilices el mismo en múltiples ambientes.

### CORS

```bash
CORS_ALLOWED_ORIGINS=https://app-realprint.netlify.app
```

### Opcional: Uploads

```bash
UPLOAD_DIR=/opt/render/project/uploads
MAX_FILE_SIZE=10485760
MAX_REQUEST_SIZE=12582912
```

---

## Cómo aplicar en Render

1. Ve a tu servicio en Render: https://dashboard.render.com/
2. Selecciona el servicio `PROYECTO_REALPRINT`
3. Ve a **Environment** en el menú lateral
4. Añade cada variable con su valor
5. Haz clic en **Save Changes**
6. El servicio se redeplegará automáticamente

---

## Verificación después del deploy

### 1. Health check
```bash
curl https://proyecto-realprint.onrender.com/api/actuator/health
```

Debería devolver:
```json
{"status":"UP"}
```

### 2. Crear usuario admin (si la BD está vacía)

Verificar estado:
```bash
curl https://proyecto-realprint.onrender.com/api/setup/status
```

Si devuelve que no hay usuarios, crear admin:
```bash
curl -X POST https://proyecto-realprint.onrender.com/api/setup/admin \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","nombre":"Administrador","password":"Admin123!"}'
```

### 3. Probar login
```bash
curl -X POST https://proyecto-realprint.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'
```

---

## URLs de producción

- **Frontend (Netlify)**: https://app-realprint.netlify.app
- **Backend (Render)**: https://proyecto-realprint.onrender.com
- **API Base**: https://proyecto-realprint.onrender.com/api
- **Health**: https://proyecto-realprint.onrender.com/api/actuator/health
- **Swagger**: https://proyecto-realprint.onrender.com/swagger-ui.html

---

## Notas importantes

⚠️ **Seguridad**:
- Cambia `JWT_SECRET` por un valor aleatorio seguro de al menos 256 bits
- No compartas las credenciales de la base de datos públicamente
- Este archivo está en `.gitignore` y no debe subirse al repositorio

✅ **Dependencias instaladas**:
- PostgreSQL driver (`org.postgresql:postgresql`)
- Spring Boot Actuator (`spring-boot-starter-actuator`)
- Todos los endpoints están configurados en `SecurityConfig.java`

🔄 **Perfiles**:
- `development`: MySQL local, todas las rutas permitidas
- `production`: PostgreSQL en Render, autenticación JWT obligatoria
