# Configuración de Deploy en Render

## Variables de Entorno Requeridas

Configura estas variables en Render (Settings > Environment):

### Base de Datos (Automática)
```
DATABASE_URL=postgresql://...
```
**Nota:** Render automáticamente provee esta variable cuando conectas una base de datos PostgreSQL.

### Seguridad JWT (REQUERIDO)
```
JWT_SECRET=tu-clave-secreta-super-larga-minimo-32-caracteres-para-hs256
JWT_EXPIRATION_MS=86400000
```
**IMPORTANTE:** Genera un JWT_SECRET único para producción. Ejemplo:
```bash
openssl rand -base64 32
```

### Servidor
```
PORT=8080
SERVER_CONTEXT_PATH=/api
SPRING_PROFILE=production
```
**Nota:** Render asigna el PORT automáticamente.

### CORS (REQUERIDO)
```
CORS_ALLOWED_ORIGINS=https://app-realprint.netlify.app
```
**IMPORTANTE:** Esta es la URL de tu frontend en Netlify. Si agregas un dominio personalizado después, separa las URLs con comas.

### Subida de Archivos
```
MAX_FILE_SIZE=10485760
MAX_REQUEST_SIZE=12582912
UPLOAD_DIR=/tmp/uploads
```
**Nota:** En Render usa `/tmp/uploads` ya que el filesystem es efímero.

### Rate Limiting (Opcional)
```
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=100
```

## Configuración del Servicio en Render

### Build Settings
- **Build Command:** `cd backend && ./mvnw clean package -DskipTests`
- **Start Command:** `cd backend && java -jar target/*.jar`
- **Branch:** `main`

### Advanced Settings
- **Auto-Deploy:** Activado
- **Health Check Path:** `/api/actuator/health`

## Base de Datos PostgreSQL

1. Crear PostgreSQL Database en Render
2. En tu Web Service, ir a "Environment" y agregar:
   - Seleccionar tu database
   - Render automáticamente agregará DATABASE_URL

## Pasos Post-Deploy

1. **Primera vez:** El backend ejecutará `ddl-auto: update` para crear las tablas automáticamente

2. **Verificar estado:** Primero verifica si necesitas crear el admin:
   ```bash
   curl https://tu-backend.onrender.com/api/setup/status
   ```
   Si `needsSetup: true`, continúa al paso 3.

3. **Setup inicial:** Ejecuta el endpoint de setup para crear usuario admin:
   ```bash
   curl -X POST https://tu-backend.onrender.com/api/setup/admin \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin",
       "nombre": "Administrador",
       "password": "Admin123!"
     }'
   ```
   **IMPORTANTE:** Este endpoint solo funciona cuando la BD está vacía. Después se auto-desactiva.

4. **Verificar salud:** Accede a `https://tu-backend.onrender.com/api/actuator/health`

## Troubleshooting

### Error de conexión CORS
- Verifica que `CORS_ALLOWED_ORIGINS` tenga la URL exacta: `https://app-realprint.netlify.app` (sin trailing slash)
- Ejemplo correcto: `https://app-realprint.netlify.app`
- Ejemplo incorrecto: `https://app-realprint.netlify.app/`

### Error de base de datos
- Verifica que la database esté conectada en Render
- Revisa logs: `Render Dashboard > tu-servicio > Logs`

### Timeout en primer request
- Render pone los servicios gratuitos en "sleep" después de inactividad
- El primer request puede tardar ~30 segundos en despertar

### Error de JWT
- Asegúrate de que `JWT_SECRET` esté configurado y tenga mínimo 32 caracteres