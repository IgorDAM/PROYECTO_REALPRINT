# RealPrint - Sistema de Gestion de Pedidos

Sistema de gestion de pedidos para servicios de impresion personalizada, con frontend React y backend REST seguro.

## Estructura del proyecto

```text
PROYECTO_REALPRINT/
|- frontend/                # React + Vite + TypeScript
|- backend/                 # Spring Boot 4.0.5 + Java 17
|- docker/                  # docker-compose.yml y docker-compose.prod.yml
|- scripts/                 # SETUP/START/CLEAN + utilidades de deploy
|- docs/                    # Documentacion
|- LAUNCH.bat               # Menu principal en Windows
`- README.md
```

## Inicio rapido (Windows)

### Requisitos previos
- Node.js 18+
- Java 17+
- Maven 3.8+
- Docker Desktop
- Git

### Opcion recomendada

```powershell
.\LAUNCH.bat
```

Desde el menu puedes usar:
- `[1]` `scripts\START_ALL.bat`
- `[2]` `scripts\SETUP.bat`
- `[3]` `scripts\START_BACKEND.bat`
- `[4]` `scripts\START_FRONTEND.bat`
- `[5]` `scripts\CLEAN.bat`

### Arranque manual

```powershell
# 1) MySQL en Docker
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

URLs locales:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/api/swagger-ui.html`

Usuarios de prueba:
- `admin` / `admin123`
- `cliente1` / `cliente123`

## Testing de API con Postman

Se incluye **colección Postman completa** con los 14 endpoints:

### Uso rápido (Windows)
```powershell
cd docs\postman
postman-run.bat                    # Ejecución simple con CLI
postman-run.bat --report           # Con reportes HTML/JUnit
```

### Uso en Postman Desktop
1. `File → Import` → `RealPrint.postman_collection.json`
2. `File → Import` → `RealPrint.postman_environment.json`
3. Selecciona environment **"RealPrint Local"**
4. Ejecuta endpoint **Login** → token se guarda automáticamente
5. ¡Todos los endpoints ya tienen autenticación configurada!

**Ver**: `docs/postman/README.md` para documentación completa

## Endpoints principales

### Autenticacion
- `POST /api/auth/login` - Login

### Pedidos
- `GET /api/pedidos` - Listar pedidos (ADMIN)
- `GET /api/pedidos/{id}` - Obtener pedido por ID
- `POST /api/pedidos` - Crear pedido (CLIENTE)
- `PUT /api/pedidos/{id}` - Actualizar pedido (ADMIN)
- `DELETE /api/pedidos/{id}` - Eliminar pedido (ADMIN)

### Usuarios
- `GET /api/usuarios` - Listar usuarios (ADMIN)
- `GET /api/usuarios/{id}` - Obtener usuario (ADMIN o self)
- `POST /api/usuarios` - Crear usuario (ADMIN)
- `PUT /api/usuarios/{id}` - Actualizar usuario (ADMIN o self)
- `DELETE /api/usuarios/{id}` - Eliminar usuario (ADMIN)

### Archivos
- `POST /api/upload` - Subir archivo (CLIENTE)
- `GET /api/files/{fileName}` - Descargar archivo (ADMIN)

## Stack tecnologico

### Frontend
- React 18.2
- Vite 6.4.x
- TypeScript 5.9
- React Router 7.12
- Tailwind CSS 3.3
- Zod 4.3

### Backend
- Spring Boot 4.0.5
- Java 17
- MySQL 8.0
- Spring Security + JWT
- JPA/Hibernate
- Lombok

## Notas importantes

- El backend usa `context-path` `/api` (configurado en `backend/src/main/resources/application.yml`).
- Perfil por defecto: `SPRING_PROFILE=development`.
- En desarrollo se usa `application-development.yml` (`ddl-auto=update`).
- En produccion se usa `application-production.yml` (`ddl-auto=validate`).

## Troubleshooting rapido

### Backend no inicia

```powershell
cd backend
mvn clean
mvn spring-boot:run
```

### Error de conexion a BD

```powershell
docker ps | findstr realprint-mysql
docker logs realprint-mysql
```

### Frontend no conecta con backend
- Verifica proxy en `frontend/vite.config.js`.
- Verifica CORS en `backend/src/main/java/com/realprint/realprintbackend/config/CorsConfig.java`.
- Verifica que backend responda en `http://localhost:8080/api`.

## Produccion (referencia)

Para despliegue, revisa:
- `docker/docker-compose.prod.yml`
- `scripts/deploy-prod.sh`
- `docs/md/LEVANTAR_PROYECTO_DESARROLLO_Y_PRODUCCION.md`
