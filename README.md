# RealPrint - Sistema de Gestion de Pedidos

Sistema de gestion de pedidos para servicios de impresion personalizada, con frontend React y backend REST seguro.

## 🚀 Acceso a Producción

**App en producción:** [https://app-realprint.netlify.app/](https://app-realprint.netlify.app/)
- Posibilidad de cold start en backend (Render) si no ha sido accedido recientemente.
- Archivo keep-backend-alive para evitar cold start y monitor en uptimeRobot para mantenerlo activo.
- Pudiera ser que hubiese que esperar un minuto para que el backend esté completamente operativo después de acceder por primera vez.

### Infraestructura en la nube
- **Frontend**: Alojado en [Netlify](https://netlify.com) (React + Vite compilado)
- **Backend API**: Alojado en [Render](https://render.com) (Spring Boot)
- **Base de datos**: PostgreSQL en [Render](https://render.com)

**Usuarios de prueba en producción:**
- `admin` / `admin123`
- `igor` / `igor123`

---

## 📹 Enlaces Video Presentación

Videos educativos sobre la arquitectura y funcionamiento de RealPrint:

- **Video 1: Motivación y visual de la Interfaz de Usuario** 
  https://youtu.be/sNf6oNDAsYk

- **Video 2: Frontend — Hooks, Componentes y Flujo de Crear Pedido**
  https://youtu.be/I16PSnKzb_w
---

## Documentación destacada

A continuación tienes enlaces directos a la documentación principal del proyecto (en `docs/md`) y a los diagramas (`docs/DIAGRAMAS`).

- Memoria final: [docs/md/Memoria_Final.md](docs/md/Memoria_Final.md)
- Requisitos funcionales: [docs/md/RealPrint_Requisitos_Funcionales.md](docs/md/RealPrint_Requisitos_Funcionales.md)
- Requisitos no funcionales: [docs/md/RealPrint_Requisitos_NO_Funcionales.md](docs/md/RealPrint_Requisitos_NO_Funcionales.md)
- Estructura detallada del proyecto: [docs/md/ESTRUCTURA_PROYECTO.md](docs/md/ESTRUCTURA_PROYECTO.md)

Diagramas (carpeta `docs/DIAGRAMAS`):

- [docs/DIAGRAMAS/DER_RealPrint_Mermaid.md](docs/DIAGRAMAS/DER_RealPrint_Mermaid.md)
- [docs/DIAGRAMAS/RealPrint_Casos_de_uso.md](docs/DIAGRAMAS/RealPrint_Casos_de_uso.md)
- [docs/DIAGRAMAS/RealPrint_Diagrama_Clases_Mermaid.md](docs/DIAGRAMAS/RealPrint_Diagrama_Clases_Mermaid.md)
- [docs/DIAGRAMAS/RealPrint_Diagramas_Secuencia.md](docs/DIAGRAMAS/RealPrint_Diagramas_Secuencia.md)
- Imágenes del diagrama: [docs/DIAGRAMAS/images/](docs/DIAGRAMAS/images/)

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
- `cliente` / `cliente123`

### Nota de entornos

- **Desarrollo local**: MySQL en Docker (`docker/docker-compose.yml`).
- **Producción**: PostgreSQL (`docker/docker-compose.prod.yml` como referencia local y `backend/src/main/resources/application-production.yml` para Render).
- El perfil por defecto es `development`, así que el backend espera la base de datos local levantada en Docker.

## Testing de API con Postman

Se incluye **colección Postman completa** con los 16 endpoints:

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
- `GET /api/pedidos/mis-pedidos` - Listar mis pedidos (CLIENTE)
- `GET /api/pedidos/{id}` - Obtener pedido por ID
- `POST /api/pedidos` - Crear pedido (CLIENTE)
- `PUT /api/pedidos/{id}` - Actualizar pedido (ADMIN)
- `DELETE /api/pedidos/{id}` - Eliminar pedido (ADMIN)
- `POST /api/pedidos/{pedidoId}/archivos` - Agregar archivo a pedido (CLIENTE)

### Usuarios
- `GET /api/usuarios` - Listar usuarios (ADMIN)
- `GET /api/usuarios/{id}` - Obtener usuario (ADMIN o self)
- `POST /api/usuarios` - Crear usuario (ADMIN)
- `PUT /api/usuarios/{id}` - Actualizar usuario (ADMIN o self)
- `PUT /api/usuarios/{id}/cambiar-password` - Cambiar contraseña (ADMIN o self)
- `DELETE /api/usuarios/{id}` - Eliminar usuario (ADMIN)

### Archivos
- `POST /api/files` - Subir archivo (CLIENTE)
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
- En desarrollo se usa `application-development.yml` apuntando a MySQL local (`ddl-auto=update`).
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
cd docker
docker compose up -d
docker compose ps
docker compose logs mysql
```

Si cambiaste el init SQL y necesitas recrear el volumen:

```powershell
cd docker
docker compose down -v
docker compose up -d
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

## Documentacion adicional

- **Guía de inicio rápido**: `docs/md/QUICK_START.md`
- **Estructura del proyecto**: `docs/md/ESTRUCTURA_PROYECTO.md`
- **Deploy en producción**: `docs/md/DEPLOY_CHECKLIST.md`
- **Configuración Netlify**: `docs/md/NETLIFY_CONFIG.md`
- **Configuración Render**: `docs/md/RENDER_CONFIG.md`
- **Variables de entorno Render**: `docs/md/RENDER_ENV_VARS.md`
- **Memoria final**: `docs/md/Memoria_Final.md`
- **Flujo de endpoints**: `docs/md/RealPrint_Flujo_Endpoints.md`
- **Diagramas**: `docs/DIAGRAMAS/`
- **Colección Postman**: `docs/postman/`
