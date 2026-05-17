# 📹 Guión de Videos - RealPrint (10 minutos totales)

> **Proyecto:** Sistema de Gestión de Pedidos para Impresión Personalizada  
> **Duración total:** 2 videos x 5 minutos = 10 minutos  
> **Enfoque:** Frontend (React + TypeScript)  
> **Nivel:** Explicación clara y visual

---

## 📋 Contenido

- [Video 1: Interfaz y Flujos Usuario (5 min)](#video-1--interfaz-y-flujos-usuario-5-min)
- [Video 2: Explicación Técnica Frontend (5 min)](#video-2--explicación-técnica-frontend-5-min)

---

## Video 1: Interfaz y Flujos Usuario (5 min)

### Objetivo
Mostrar visualmente cómo funciona la aplicación desde la perspectiva del usuario final, demostrando los 3 flujos principales.

---

### **[0:00-0:30] Introducción (30 seg)**

**Lo que se ve:**
- Pantalla de inicio (login)
- Logo de RealPrint

**Lo que se dice:**
> "Bienvenido al proyecto RealPrint, un sistema web moderno para gestionar pedidos de servicios de impresión personalizada. He construido esta aplicación con React, TypeScript y Tailwind CSS en el frontend, y Spring Boot en el backend. En este video, te mostraré cómo se ve y funciona la aplicación interactuando con sus principales característiscas."

**📁 Archivos relacionados:**
- 🎨 Página de login: `frontend/src/pages/Login.tsx`
- 🖼️ Logo: `frontend/public/` (buscar logo)
- 🎵 Estilos globales: `frontend/src/App.css`

---

### **[0:30-1:45] Flujo 1: Login (1 minuto 15 seg)**

**Lo que se ve:**
1. Pantalla de login completa
2. Ingreso de credenciales (usuario: `admin` / contraseña: `admin123`)
3. Animación de carga
4. Redirección a dashboard

**Lo que se dice:**
> "Empecemos con el **login**. La aplicación tiene dos tipos de usuarios: administradores y clientes. Vamos a ingresar con credenciales de admin. Como ves, la interfaz tiene un diseño moderno con gradientes y elementos decorativos. El formulario valida que ingresemos datos válidos antes de enviar. Una vez autenticado, el backend nos devuelve un token JWT que se almacena en localStorage, y la aplicación nos redirige automáticamente al dashboard correspondiente según nuestro rol."

**📁 Archivos relacionados:**
- 🔐 Página Login: `frontend/src/pages/Login.tsx`
- 📋 Formulario: `frontend/src/components/LoginForm.tsx` (validación, envío)
- 🌍 Contexto Auth: `frontend/src/context/AuthContext.tsx` (almacena token JWT)
- 🛂 Rutas protegidas: `frontend/src/components/ProtectedRoute.tsx`
- ✅ Esquema validación: `frontend/src/schemas/auth.schema.ts` (Zod)

---

### **[1:45-3:15] Flujo 2: Cliente Creando un Pedido (1 minuto 30 seg)**

**Lo que se ve:**
1. Logout de admin
2. Login como cliente (`cliente1` / `cliente123`)
3. Dashboard del cliente
4. Acceso a "Nuevo Pedido"
5. Formulario de pedido con campos:
   - Tipo de impresión (dropdown)
   - Cantidad
   - Descripción
   - Carga de archivo (PDF)
6. Validación del formulario
7. Envío del pedido
8. Confirmación de éxito

**Lo que se dice:**
> "Ahora vamos como **cliente** para hacer un pedido. Primero cerramos sesión y nos conectamos como cliente. Como ves, el dashboard del cliente es diferente: muestra sus pedidos activos y le da acceso a crear nuevos pedidos. Cuando hacemos clic en 'Nuevo Pedido', se abre un formulario interactivo con validación en tiempo real. Aquí podemos seleccionar el tipo de servicio, cantidad deseada, escribir una descripción, y **cargar el archivo PDF** que queremos imprimir. Los clientes pueden subir archivos y verlos listados. Finalmente, al hacer clic en 'Enviar', el pedido se crea en la base de datos y recibimos una confirmación. El pedido ahora aparece en el historial del cliente."

**📁 Archivos relacionados:**
- 👤 Dashboard Cliente: `frontend/src/pages/cliente/ClienteDashboard.tsx`
- ➕ Crear Pedido: `frontend/src/pages/cliente/LinearPedidoEditor.tsx` o `CrearPedido.tsx`
- 📦 Card Pedido: `frontend/src/components/PedidoCard.tsx` (visualización)
- 📨 Validación: `frontend/src/schemas/pedido.schema.ts` (Zod - tipo, cantidad, descripción, archivo)
- 📤 Upload archivo: `frontend/src/services/api.ts` → función `uploadFile()` o `createPedido()`
- 🔗 Endpoint Backend: `POST /api/pedidos` (Spring Boot)
- 💾 Base de datos: `backend/src/main/resources/` (esquema pedidos)

---

### **[3:15-4:45] Flujo 3: Admin Gestionando Pedidos (1 minuto 30 seg)**

**Lo que se ve:**
1. Logout de cliente
2. Login como admin
3. Dashboard del admin
4. Sección "Gestión de Pedidos"
5. Lista de todos los pedidos con estados
6. Abrir un pedido
7. Ver detalles del pedido (usuario, archivo adjunto, descripción)
8. Cambiar estado del pedido (Pendiente → En Proceso → Completado)
9. Guardar cambios
10. Confirmación de actualización

**Lo que se dice:**
> "Ahora desde la perspectiva del **administrador**. El admin tiene acceso a la sección de 'Gestión de Pedidos' donde puede ver **todos los pedidos** del sistema con sus estados. Al abrir un pedido, podemos ver todos los detalles: quién lo hizo, qué tipo de impresión solicitó, la cantidad, la descripción y el archivo adjunto. El admin puede cambiar el estado del pedido a través de un selector (Pendiente, En Proceso, Completado). Esto es crucial para el flujo operativo: cuando cambiamos el estado, se actualiza en tiempo real para el cliente. Al guardar, vemos una confirmación de éxito y el pedido ya aparece con el nuevo estado en la lista."

**📁 Archivos relacionados:**
- 🎛️ Dashboard Admin: `frontend/src/pages/admin/AdminDashboard.tsx`
- 📋 Gestión Pedidos: `frontend/src/pages/admin/AdminPedidos.tsx` o `GestionPedidos.tsx`
- 📝 Detalles Pedido: `frontend/src/components/PedidoDetalle.tsx` o modal de detalles
- 🔄 Cambiar estado: `frontend/src/services/api.ts` → función `updatePedidoStatus()`
- 📌 Estados: Define enums/constantes en `frontend/src/constants/` o `schemas/pedido.schema.ts`
- 🔗 Endpoint Backend: `PUT /api/pedidos/{id}/status` (Spring Boot)
- 📊 Control de acceso: Solo roles ADMIN en `frontend/src/components/ProtectedRoute.tsx`

---

### **[4:45-5:00] Resumen (15 seg)**

**Lo que se dice:**
> "Como viste, RealPrint conecta de forma fluida a clientes y administradores en un mismo sistema. Los clientes pueden hacer pedidos fácilmente y los admins gestionar el flujo de trabajo. En el siguiente video, profundizaremos en la **arquitectura técnica** del frontend."

---

---

## Video 2: Explicación Técnica Frontend (5 min)

### Objetivo
Explicar la estructura, patrones de diseño y tecnologías usadas en el frontend (solo código).

---

### **[0:00-0:30] Introducción Técnica (30 seg)**

**Lo que se ve:**
- IDE (VS Code o similar) con el proyecto abierto
- Estructura de carpetas del frontend

**Lo que se dice:**
> "Bienvenido a la explicación técnica del frontend de RealPrint. En este video te mostraré cómo está estructurado el código, qué tecnologías usamos y cómo fluye la información en la aplicación. El proyecto está construido con React 18, TypeScript y Vite, que nos da excelente rendimiento en desarrollo y compilación."

**📁 Archivos clave:**
- 📦 Config: `frontend/package.json` (dependencias: React, TypeScript, Vite, Zod, React Router)
- ⚙️ Config Vite: `frontend/vite.config.js`
- 🔧 Config TypeScript: `frontend/tsconfig.json`
- 📂 Carpeta src: `frontend/src/`

---

### **[0:30-1:15] Estructura del Proyecto (45 seg)**

**Lo que se ve:**
- Árbol de carpetas
- Explicar cada carpeta:
  - `/src/pages` - Páginas principales
  - `/src/components` - Componentes reutilizables
  - `/src/services` - Llamadas API
  - `/src/context` - Estado global
  - `/src/schemas` - Validaciones con Zod
  - `/src/hooks` - Custom hooks

**Lo que se dice:**
> "La estructura del frontend sigue arquitectura modular. Tenemos **pages** donde están las vistas principales como Login, Dashboard, etc. Luego **components** contiene componentes reutilizables como LoginForm, PedidoCard, etc. En **services** tenemos la lógica de comunicación con el backend mediante fetch. **Context** maneja el estado global de autenticación usando React Context API. **Schemas** define validaciones usando Zod - esta es nuestra capa de seguridad del lado cliente. Y en **hooks** tenemos custom hooks personalizados para lógica reutilizable. Esta estructura mantiene el código limpio y escalable."

**📁 Estructura física:**
- 📄 Páginas: `frontend/src/pages/` → `Login.tsx`, `admin/`, `cliente/`
- 🧩 Componentes: `frontend/src/components/` → `LoginForm.tsx`, `PedidoCard.tsx`, `ProtectedRoute.tsx`
- 🌍 Servicios: `frontend/src/services/api.ts` (fetch/requests)
- 🎯 Contexto: `frontend/src/context/AuthContext.tsx`
- ✅ Esquemas: `frontend/src/schemas/` → `auth.schema.ts`, `pedido.schema.ts`
- 🪝 Hooks: `frontend/src/hooks/` → custom hooks propios
- 🎨 Estilos: `frontend/src/App.css`, con Tailwind CSS (`frontend/tailwind.config.js`)

---

### **[1:15-2:00] Autenticación y Seguridad (45 seg)**

**Lo que se ve:**
- Archivo de LoginForm.tsx
- AuthContext.tsx
- localStorage con token JWT
- Función de login mostrando:
  - Validación del formulario con Zod
  - POST a `/api/auth/login`
  - Almacenamiento del token
  - Redirección según rol

**Lo que se dice:**
> "El **sistema de autenticación** es fundamental. Cuando un usuario hace login, primero validamos los datos del lado cliente usando **Zod** - esto asegura que cumplan ciertos requisitos antes de enviar. Luego hacemos una petición POST al backend, que verifica las credenciales en base de datos y devuelve un **token JWT**. Este token se almacena en localStorage. El **AuthContext** mantiene el estado de autenticación en toda la app - guarda el usuario actual y el token. Luego, un **ProtectedRoute** usa este contexto para permitir o denegar el acceso a páginas según roles. Si intentas acceder a una página de admin siendo cliente, automáticamente te redirige."

**📁 Archivos detallados:**
- 🔐 Formulario Login: `frontend/src/components/LoginForm.tsx` (validación con Zod, POST)
  - Línea clave: `schema.parse(data)` o `safeParse(data)`
  - API call: `POST /api/auth/login`
- 🌍 Contexto Auth: `frontend/src/context/AuthContext.tsx`
  - Almacena: `user`, `token`, `isAuthenticated`, `role`
  - localStorage: `authToken`, `userRole`
- 🛂 Rutas protegidas: `frontend/src/components/ProtectedRoute.tsx`
  - Valida rol vs ruta requerida
  - Redirecciona si no autorizado
- ✅ Esquema: `frontend/src/schemas/auth.schema.ts`
  - Validación: email, contraseña (min length, format)
- 🔗 Backend: `backend/src/main/java/...controller/AuthController.java` (POST /api/auth/login)

---

### **[2:00-3:05] Flujos de Datos y Componentes (1 minuto 5 seg)**

**Lo que se ve:**
- Archivo ClienteDashboard.tsx mostrando:
  - useState para estado local
  - useEffect para cargar pedidos
  - Llamada a service
  - Listado de componentes
- Archivo PedidoCard o similar
- FormularioPedido.tsx mostrando:
  - Formulario con validación
  - Estados de carga/error
  - useNavigate

**Lo que se dice:**
> "En el **ClienteDashboard**, por ejemplo, usamos **hooks de React** para manejar el estado. Al montar el componente, un useEffect llama a un servicio que trae todos los pedidos del cliente desde el backend. El estado se actualiza y se renderizan los componentes Card. Cada card es **reutilizable** y responde a acciones del usuario. Cuando el cliente hace clic en 'Nuevo Pedido', se abre un formulario. Este formulario usa **validación en tiempo real** con Zod - cada vez que cambias un campo, se valida. Si hay errores, los ve inmediatamente. Cuando envía el formulario, hacemos un POST con los datos validados, la aplicación espera la respuesta del backend y si es exitosa, nos redirige a la lista de pedidos con un mensaje de éxito."

**📁 Archivos y conceptos:**
- 👤 Dashboard Cliente: `frontend/src/pages/cliente/ClienteDashboard.tsx`
  - `useState([])` para lista de pedidos
  - `useEffect(() => { fetchPedidos() }, [])` al montar
  - Mapeo: `pedidos.map(p => <PedidoCard key={p.id} pedido={p} />)`
  
- 📦 Card Pedido: `frontend/src/components/PedidoCard.tsx`
  - Props: `pedido: Pedido`
  - Render: datos del pedido (id, estado, createdAt)
  - Acciones: click para abrir detalles
  
- ➕ Formulario Pedido: `frontend/src/pages/cliente/LinearPedidoEditor.tsx` o similar
  - `useState({ tipo, cantidad, descripcion, archivo })`
  - `onChange` → validación instantánea con Zod
  - `onSubmit` → `createPedido(data)` → useNavigate a dashboard
  
- 📊 Flujo de datos: 
  ```
  User Input → useState → onChange validates (Zod) 
  → onSubmit → fetch POST → response → useState update → re-render
  ```

---

### **[3:05-3:50] Servicios y Comunicación API (45 seg)**

**Lo que se ve:**
- Archivo services/api.ts o similar
- Funciones como:
  - fetchPedidos()
  - createPedido()
  - updatePedidoStatus()
  - uploadFile()
- Headers con Authorization: Bearer token
- Manejo de errores (try/catch)

**Lo que se dice:**
> "La **comunicación con el backend** está centralizada en servicios. Cada servicio es una función que hace fetch a un endpoint específico. Por ejemplo, `fetchPedidos()` hace GET a `/api/pedidos`. Nota que todas las peticiones incluyen el **token JWT** en los headers bajo 'Authorization: Bearer'. Esto permite al backend verificar que eres un usuario autenticado. El servicio `createPedido()` valida localmente primero, luego hace POST con los datos. `uploadFile()` es especial - usa FormData porque estamos subiendo archivos binarios. Todos los servicios tienen manejo de errores: si la respuesta no es exitosa, lanzamos un error que el componente puede capturar y mostrar al usuario."

**📁 Archivo principal:**
- 🌐 API Service: `frontend/src/services/api.ts`
  
  **Funciones principales:**
  - `fetchPedidos(token)` → GET `/api/pedidos`
  - `fetchPedidoById(id, token)` → GET `/api/pedidos/{id}`
  - `createPedido(data, token)` → POST `/api/pedidos`
  - `updatePedidoStatus(id, status, token)` → PUT `/api/pedidos/{id}/status`
  - `uploadFile(file, token)` → POST (FormData) `/api/archivos/upload`
  - `login(email, password)` → POST `/api/auth/login`
  
  **Headers comunes:**
  ```
  {
    "Authorization": "Bearer " + token,
    "Content-Type": "application/json"
  }
  ```
  
  **Manejo de errores:**
  ```typescript
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  } catch (error) {
    throw error;
  }
  ```

- 🔗 Endpoints Backend: Ver `backend/src/main/java/.../controller/`
  - `AuthController.java` → POST /api/auth/login
  - `PedidoController.java` → GET, POST, PUT endpoints
  - `ArchivosController.java` → POST /api/archivos/upload

---

### **[3:50-4:30] Validación con Zod y TypeScript (40 seg)**

**Lo que se ve:**
- Archivo schemas/pedido.schema.ts
- Definición de esquema con validaciones:
  - tipo: string enum
  - cantidad: number positivo
  - descripcion: string max length
  - archivo: file size limit
- Uso en formulario:
  - `.parse()` o `.safeParse()`
  - Manejo de errores

**Lo que se dice:**
> "**Zod** es una librería de validación que nos permite definir esquemas en TypeScript. Por ejemplo, el esquema de pedido define que 'tipo' debe ser una cadena de ciertos valores, 'cantidad' debe ser un número positivo, 'descripcion' máximo 500 caracteres, y el 'archivo' debe ser un PDF menor a 10MB. En el formulario, usamos `schema.safeParse(datos)` para validar. Si hay errores, nos devuelve un objeto con los errores específicos que mostramos al usuario. Si es válido, procedemos a enviar. Esto combina típicamente con **TypeScript** que nos da **tipos estáticos** - tanto Zod como TypeScript trabajan juntos para asegurar que los datos que manejamos son siempre del tipo correcto."

**📁 Archivos de validación:**
- ✅ Esquema Pedido: `frontend/src/schemas/pedido.schema.ts`
  ```typescript
  const pedidoSchema = z.object({
    tipo: z.enum(['IMPRESION_DIGITAL', 'OFFSET', 'SERIGRAFÍA']),
    cantidad: z.number().int().positive(),
    descripcion: z.string().max(500),
    archivo: z.instanceof(File).refine(
      file => file.size <= 10 * 1024 * 1024,
      "Archivo debe ser menor a 10MB"
    )
  });
  ```
  
- ✅ Esquema Auth: `frontend/src/schemas/auth.schema.ts`
  ```typescript
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  });
  ```

- 🔤 Tipos TypeScript: `frontend/src/types/` (si existe)
  - `Pedido`, `Usuario`, `AuthResponse`, etc.
  - Sincronizados con Zod schemas
  
- 📝 Uso en componentes:
  ```typescript
  const result = pedidoSchema.safeParse(formData);
  if (!result.success) {
    setErrors(result.error.flatten().fieldErrors);
  } else {
    // result.data está tipo-seguro
    await createPedido(result.data);
  }
  ```

---

### **[4:30-5:00] Resumen y Mejores Prácticas (30 seg)**

**Lo que se dice:**
> "Para resumir, el frontend de RealPrint usa **React** con hooks para componentes funcionales, **TypeScript** para seguridad de tipos, **Zod** para validación robusta, **React Context** para estado global, y una **estructura modular** con separación clara entre páginas, componentes y servicios. Esto hace el código **mantenible, escalable y seguro**. Si quieres ver el **backend** o tener más detalles, déjame comentarios. ¡Gracias!"

**📁 Resumen de tecnologías:**
- ⚛️ **React 18**: Componentes funcionales con hooks
- 🔤 **TypeScript**: Tipado estático
- ✅ **Zod**: Validación de datos
- 🎯 **React Context**: Estado global (auth)
- 🛣️ **React Router**: Navegación
- 🎨 **Tailwind CSS**: Estilos (config: `frontend/tailwind.config.js`)
- ✨ **Vite**: Build tool (config: `frontend/vite.config.js`)

**🏗️ Arquitectura:**
```
Components (presentación)
    ↓
Hooks (lógica local)
    ↓
Context (estado global)
    ↓
Services (comunicación)
    ↓
Backend API (Spring Boot)
```

---

---

## 📝 Sugerencias Adicionales que Podrías Incluir (Según Tiempo)

### Si Tienes Más Tiempo en Video 1:
- **Gestión de Usuarios (Admin)**: Mostrar cómo el admin puede crear, editar o eliminar usuarios
- **Historial de Pedidos**: Mostrar al cliente el seguimiento del estado de sus pedidos
- **Reportes (si existe)**: Gráficos o estadísticas que el admin pueda ver
- **Manejo de Errores**: Intentar hacer algo inválido para mostrar mensajes de error

### Si Tienes Más Tiempo en Video 2:
- **Custom Hooks**: Mostrar algún custom hook personalizado (ej: `useFetch`, `useAuth`)
- **Tailwind CSS**: Explicar brevemente el sistema de diseño responsivo
- **Routing**: Cómo React Router maneja la navegación entre páginas
- **Optimizaciones**: Lazy loading, memoization si las usas
- **Testing**: Mostrar tests unitarios o E2E si los tienes

---

## 🎥 Tips para Grabación

### Preparación
- [ ] Cierra navegadores extra para evitar distracciones
- [ ] Aumenta zoom en VS Code (Ctrl + Plus varios veces)
- [ ] Usa tema claro en IDE para mejor visibilidad en video
- [ ] Prueba el micrófono antes de grabar
- [ ] Cierra notificaciones del sistema

### Durante la Grabación (Video 1)
- Navega **lentamente** entre pantallas para que se vea bien
- **Pausa 1-2 segundos** antes de hacer cada acción para dar contexto
- Pon cursor sobre elementos importantes
- Lee desde notas, no memorices

### Durante la Grabación (Video 2)
- Abre archivos con Ctrl+P en VS Code
- **Espera a que se cargue el código** antes de hablar
- Resalta líneas importantes con múltiples cursores
- Navega al archivo correspondiente cuando cambies de tema

### Edición
- Añade subtítulos en puntos clave
- Pon clips del video anterior al comenzar video 2
- Transiciones suaves entre secciones
- Música de fondo muy bajita si lo deseas

---

## ⏱️ Timeline de Referencia

### Video 1: Interfaz (5 min)
| Tiempo | Sección | Duración |
|--------|---------|----------|
| 0:00 - 0:30 | Intro | 30s |
| 0:30 - 1:45 | Login | 1m 15s |
| 1:45 - 3:15 | Cliente → Nuevo Pedido | 1m 30s |
| 3:15 - 4:45 | Admin → Gestión Pedidos | 1m 30s |
| 4:45 - 5:00 | Resumen | 15s |

### Video 2: Técnico (5 min)
| Tiempo | Sección | Duración |
|--------|---------|----------|
| 0:00 - 0:30 | Intro | 30s |
| 0:30 - 1:15 | Estructura | 45s |
| 1:15 - 2:00 | Auth y Seguridad | 45s |
| 2:00 - 3:05 | Flujos de Datos | 1m 5s |
| 3:05 - 3:50 | Servicios API | 45s |
| 3:50 - 4:30 | Validación Zod | 40s |
| 4:30 - 5:00 | Resumen | 30s |

---

## 🔗 Índice de Referencias Rápidas

### 📂 Estructura Física del Proyecto
```
frontend/
├── src/
│   ├── pages/                          ← Vistas/Páginas
│   │   ├── Login.tsx                   [Video 1: 0:30-1:45] [Video 2: 1:15-2:00]
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx      [Video 1: 3:15-4:45]
│   │   │   └── AdminPedidos.tsx        [Video 1: 3:15-4:45]
│   │   └── cliente/
│   │       ├── ClienteDashboard.tsx    [Video 1: 1:45-3:15] [Video 2: 2:00-3:05]
│   │       └── LinearPedidoEditor.tsx  [Video 1: 1:45-3:15]
│   │
│   ├── components/                     ← Componentes Reutilizables
│   │   ├── LoginForm.tsx               [Video 2: 1:15-2:00] Validación Zod
│   │   ├── PedidoCard.tsx              [Video 2: 2:00-3:05] Componente reutilizable
│   │   └── ProtectedRoute.tsx          [Video 2: 1:15-2:00] Control de acceso
│   │
│   ├── services/                       ← Comunicación API
│   │   └── api.ts                      [Video 2: 3:05-3:50] Fetch calls
│   │
│   ├── context/                        ← Estado Global
│   │   └── AuthContext.tsx             [Video 2: 1:15-2:00] Almacena user + token
│   │
│   ├── schemas/                        ← Validaciones Zod
│   │   ├── auth.schema.ts              [Video 2: 3:50-4:30] Login validation
│   │   └── pedido.schema.ts            [Video 2: 3:50-4:30] Pedido validation
│   │
│   └── hooks/                          ← Custom Hooks
│       └── (custom logic aquí)         [Video 2: 0:30-1:15]
│
├── tailwind.config.js                  [Video 2: 0:30] Diseño responsivo
├── vite.config.js                      [Video 2: 0:00-0:30] Build tool
├── tsconfig.json                       [Video 2: 0:00-0:30] TypeScript config
└── package.json                        [Video 2: 0:00-0:30] Dependencias

backend/
└── src/main/java/.../controller/      [Video 2: 3:05-3:50]
    ├── AuthController.java             POST /api/auth/login
    ├── PedidoController.java           GET/POST/PUT /api/pedidos
    └── ArchivosController.java         POST /api/archivos/upload

docker/
└── docker-compose.yml                  Para ejecutar todo localmente
```

### URLs de Prueba
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`
- Swagger Backend: `http://localhost:8080/api/swagger-ui.html`

### Usuarios de Prueba
| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `admin` | `admin123` | Admin |
| `cliente1` | `cliente123` | Cliente |

---

## 🎯 Índice Rápido por Concepto

| Concepto | Archivo(s) | Video | Tiempo |
|----------|-----------|-------|--------|
| **Login / Autenticación** | `LoginForm.tsx`, `AuthContext.tsx`, `ProtectedRoute.tsx` | V1, V2 | 0:30-1:45, 1:15-2:00 |
| **Dashboard Admin** | `AdminDashboard.tsx`, `AdminPedidos.tsx` | V1 | 3:15-4:45 |
| **Dashboard Cliente** | `ClienteDashboard.tsx` | V1, V2 | 1:45-3:15, 2:00-3:05 |
| **Crear Pedido** | `LinearPedidoEditor.tsx`, `pedido.schema.ts` | V1, V2 | 1:45-3:15, 3:50-4:30 |
| **Subir Archivo** | `api.ts` (uploadFile) | V1 | 1:45-3:15 |
| **Estado Global** | `AuthContext.tsx`, localStorage | V2 | 1:15-2:00 |
| **Validación Zod** | `auth.schema.ts`, `pedido.schema.ts` | V2 | 3:50-4:30 |
| **API | Servicios** | `services/api.ts` | V2 | 3:05-3:50 |
| **TypeScript** | `tsconfig.json`, tipos en componentes | V2 | 0:00-0:30 |
| **Componentes Reutilizables** | `PedidoCard.tsx`, `LoginForm.tsx` | V2 | 2:00-3:05 |
| **Hooks de React** | ClienteDashboard (useState, useEffect) | V2 | 2:00-3:05 |
| **Rutas Protegidas** | `ProtectedRoute.tsx` | V2 | 1:15-2:00 |

---

## 📌 Notas Finales

- **Duración**: Respeta los 5 min por video. Si algo no cabe, prepara versión extendida.
- **Claridad**: Habla lentamente, hace pausas entre conceptos.
- **Visualización**: En video 2, es importante que el code sea legible (zoom grande).
- **Tono**: Profesional pero cercano. Eres explicando a un compañero.
- **Flujo**: Los dos videos son complementarios - Video 1 muestra QUÉ hace, Video 2 muestra CÓMO lo hace.

---

¡Listo! Ya tienes todo lo que necesitas para grabar. Buena suerte con los videos 🎬
