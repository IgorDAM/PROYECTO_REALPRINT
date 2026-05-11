# 📁 Estructura del Proyecto - RealPrint

Documentación de cada carpeta y archivo del proyecto RealPrint (excluidos archivos .md).

---

## 📂 Raíz del Proyecto

```
PROYECTO_REALPRINT/
├── 📄 LAUNCH.bat                    Ejecutable de menú principal para Windows. Permite seleccionar qué script ejecutar.
├── 📄 OPEN_IDE.bat                  Abre VS Code con el proyecto automáticamente en Windows.
├── 📄 .env                          Archivo de variables de entorno (NO subir a git). Contiene credenciales de BD y configuración.
├── 📄 .env.example                  Plantilla de ejemplo del .env. Sirve como referencia de qué variables necesitas.
├── 📄 .gitignore                    Especifica qué archivos/carpetas ignora git (node_modules, .env, target, etc).
├── 📄 .dockerignore                 Especifica qué archivos ignora Docker al construir imágenes.
├── 📁 .git/                         Carpeta interna de git. NO tocar. Contiene todo el historial de cambios.
├── 📁 .github/                      Configuración de GitHub Actions (CI/CD automation). Workflows para tests automáticos.
├── 📁 .idea/                        Carpeta de configuración de IntelliJ IDEA. NO versionar, es local.
├── 📁 .vscode/                      Configuración de VS Code. Snippets y extensiones recomendadas del proyecto.
├── 📁 backend/                      Servidor Spring Boot con APIs REST. Toda la lógica de negocio y base de datos.
├── 📁 frontend/                     Aplicación React con TypeScript. Interfaz visual para usuarios.
├── 📁 docker/                       Archivos de Docker Compose. Automatiza levantar MySQL y otros servicios.
├── 📁 docs/                         Documentación técnica del proyecto. Diagramas, interfaces y requisitos.
├── 📁 scripts/                      Scripts de utilidad (Windows .bat y Linux .sh). Setup, start, clean, deploy.
└── 📁 uploads/                      Carpeta donde se guardan archivos subidos por clientes (temporalmente).
```

---

## 🔙 Backend (Spring Boot + Java)

### Estructura General

```
backend/
├── 📄 pom.xml                       Archivo de configuración Maven. Define dependencias, versión Java (17), plugins.
├── 📄 mvnw                          Maven Wrapper para Linux/Mac. Ejecuta Maven sin instalarlo globalmente.
├── 📄 mvnw.cmd                      Maven Wrapper para Windows. Ejecuta Maven sin instalarlo globalmente.
├── 📄 Dockerfile                    Define cómo construir imagen Docker del backend. Usa Java 17 y puerto 8080.
├── 📄 cleanup-backend.bat           Script para limpiar caché y builds de Maven en Windows.
├── 📄 backend.log                   Archivo de logs del backend. Se genera al ejecutar la app.
├── 📁 src/                          Código fuente del backend (Java).
├── 📁 target/                       Carpeta de compilación Maven. Contiene .jar ejecutable y clases compiladas.
└── 📁 uploads/                      Directorio local para subidas de archivos en desarrollo.
```

### Backend - Código Fuente (`src/main`)

```
src/main/
├── 📁 java/com/realprint/realprintbackend/
│   ├── 📁 config/
│   │   ├── CorsConfig.java          Configura CORS para permitir requests desde frontend (http://localhost:5173).
│   │   ├── DataInitializer.java     Crea usuarios de prueba (admin/cliente1) al iniciar si la BD está vacía.
│   │   ├── JwtAuthenticationFilter.java  Interceptor que valida JWT en cada request. Extrae token del header.
│   │   ├── SecurityConfig.java       Configura Spring Security. Define qué endpoints requieren autenticación y roles.
│   │   └── WebConfig.java            Configuración general de Spring Boot (path context, encoding, etc).
│   │
│   ├── 📁 controller/
│   │   ├── AuthController.java       Endpoint POST /auth/login. Autentica usuarios y devuelve JWT.
│   │   ├── PedidoController.java     Endpoints CRUD de pedidos. GET, POST, PUT, DELETE con validaciones.
│   │   ├── UsuarioController.java    Endpoints para gestionar usuarios. Crear, listar, editar, eliminar.
│   │   └── FileController.java       Endpoints para subir (CLIENTE) y descargar (ADMIN) archivos. Soporta PDF, JPG, PNG.
│   │
│   ├── 📁 entity/
│   │   ├── Pedido.java               Entidad JPA de pedido. Mapea tabla 'pedidos'. Relación ManyToOne con Usuario.
│   │   ├── PedidoArchivo.java        Entidad para archivos adjuntos a un pedido. Almacena ruta y metadata.
│   │   ├── PedidoEstado.java         Enum con los estados: PENDIENTE, EN_PROCESO, COMPLETADO, ENVIADO, CANCELADO.
│   │   ├── RolUsuario.java           Enum con los roles: ADMIN, CLIENTE.
│   │   └── Usuario.java              Entidad JPA de usuario. Mapea tabla 'usuarios'. Contiene rol (ADMIN/CLIENTE).
│   │
│   ├── 📁 service/
│   │   ├── AuthService.java          Lógica de login. Valida credenciales y genera JWT.
│   │   ├── FileStorageService.java   Lógica de manejo de archivos. Guardar, verificar y servir archivos del sistema.
│   │   ├── PedidoService.java        Lógica de negocio para pedidos. Asignar cliente, cambiar estado, listar.
│   │   ├── SecurityRulesService.java Reglas de autorización: quién puede crear/leer/modificar pedidos y usuarios.
│   │   └── UsuarioService.java       Lógica de negocio para usuarios. Crear, validar, buscar, actualizar.
│   │
│   ├── 📁 repository/
│   │   ├── PedidoArchivoRepository.java Interface de acceso a datos de archivos de pedido.
│   │   ├── PedidoRepository.java        Interface de acceso a datos de pedidos. Queries por cliente, estado y findAll con @EntityGraph.
│   │   └── UsuarioRepository.java       Interface de acceso a datos de usuarios. Incluye findByUsername.
│   │
│   ├── 📁 dto/
│   │   ├── LoginRequest.java         DTO para request de login (username, password).
│   │   ├── LoginResponse.java        DTO para response de login (token, user info).
│   │   ├── PedidoDTO.java            DTO para pedidos. Incluye clienteId, clienteNombre, estado, total, medidas.
│   │   └── UsuarioDTO.java           DTO para usuarios. Evita exponer passwordHash en respuestas.
│   │
│   ├── 📁 mapper/
│   │   ├── PedidoMapper.java         Convierte entre Pedido (entity) ↔ PedidoDTO.
│   │   └── UsuarioMapper.java        Convierte entre Usuario (entity) ↔ UsuarioDTO.
│   │
│   ├── 📁 exception/
│   │   ├── PedidoNoEncontradoException.java Excepción cuando un pedido no existe. Lanza 404.
│   │   ├── UnauthorizedException.java       Excepción cuando falta autenticación. Lanza 401.
│   │   └── GlobalExceptionHandler.java      Manejo centralizado de excepciones. Formatea errores en respuestas JSON.
│   │
│   └── RealprintBackendApplication.java  Clase principal con @SpringBootApplication. Punto de entrada de la app.
│
└── 📁 resources/
    ├── 📄 application.yml             Configuración principal de Spring Boot (puerto, BD, JWT secret, etc).
    ├── 📄 application-development.yml Configuración para perfil 'development' (ddl-auto=update).
    ├── 📄 application-production.yml  Configuración para perfil 'production' (ddl-auto=validate).
    └── (otros resources)
```

---

## 🎨 Frontend (React + TypeScript + Vite)

### Estructura General

```
frontend/
├── 📄 package.json                  Define dependencias npm (React, TypeScript, Vite, etc). Scripts: dev, build, test.
├── 📄 tsconfig.json                 Configuración de TypeScript. Define strict mode, rutas de alias, target.
├── 📄 vite.config.js                Configuración de Vite (bundler). Define port 5173, proxy a backend, etc.
├── 📄 vitest.config.js              Configuración de Vitest (testing framework). Runner de unit tests.
├── 📄 playwright.config.js           Configuración de Playwright. Runner de tests E2E (end-to-end).
├── 📄 tailwind.config.js             Configuración de Tailwind CSS. Define colores, breakpoints personalizados.
├── 📄 postcss.config.js              Configuración de PostCSS (procesa CSS). Necesario para Tailwind.
├── 📄 eslint.config.js               Configuración de ESLint (linter de código). Define reglas de estilo.
├── 📄 eslint.config.ts               Configuración adicional de ESLint en TypeScript.
├── 📄 Dockerfile                    Define cómo construir imagen Docker del frontend. Usa Nginx.
├── 📄 nginx.conf                    Configuración de Nginx (servidor web). Rutas, caching, etc.
├── 📄 default.conf                  Configuración adicional de Nginx para producción.
├── 📄 netlify.toml                  Configuración para deploy en Netlify. Build commands, environment.
├── 📁 public/                       Archivos estáticos. Se sirven sin procesar. Favicon, imágenes.
├── 📁 index.html                    HTML base de la app. Punto de entrada. Carga bundle de React.
├── 📁 src/                          Código fuente React (TypeScript).
├── 📁 e2e/                          Tests end-to-end con Playwright. Simula usuario real.
├── 📁 test-results/                 Resultados de tests E2E ejecutados. Reportes y screenshots.
└── 📁 node_modules/                 Dependencias instaladas con npm. NO versionar, se regenera con npm install.
```

### Frontend - Código Fuente (`src/`)

```
src/
├── 📄 main.tsx                      Punto de entrada de React. Monta App en el DOM.
├── 📄 App.tsx                       Componente raíz. Define enrutamiento principal y layout.
├── 📄 App.css                       Estilos CSS globales para App.
├── 📄 index.css                     Estilos globales de toda la app. Reset, variables, base styles.
├── 📄 vite-env.d.ts                 Tipos de TypeScript para Vite. Define tipos globales de Vite.
│
├── 📁 pages/                        Vistas/páginas principales de la app. Un componente por ruta.
│   ├── 📄 Login.tsx                 Página de login. Muestra formulario y valida credenciales.
│   ├── 📄 Configuracion.tsx         Página de configuración de usuario (si existe).
│   ├── 📁 cliente/                  Páginas específicas para rol CLIENTE.
│   │   ├── ClienteDashboard.tsx     Dashboard del cliente. Muestra sus pedidos activos.
│   │   ├── ClienteHistorial.tsx     Historial de pedidos del cliente.
│   │   ├── ClienteEditarPedido.tsx  Formulario para editar un pedido existente.
│   │   └── LinearPedidoEditor.tsx   Editor de pedidos (crear/editar). Formulario interactivo.
│   └── 📁 admin/                    Páginas específicas para rol ADMIN.
│       ├── AdminDashboard.tsx       Dashboard del admin. Resumen de pedidos, estadísticas.
│       ├── AdminPedidos.tsx         Gestión de pedidos. Lista todos y permite cambiar estado.
│       └── AdminUsuarios.tsx        Gestión de usuarios. CRUD de usuarios.
│
├── 📁 components/                   Componentes reutilizables. Se usan en varias páginas.
│   ├── 📄 Logo.tsx                  Componente del logo de RealPrint.
│   ├── 📄 LoginForm.tsx             Formulario de login. Valida username/password con Zod.
│   ├── 📄 FloatingInput.tsx         Input reutilizable con animación (placeholder flotante).
│   ├── 📄 ErrorBoundary.tsx         Boundary que captura errores React. Muestra UI de error.
│   ├── 📄 ErrorBoundary.test.jsx    Test unitario del ErrorBoundary.
│   ├── 📄 ErrorFallback.tsx         UI mostrada cuando hay error en ErrorBoundary.
│   ├── 📄 FileList.tsx              Componente que renderiza lista de archivos descargables. Reutilizable.
│   ├── 📄 PedidoCard.tsx            Card que muestra resumen de un pedido.
│   ├── 📁 layout/                   Componentes de layout (header, nav, sidebar, etc).
│   │   ├── Header.tsx               Header/navbar de la app.
│   │   ├── Sidebar.tsx              Sidebar con menú de navegación.
│   │   └── Footer.tsx               Footer/pie de página.
│   ├── 📁 ui/                       Componentes UI básicos (botones, modales, tablas, etc).
│   │   ├── Button.tsx               Componente Button reutilizable.
│   │   ├── Modal.tsx                Modal/dialog reutilizable.
│   │   ├── Table.tsx                Tabla reutilizable.
│   │   ├── Badge.tsx                Badge para estados (Pendiente, En Proceso, etc).
│   │   ├── Input.tsx                Input reutilizable.
│   │   ├── Select.tsx               Select/dropdown reutilizable.
│   │   └── (otros componentes UI)
│   └── 📁 CreateOrderForm/          Componentes específicos para crear pedido.
│       ├── FormStep.tsx             Un paso del formulario (wizard).
│       ├── FileUpload.tsx           Upload de archivos PDF.
│       └── (otros)
│
├── 📁 pages/                        [DUPLICADO - VER ARRIBA]
│
├── 📁 context/                      Estado global con Context API.
│   ├── 📄 AuthContext.tsx           Estado global de autenticación. Usuario actual, token, rol.
│   └── AuthProvider.tsx             Provider para envolver la app con AuthContext.
│
├── 📁 services/                     Funciones para comunicación con backend (APIs).
│   ├── 📄 authService.ts            Funciones de login/logout. Gestiona token JWT.
│   ├── 📄 fileService.ts            Servicio de descargas seguras. Valida URLs, JWT automático, fallbacks.
│   ├── 📄 pedidoService.ts          Funciones CRUD de pedidos. Crear, listar, actualizar, eliminar, upload archivos.
│   ├── 📄 usuarioService.ts         Funciones CRUD de usuarios. Crear, listar, actualizar, eliminar.
│   ├── 📄 httpClient.ts             Cliente HTTP centralizado. Interceptor de JWT, manejo de errores, normalización.
│   ├── 📄 tokenStorage.ts           Gestión segura de JWT en localStorage. Guarda/recupera token y usuario.
│   ├── 📄 errors.ts                 Normalización de errores de API. Contrato único ApiError.
│   ├── 📄 logger.ts                 Logging centralizado para debugging y análisis.
│   └── 📄 index.ts                  Exportaciones públicas de servicios (re-exports).
│
├── 📁 schemas/                      Esquemas de validación con Zod.
│   ├── 📄 pedido.schema.ts          Validación de datos de pedido. Define tipos, límites, restricciones.
│   ├── login.schema.ts              Validación de credenciales de login.
│   ├── usuario.schema.ts            Validación datos de usuario.
│   └── (otros schemas)
│
├── 📁 hooks/                        Custom hooks React personalizados para lógica reutilizable.
│   ├── 📄 useAuth.ts                Hook para acceder al contexto de autenticación fácilmente.
│   ├── 📄 useFetch.ts               Hook personalizado para fetch con manejo de loading/error.
│   ├── 📄 useForm.ts                Hook para manejar formularios (validación, cambios, submit).
│   ├── 📄 useFileDownload.ts        Hook para descargas de archivos. Maneja estado, errores, JWT automático.
│   ├── 📄 useApiStatus.ts           Hook para gestionar estado de peticiones API (loading, error, result).
│   ├── 📄 usePedidosData.ts         Hook que encapsula lógica de fetch de pedidos y actualización de estado.
│   ├── 📄 useDataContext.ts         Hook para acceso a contexto global de datos.
│   └── (otros hooks)
│
├── 📁 utils/                        Funciones utilitarias/helpers.
│   ├── 📄 dateFormatter.ts          Funciones para formatear fechas.
│   ├── localStorage.ts              Wrapper para localStorage (guardar/obtener datos).
│   ├── validators.ts                Funciones de validación reutilizables.
│   └── (otros utils)
│
├── 📁 test/                         Archivos de test unitario.
│   ├── 📄 setup.ts                  Setup de tests. Configura mocks, librerías, etc.
│   ├── App.test.tsx                 Test del componente App.
│   └── (otros tests)
│
├── 📁 assets/                       Archivos multimedia (imágenes, iconos, fuentes).
│   ├── 📁 images/                   Imágenes PNG, JPG, etc.
│   ├── 📁 icons/                    Iconos SVG.
│   └── 📁 fonts/                    Fuentes custom (si las hay).
│
└── 📁 e2e/                          [VER ARRIBA - Tests E2E]
```

---

## 🐳 Docker (`docker/`)

```
docker/
├── 📄 docker-compose.yml            Define servicios (MySQL, Redis, etc) para desarrollo. Levanta BD automáticamente.
├── 📄 docker-compose.prod.yml       Define servicios para producción. Más restrictivo, menos logs.
└── 📁 mysql.cnf/                    Configuración personalizada de MySQL (limpieza de logs, ejecución, etc).
```

---

## 📚 Documentación (`docs/`)

```
docs/
├── 📁 DIAGRAMAS/
│   ├── 📄 DER_RealPrint_Mermaid.md  Diagrama Entidad-Relación de BD en formato Mermaid.
│   └── RealPrint_Casos_de_uso.md    Casos de uso del sistema (usuario-sistema-resultado).
│
├── 📁 INTERFACES/
│   ├── 📄 *.html                    Mockups/prototipos de interfaces (htmls estáticos).
│   ├── 📄 Realprint_logo.png        Logo de RealPrint (imagen).
│   └── 📄 script.js                 JavaScript para mockups interactivos (si los hay).
│
└── 📁 md/
    ├── 📄 LEVANTAR_PROYECTO_*.md    Guía de cómo levantar proyecto en desarrollo y producción.
    ├── RealPrint_Requisitos_Funcionales.md   Qué debe hacer el sistema (funcionalidades).
    └── RealPrint_Requisitos_NO_Funcionales.md Cómo debe ser (rendimiento, seguridad, etc).
```

---

## ⚙️ Scripts (`scripts/`)

```
scripts/
├── 📄 START_ALL.bat                 ⭐ Inicia backend + frontend simultáneamente en Windows.
├── 📄 START_REALPRINT.bat           Inicia todo (BD, backend, frontend) en Windows.
├── 📄 START_REALPRINT_FAST.bat      Versión rápida (sin setup inicial).
├── 📄 START_BACKEND.bat             Inicia solo el backend (Maven) en Windows.
├── 📄 START_FRONTEND.bat            Inicia solo el frontend (npm dev) en Windows.
├── 📄 SETUP.bat                     Ejecuta una sola vez. Verifica requisitos, crea BD, instala dependencias.
├── 📄 CLEAN.bat                     Limpia node_modules, target, caché. Usa antes de hacer git pull.
├── 📄 DIAGNOSTICO.bat               Verifica si todo está bien configured (Java, Maven, Node, MySQL).
├── 📄 realprint-database-mysql.sql  Script SQL. Crea tablas de la BD con schema inicial.
├── 📁 sql/                          SQL adicionales (migration scripts, seed data, etc).
├── 📄 backup-mysql.sh               Script Linux para hacer backup de MySQL. Exporta .sql.
├── 📄 deploy-prod.sh                Script Linux para deploy a producción. Build y push Docker.
└── 📄 health-check.sh               Script Linux para verificar si los servicios están corriendo (liveness check).
```

---

## 📦 Configuración de Raíz

```
.env                                Variables de entorno (credenciales BD, JWT secret). NO versionar.
.env.example                        Plantilla del .env. Muestra qué variables necesitas setear.
.gitignore                          Qué archivos ignora git (node_modules, .env, target, .idea, etc).
.dockerignore                       Qué archivos ignora Docker (git, node_modules, test, etc).
.github/                            Workflows de GitHub Actions. CI/CD automático (tests, builds).
.idea/                              Configuración local de IntelliJ IDEA. NO versionar.
.vscode/                            Configuración local de VS Code (extensiones recomendadas, snippets).
```

---

## 📋 Resumen Rápido

### Frontend (React)
- **pages/**: Las vistas donde navegas (Login, Dashboard, etc)
- **components/**: Piezas reutilizables (formularios, cards, botones)
- **services/**: Comunicación con backend (fetch, API calls)
- **context/**: Estado global (quién está logueado, qué rol tiene)
- **schemas/**: Validaciones de formularios (Zod)
- **hooks/**: Lógica reutilizable para componentes

### Backend (Spring Boot)
- **controller/**: Endpoints de la API REST
- **service/**: Lógica de negocio
- **repository/**: Acceso a datos (BD)
- **model/**: Entidades (tablas)
- **dto/**: Datos que llegan/salen de la API
- **config/**: Configuración (Security, CORS, JWT, etc)

### Infraestructura
- **scripts/**: Para levantar todo fácilmente
- **docker/**: Para containerizar servicios
- **docs/**: Documentación y diagramas

---

## 🎯 Flujo de Información

```
Usuario (navegador)
    ↓
Frontend React (pages/components)
    ↓
Validación (schemas/ con Zod)
    ↓
Servicios (services/api.ts hace fetch)
    ↓
[JWT token en header]
    ↓
Backend Spring Boot (controller + security)
    ↓
Validación + Lógica (service/)
    ↓
Base de datos (repository → model → entity)
    ↓
Respuesta JSON
    ↓
Frontend State (context/ + useState)
    ↓
Renderiza componentes (pages/components/)
    ↓
Usuario ve resultado
```

---

## 🔤 Glosario de Términos Técnicos

### A
**Auth / Autenticación**
Proceso de verificar la identidad de un usuario. En RealPrint, se hace con usuario + contraseña que genera un token JWT.

**Authorization / Autorización**
Sistema de permisos que controla qué puede hacer un usuario autenticado según su rol (ADMIN, CLIENTE).

### B
**Backend**
Servidor que procesa datos, lógica de negocio y comunicación con BD. En RealPrint: Spring Boot en puerto 8080.

**Badge**
Componente UI pequeño que muestra etiquetas o estados (ej: "Pendiente", "Completado" en color rojo/verde).

**Boundary / Error Boundary**
Componente React que captura errores de otros componentes. Si algo falla, muestra UI de error en lugar de causar crash.

### C
**CI/CD (Continuous Integration / Continuous Deployment)**
Automatización que ejecuta tests automáticamente cuando haces push a git, y despliega cambios a producción si todo pasa.

**CORS (Cross-Origin Resource Sharing)**
Mecanismo de seguridad que permite que frontend (localhost:5173) haga requests a backend (localhost:8080). Configurado en `CorsConfig.java`.

**Context API**
Sistema de React para manejar estado global sin librerías externas. Usado en `AuthContext.tsx` para guardar usuario logueado.

### D
**DTO (Data Transfer Object)**
Clase Java que define la forma de datos que viajan entre frontend y backend. Ej: `LoginRequest` con username y password.

**Docker**
Herramienta que "containeriza" aplicaciones. Crea una imagen con todo lo necesario para correr (BD, backend, etc) en cualquier máquina.

**Docker Compose**
Archivo YAML que define múltiples servicios Docker (MySQL, backend, frontend) y cómo se comunican entre ellos.

### E
**E2E / End-to-End Testing**
Test que simula un usuario real usando la app completa. En RealPrint: Playwright hace click, llena formularios, verifica resultados.

**Endpoint**
URL + método HTTP de una API. Ej: `POST /api/auth/login` es un endpoint de login.

**Entity / Entidad**
Clase Java anotada con `@Entity` que representa una tabla en la BD. Ej: `Usuario.java` → tabla `usuarios`.

### F
**Fetch**
Función JavaScript para hacer HTTP requests (GET, POST, PUT, DELETE) al backend desde el frontend.

**Frontend**
Aplicación React que ve el usuario en el navegador. En RealPrint: puerto 5173.

**FormData**
Objeto JavaScript para enviar archivos binarios en HTTP (multipart/form-data). Usado para upload de PDFs.

### G
**Gradle / Maven**
Herramientas de build para Java. RealPrint usa **Maven** (pom.xml). Descarga dependencias, compila, ejecuta tests.

### H
**Header (HTTP)**
Metadatos enviados en cada HTTP request/response. Ej: `Authorization: Bearer <token>` contiene el JWT.

**Hot Reload**
Característica de Vite: actualiza la app en el navegador automáticamente sin hacer refresh. Ahorra tiempo en desarrollo.

### J
**JWT (JSON Web Token)**
Token de seguridad que contiene datos encriptados del usuario. Se genera en login y se envía en cada request para autenticarse.

**JWT Secret**
Clave secreta usada para firmar/validar JWTs. En `.env`: `JWT_SECRET=your-secret-key`. **Nunca compartir públicamente.**

**JPA / Hibernate**
Framework Java para mapear objetos a tablas BD. Define relaciones entre `Entity` classes automáticamente.

### L
**Lazy Loading**
Técnica que carga componentes/datos solo cuando se necesitan, no al inicio. Mejora rendimiento.

**localStorage**
Almacenamiento local del navegador. En RealPrint: guarda JWT para mantener sesión entre recargas.

### M
**Memoization**
Técnica que guarda resultado de cálculos costosos para evitar repetirlos. En React: `React.memo()` previene re-renders innecesarios.

**Middleware**
Función que intercepta requests antes que lleguen al controlador. En RealPrint: `JwtAuthenticationFilter` es middleware que valida JWT.

**Mock**
Datos falsos usados en tests. Simulan respuestas del backend sin necesidad de una BD real.

### N
**Nginx**
Servidor web usado en Docker. Sirve archivos estáticos del frontend compilado. Más ligero que Apache.

**npm (Node Package Manager)**
Gestor de dependencias JavaScript. Instala librerías (React, Vite, Zod, etc) con `npm install`.

### P
**Placeholder**
Texto/imagen que se muestra en campos vacíos como sugerencia (ej: "Ingresa tu usuario" en input). En `FloatingInput.tsx` flota al escribir.

**Provider**
Componente React que envuelve la app y proporciona datos a todos sus hijos. Ej: `AuthProvider` proporciona `AuthContext`.

**Proxy**
En `vite.config.js`: redirecciona requests a `/api/**` al backend (`localhost:8080`). Evita problemas de CORS en desarrollo.

### R
**Repository**
Interface Java que accede a datos. Extiende `JpaRepository` y proporciona métodos CRUD automáticos (save, findById, delete, etc).

**REST API (Representational State Transfer)**
Estilo de API que usa HTTP methods (GET, POST, PUT, DELETE) en URLs para CRUD de recursos.

**React Router**
Librería que maneja navegación entre páginas sin recargar. Define rutas con `<Route path="/login" element={<Login />}`.

**Responsive**
Interfaz que se adapta a diferentes tamaños de pantalla (mobile, tablet, desktop). Tailwind CSS ayuda con esto.

### S
**Schema (Validación)**
Definición de validación en Zod. Ej: `z.object({ username: z.string(), password: z.string() })` valida estructura.

**Service**
Clase Java con lógica de negocio. No accede BD directamente, usa `Repository`. En frontend: función que hace fetch a API.

**Security / Spring Security**
Framework Java para autenticación y autorización. Define qué endpoints requieren qué roles.

### T
**TypeScript**
Variante de JavaScript que añade **tipos estáticos**. Detecta errores antes de compilar. RealPrint lo usa en frontend.

**Token**
String que representa autenticación. JWT es un tipo de token. Se envía en headers de cada request.

### V
**Vite**
Bundler JavaScript moderno y rápido. Compila React + TypeScript en desarrollo (hot reload) y producción (optimizado).

**Vitest**
Framework para tests unitarios en JavaScript. Compatible con Vite. Más rápido que Jest.

### W
**Webhook**
URL que recibe notificaciones de eventos externos. Ej: si existente, webhook de Stripe notifica pagos completados.

**Wrapper**
Función o componente que envuelve otro añadiendo funcionalidad. Ej: wrapper de localStorage que valida antes de guardar.

### Z
**Zod**
Librería TypeScript para validación de datos. Define esquemas y valida en runtime. Genera tipos automáticamente.

---

## 📚 Términos por Categoría

### Seguridad
- JWT, JWT Secret, Auth, Authorization, CORS, Token, Middleware, Spring Security

### Frontend (React)
- Component, Page, Hook, Context API, Provider, State, Props, TypeScript, Vite, Placeholder

### Backend (Java)
- Entity, Repository, Service, Controller, DTO, Exception, Spring Boot, Maven

### Infraestructura
- Docker, Docker Compose, Nginx, CI/CD, Deployment

### Testing
- E2E, Mock, Unit Test, Vitest, Playwright

### Otros
- Database, API, REST, Endpoint, CORS, Fetch, localStorage, Lazy Loading, Responsive

---

¡Ahora tienes una referencia completa de cada carpeta y archivo del proyecto! 🚀
