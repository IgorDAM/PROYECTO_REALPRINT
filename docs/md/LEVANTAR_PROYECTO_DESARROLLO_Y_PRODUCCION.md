# RealPrint - Guia breve de arranque

> Stack real: **React + Vite** · **Spring Boot 4 + Java 17** · **MySQL 8.0 en desarrollo (Docker)** · **MySQL en Aiven en producción**
> Producción: **Azure Container Apps** (backend) + **Azure Static Web Apps** (frontend) + **Aiven** (BD). Ver `AZURE_BACKEND_CONFIG.md` y `AZURE_FRONTEND_CONFIG.md`.

---

## 1) Entorno de desarrollo

### Requisitos
- Java 17+
- Maven 3.9+
- Node.js 18+
- Docker Desktop
- Git

### Estructura real relevante
```text
realprint/
|- backend/
|- frontend/
|- docker/
|  |- docker-compose.yml
|  `- docker-compose.prod.yml
|- scripts/
|  |- SETUP.bat
|  |- START_ALL.bat
|  |- START_BACKEND.bat
|  |- START_FRONTEND.bat
|  |- CLEAN.bat
|  |- deploy-prod.sh
|  `- mysql-init/
`- LAUNCH.bat
```

### Arranque rapido en Windows
```powershell
.\LAUNCH.bat
```

Opciones utiles:
- `START_ALL.bat` -> backend + frontend y MySQL si hace falta.
- `START_BACKEND.bat` -> backend + MySQL.
- `START_FRONTEND.bat` -> frontend.
- `SETUP.bat` -> primera instalacion.
- `CLEAN.bat` -> limpieza.

### URLs locales
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080/api`
- Swagger: `http://localhost:8080/api/swagger-ui.html`
- MySQL: `localhost:3306`

### Usuarios de prueba
- `admin / admin123`
- `cliente1 / cliente123`

### Arranque manual
```powershell
# 1) Levantar MySQL
cd docker
docker compose up -d

# 2) Backend
cd ..\backend
mvn spring-boot:run

# 3) Frontend
cd ..\frontend
npm install
npm run dev
```

### Perfil activo de Spring Boot
- `SPRING_PROFILE=development` por defecto
- `development` -> `application-development.yml`
- `production` -> `application-production.yml`
- `test` -> `application-test.yml`

### Notas rapidas
- `application.yml` define el perfil activo por defecto y el `context-path` `/api`.
- En desarrollo `ddl-auto=update`.
- En desarrollo MySQL se inicializa desde `docker/mysql-init/init.sql`.
- En produccion `ddl-auto=validate` y la BD es PostgreSQL.
- `JWT_SECRET` tiene valor por defecto en desarrollo, pero debe definirse en produccion.

---

## 2) Entorno de produccion (Azure)

### Infraestructura real
- **Backend**: Azure Container Apps (`realprint-backend`, en `realprint-rg`)
- **Frontend**: Azure Static Web Apps (`realprint-frontend`)
- **Base de datos**: MySQL en Aiven (plan Free)
- **CI/CD**: `.github/workflows/ci-cd.yml` (build+test+push automático; deploy del frontend automático, deploy del backend manual)

Ver detalle completo en `AZURE_BACKEND_CONFIG.md` y `AZURE_FRONTEND_CONFIG.md`.

### `docker-compose.prod.yml` (referencia local, no es como se despliega realmente)
Sigue existiendo como referencia para levantar un stack de producción completo en local con MySQL (útil para probar antes de subir cambios), pero el despliegue real no usa Docker Compose ni un servidor propio:
```bash
docker compose -f docker/docker-compose.prod.yml up -d --build
docker compose -f docker/docker-compose.prod.yml ps
curl http://localhost/api/actuator/health
```

### Redeploy manual del backend en Azure
```bash
az containerapp update --name realprint-backend --resource-group realprint-rg \
  --image ghcr.io/igordam/proyecto_realprint-backend:main
```

### Checklist minimo
- [ ] MySQL local healthy (desarrollo)
- [ ] Backend responde `/api/actuator/health` (local y producción)
- [ ] Frontend abre en `http://localhost:5173` (local) / Static Web App (producción)
- [ ] `JWT_SECRET` y `DB_PASSWORD` definidos como *secrets* en Container Apps
- [ ] `CORS_ALLOWED_ORIGINS` apunta a la URL real del frontend

---

## 3) Errores tipicos

### Puerto 8080 ocupado
```powershell
netstat -ano | findstr :8080
```

### MySQL no arranca (local o `docker-compose.prod.yml`)
```powershell
docker ps
docker logs realprint-mysql
```

### Frontend no conecta con backend
- Comprueba `VITE_API_URL` (local: `.env`; producción: `env:` del step de deploy en `ci-cd.yml`)
- Comprueba que backend este en `http://localhost:8080/api` (local) o la URL de Container Apps (producción)
- Revisa CORS en `application-development.yml` o `application-production.yml`

---

## 4) Resumen

Esta guia refleja el flujo real del proyecto:
- desarrollo local en Windows con `.bat`
- MySQL en Docker (local y como referencia en `docker-compose.prod.yml`)
- produccion en Azure: Container Apps (backend) + Static Web Apps (frontend) + Aiven MySQL (BD)
- redeploy del backend manual (`az containerapp update`), frontend automático vía GitHub Actions
