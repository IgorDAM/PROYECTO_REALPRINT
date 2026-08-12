# Configuración de Deploy del Backend en Azure Container Apps

## Recursos Azure

- **Suscripción**: `Azure subscription 1`
- **Resource group**: `realprint-rg` (región `westeurope`)
- **Container Apps Environment**: `realprint-env`
- **Container App**: `realprint-backend`
- **Imagen**: `ghcr.io/igordam/proyecto_realprint-backend:main` (público, sin credenciales de registro)

## Variables de Entorno Requeridas

Configuradas como *environment variables* / *secrets* del Container App (no en el repositorio):

### Base de Datos (MySQL en Aiven)
```
DB_HOST=<host>.aivencloud.com
DB_PORT=<puerto>
DB_NAME=defaultdb
DB_USER=avnadmin
DB_PASSWORD=<secretref:db-password>
```
La contraseña se guarda como *secret* del Container App (`db-password`), nunca como variable en claro.

### Seguridad JWT (REQUERIDO)
```
JWT_SECRET=<secretref:jwt-secret>
JWT_EXPIRATION_MS=86400000
```
Genera un valor único con:
```bash
openssl rand -base64 48
```

### Servidor
```
SPRING_PROFILE=production
SERVER_CONTEXT_PATH=/api
```

### CORS (REQUERIDO)
```
CORS_ALLOWED_ORIGINS=https://brave-desert-082e32103.7.azurestaticapps.net
```

## Comandos de referencia (`az cli`)

### Crear el entorno y la Container App
```bash
az containerapp env create --name realprint-env --resource-group realprint-rg --location westeurope

az containerapp create \
  --name realprint-backend \
  --resource-group realprint-rg \
  --environment realprint-env \
  --image ghcr.io/igordam/proyecto_realprint-backend:main \
  --target-port 8080 \
  --ingress external \
  --min-replicas 0 --max-replicas 1 \
  --cpu 0.5 --memory 1.0Gi \
  --secrets "db-password=<PASSWORD>" "jwt-secret=<SECRET>" \
  --env-vars \
    SPRING_PROFILE=production \
    SERVER_CONTEXT_PATH=/api \
    CORS_ALLOWED_ORIGINS=https://brave-desert-082e32103.7.azurestaticapps.net \
    DB_HOST=<host> DB_PORT=<puerto> DB_NAME=defaultdb DB_USER=avnadmin \
    "DB_PASSWORD=secretref:db-password" \
    "JWT_SECRET=secretref:jwt-secret"
```

> ⚠️ Si ejecutas esto desde Git Bash en Windows, antepón `MSYS_NO_PATHCONV=1` a cualquier comando que incluya un valor empezando por `/` (como `SERVER_CONTEXT_PATH=/api`) — Git Bash lo convierte a una ruta de Windows (`C:/Program Files/Git/api`) y rompe el arranque de Spring Boot.

### Redeploy tras un build nuevo (manual)
El pipeline de GitHub Actions construye y publica la imagen automáticamente, pero **no** la aplica al backend: el tenant de Azure (`educastur`) no permite crear *service principals*, que es lo que necesitaría la Action de despliegue. Aplica el cambio manualmente:
```bash
az containerapp update --name realprint-backend --resource-group realprint-rg \
  --image ghcr.io/igordam/proyecto_realprint-backend:main
```

## Pasos Post-Deploy

1. **Verificar salud**: `curl https://realprint-backend.politepebble-bca8a1b2.westeurope.azurecontainerapps.io/api/actuator/health`
2. **Usuarios de prueba**: el `DataInitializer` del backend siembra `admin/admin123` y `cliente/cliente123` en el primer arranque si la BD está vacía.
3. **Ver logs**: `az containerapp logs show --name realprint-backend --resource-group realprint-rg --tail 50`

## Troubleshooting

### Cold start / arranque lento
`--min-replicas 0` significa que el contenedor se apaga tras inactividad. La primera petición tras un rato puede tardar 20-40s en responder mientras arranca. Ver [COLD_START_TROUBLESHOOTING.md](./COLD_START_TROUBLESHOOTING.md).

### Error de CORS
Verifica que `CORS_ALLOWED_ORIGINS` coincide exactamente con la URL del Static Web App (sin trailing slash).

### Error de conexión a MySQL
- Verifica que el servicio de Aiven esté "Running" (los planes Free también se apagan tras inactividad).
- Revisa `DB_HOST`/`DB_PORT`/`DB_USER`/`DB_PASSWORD` con `az containerapp show --name realprint-backend --resource-group realprint-rg --query "properties.template.containers[0].env"`.

### Revisión en estado "Failed"
```bash
az containerapp revision list --name realprint-backend --resource-group realprint-rg -o table
az containerapp logs show --name realprint-backend --resource-group realprint-rg --tail 60
```
