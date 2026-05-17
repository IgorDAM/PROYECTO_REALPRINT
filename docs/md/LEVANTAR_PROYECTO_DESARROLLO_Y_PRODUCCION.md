# RealPrint - Guia breve de arranque

> Stack real: **React + Vite** · **Spring Boot 4 + Java 17** · **MySQL 8.0 en desarrollo** · **PostgreSQL en producción**
> En desarrollo, Docker se usa solo para MySQL.

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

## 2) Entorno de produccion

### Archivos reales
- `docker/docker-compose.prod.yml`
- `scripts/deploy-prod.sh`
- `backend/Dockerfile`
- `frontend/Dockerfile`

### Requisitos del servidor
- Docker
- Docker Compose v2
- Git

### Despliegue manual en Linux
```bash
cd /opt/realprint
chmod +x scripts/deploy-prod.sh
./scripts/deploy-prod.sh <host> <user>
```

### Despliegue con Docker Compose
```bash
docker compose -f docker/docker-compose.prod.yml up -d --build
```

### Servicios expuestos
- Frontend: puerto `80`
- Backend: puerto interno `8080` con contexto `/api`
- PostgreSQL: `5432`

### Verificacion rapida
```bash
docker compose -f docker/docker-compose.prod.yml ps
docker compose -f docker/docker-compose.prod.yml logs -f backend
curl http://localhost/api/actuator/health
```

### Variables importantes
- `SPRING_PROFILE=production`
- `JWT_SECRET`
- `DB_PASSWORD`
- `DB_NAME=realprint_db`
- `SERVER_CONTEXT_PATH=/api`
- `DB_HOST=postgres` (si usas la referencia local de Compose)

### Checklist minimo
- [ ] MySQL healthy
- [ ] PostgreSQL healthy
- [ ] Backend responde `/api/actuator/health`
- [ ] Frontend abre en `http://<host>`
- [ ] `JWT_SECRET` definido
- [ ] `DB_PASSWORD` definido
- [ ] `docker/docker-compose.prod.yml` usado en produccion

---

## 3) Errores tipicos

### Puerto 8080 ocupado
```powershell
netstat -ano | findstr :8080
```

### MySQL no arranca
```powershell
docker ps
docker logs realprint-mysql
```

### PostgreSQL no arranca
```powershell
docker ps
docker logs realprint-postgres
```

### Frontend no conecta con backend
- Comprueba `VITE_API_URL`
- Comprueba que backend este en `http://localhost:8080/api`
- Revisa CORS en `application-development.yml` o `application-production.yml`

---

## 4) Resumen

Esta guia refleja el flujo real del proyecto:
- desarrollo local en Windows con `.bat`
- MySQL en Docker
- produccion con PostgreSQL en `docker/docker-compose.prod.yml`
- despliegue con `scripts/deploy-prod.sh`
