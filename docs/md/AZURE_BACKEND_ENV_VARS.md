# Variables de Entorno del Backend en Azure Container Apps

## Variables requeridas en la Container App `realprint-backend`

### Base de datos MySQL (Aiven Free)

```bash
DB_HOST=<servicio>.aivencloud.com
DB_PORT=<puerto>
DB_NAME=defaultdb
DB_USER=avnadmin
DB_PASSWORD=secretref:db-password   # guardado como secret, no en claro
```

**⚠️ IMPORTANTE**:
- Aiven exige SSL; el backend se conecta con `useSSL=true&requireSSL=true` (ver `application-production.yml`).
- El plan Free de Aiven se apaga tras inactividad y tarda unos segundos en reactivarse.
- **NUNCA** commitees credenciales reales en el repositorio.

### Configuración del servidor

```bash
SERVER_CONTEXT_PATH=/api
SPRING_PROFILE=production
```

### Seguridad JWT

```bash
JWT_SECRET=secretref:jwt-secret     # generado con: openssl rand -base64 48
JWT_EXPIRATION_MS=86400000
```

### CORS

```bash
CORS_ALLOWED_ORIGINS=https://brave-desert-082e32103.7.azurestaticapps.net
```

---

## Cómo aplicar cambios en Azure

Las variables de entorno de Container Apps no tienen un panel equivalente al de Render; se gestionan por `az cli`:

```bash
az containerapp update --name realprint-backend --resource-group realprint-rg \
  --set-env-vars "CORS_ALLOWED_ORIGINS=https://nueva-url"
```

Para actualizar un *secret*:
```bash
az containerapp secret set --name realprint-backend --resource-group realprint-rg \
  --secrets "jwt-secret=<nuevo-valor>"
```

> ⚠️ En Git Bash (Windows), antepón `MSYS_NO_PATHCONV=1` si el valor empieza por `/` (p. ej. `SERVER_CONTEXT_PATH=/api`), o Git Bash lo convertirá en una ruta de Windows.

---

## Verificación después del deploy

### 1. Health check
```bash
curl https://realprint-backend.politepebble-bca8a1b2.westeurope.azurecontainerapps.io/api/actuator/health
```
Debería devolver:
```json
{"status":"UP"}
```

### 2. Probar login
```bash
curl -X POST https://realprint-backend.politepebble-bca8a1b2.westeurope.azurecontainerapps.io/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## URLs de producción

- **Frontend (Azure Static Web Apps)**: https://brave-desert-082e32103.7.azurestaticapps.net
- **Backend (Azure Container Apps)**: https://realprint-backend.politepebble-bca8a1b2.westeurope.azurecontainerapps.io
- **API Base**: https://realprint-backend.politepebble-bca8a1b2.westeurope.azurecontainerapps.io/api
- **Health**: https://realprint-backend.politepebble-bca8a1b2.westeurope.azurecontainerapps.io/api/actuator/health

---

## Notas importantes

⚠️ **Seguridad**:
- `JWT_SECRET` y `DB_PASSWORD` viven como *secrets* del Container App, no como variables en claro.
- Este archivo está en `.gitignore` en su variante `.local.md` y no debe subirse con credenciales reales.

✅ **Dependencias instaladas**:
- MySQL driver (`com.mysql:mysql-connector-j`)
- Spring Boot Actuator (`spring-boot-starter-actuator`)

🔄 **Perfiles**:
- `development`: MySQL local (Docker), todas las rutas permitidas.
- `production`: MySQL en Aiven, autenticación JWT obligatoria.

💰 **Coste**: Container Apps (grant gratuito mensual) + Static Web Apps (Free) + Aiven (Free) = 0€ esperado. Alerta de presupuesto configurada en `realprint-rg` a 1€/mes con aviso al 50%.
