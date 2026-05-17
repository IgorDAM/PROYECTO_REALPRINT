# 📹 Guión de Videos - RealPrint (10 minutos totales)

> **Proyecto:** Sistema de Gestión de Pedidos para Impresión Personalizada  
> **Duración total:** 2 videos x 5 minutos = 10 minutos  
> **Enfoque:** Frontend (React + TypeScript)  
> **Nivel:** Explicación clara y visual

---

## 📋 Contenido

- [Video 1: Motivacion + Interfaz y Flujos (5 min)](#video-1-motivacion--interfaz-y-flujos-5-min)
- [Video 2: Codigo Frontend (5 min)](#video-2-codigo-frontend-5-min)

---

## Video 1: Motivacion + Interfaz y Flujos (5 min)

### Objetivo
Presentar por que se construyo RealPrint (problema y motivacion) y despues mostrar la experiencia de uso en la interfaz, sin entrar en implementacion de codigo.

**Regla del video 1:** centrarte en la app funcionando y en [`docs/md/Memoria_Final.md`](./Memoria_Final.md); evita abrir archivos tecnicos del frontend.

---

### **[0:00-1:00] Problema y Motivacion (1 min)**

**Lo que se ve:**
- [`docs/md/Memoria_Final.md`](./Memoria_Final.md) en 1.1 y 1.2
- Pantalla de login para conectar problema con solucion

**Lo que se dice:**
- **Frase 1:** "RealPrint nace porque en este sector habia procesos manuales, retrasos y poca visibilidad del estado de los pedidos."  
  **Dirigete a:** [`docs/md/Memoria_Final.md`](./Memoria_Final.md) (1.1 Problema a Resolver)  
  **Accion en pantalla:** resalta 2-3 puntos clave del problema.
- **Frase 2:** "La motivacion fue optimizar tiempos, mejorar comunicacion y ordenar el flujo cliente-empresa."  
  **Dirigete a:** [`docs/md/Memoria_Final.md`](./Memoria_Final.md) (1.2 Motivacion)  
  **Accion en pantalla:** subraya la lista de motivaciones.
- **Frase 3:** "Ahora te muestro como esa motivacion se traduce en una interfaz clara para cliente y administrador."  
  **Dirigete a:** `http://localhost:5173`  
  **Accion en pantalla:** vuelve al login para iniciar demo.

**📁 Referencias de apoyo:**
- [`docs/md/Memoria_Final.md`](./Memoria_Final.md) (1.1, 1.2)
- `http://localhost:5173`

---

### **[1:00-2:00] Flujo 1: Login y Roles (1 min)**

**Lo que se ve:**
1. Pantalla de login completa
2. Ingreso de credenciales
3. Redireccion al dashboard por rol

**Lo que se dice:**
- **Frase 1:** "La entrada es unica, pero el sistema distingue entre roles de cliente y administrador."  
  **Dirigete a:** login en navegador  
  **Accion en pantalla:** ensena formulario con usuarios de prueba.
- **Frase 2:** "Al autenticar, cada rol aterriza en su dashboard correspondiente."  
  **Dirigete a:** dashboard admin y luego cliente  
  **Accion en pantalla:** muestra diferencia visual entre ambos.

**📁 Referencias de apoyo:**
- [`docs/md/Memoria_Final.md`](./Memoria_Final.md) (2.1 Requisitos RF-001, RF-002)
- `http://localhost:5173`

---

### **[2:00-3:20] Flujo 2: Cliente creando pedido (1 min 20 seg)**

**Lo que se ve:**
1. Login como cliente (`cliente1` / `cliente123`)
2. Dashboard cliente
3. Nuevo pedido + formulario
4. Subida de archivo y confirmacion

**Lo que se dice:**
- **Frase 1:** "Desde cliente, el objetivo es crear pedidos de forma rapida y con toda la informacion necesaria."  
  **Dirigete a:** panel cliente  
  **Accion en pantalla:** enseña pedidos activos e historial.
- **Frase 2:** "El formulario guia al usuario para completar tipo de servicio, cantidad, descripcion y adjuntos."  
  **Dirigete a:** "Nuevo pedido"  
  **Accion en pantalla:** completa campos clave y adjunta archivo.
- **Frase 3:** "Al enviar, el pedido queda registrado y visible para seguimiento."  
  **Dirigete a:** listado de pedidos del cliente  
  **Accion en pantalla:** muestra pedido recien creado.

**📁 Referencias de apoyo:**
- [`docs/md/Memoria_Final.md`](./Memoria_Final.md) (7.1 Flujo Cliente)
- `http://localhost:5173`

---

### **[3:20-4:40] Flujo 3: Admin gestionando pedidos (1 min 20 seg)**

**Lo que se ve:**
1. Login admin (`admin` / `admin123`)
2. Lista global de pedidos
3. Detalle y cambio de estado
4. Confirmacion de actualizacion

**Lo que se dice:**
- **Frase 1:** "Desde admin se centraliza la operativa: ver todos los pedidos y priorizar trabajo."  
  **Dirigete a:** seccion pedidos admin  
  **Accion en pantalla:** enseña tabla y filtros.
- **Frase 2:** "El admin puede abrir un pedido, revisar adjuntos y actualizar estado segun el avance."  
  **Dirigete a:** detalle de pedido  
  **Accion en pantalla:** cambia estado y guarda.
- **Frase 3:** "Este flujo mejora trazabilidad y comunicacion con el cliente."  
  **Dirigete a:** vista de estado actualizado  
  **Accion en pantalla:** muestra estado final en lista.

**📁 Referencias de apoyo:**
- [`docs/md/Memoria_Final.md`](./Memoria_Final.md) (7.2 Flujo Administrador)
- `http://localhost:5173`

---

### **[4:40-5:00] Cierre y puente al video tecnico (20 seg)**

**Lo que se dice:**
- **Frase 1:** "En este primer video vimos el por que del proyecto y como se refleja en la experiencia de usuario."  
  **Dirigete a:** vista general de la app  
  **Accion en pantalla:** cierre visual con dashboard.
- **Frase 2:** "En el segundo video vamos al codigo para explicar arquitectura, seguridad, servicios y validaciones."  
  **Dirigete a:** IDE con [`frontend/src/App.tsx`](../../frontend/src/App.tsx)  
  **Accion en pantalla:** transicion del navegador al editor.

---

---

<a id="video-2--explicación-técnica-frontend-5-min"></a>
## Video 2: Codigo Frontend (5 min)

### Objetivo
Explicar la estructura, patrones de diseño y tecnologías usadas en el frontend (solo código).

**Regla del video 2:** abrir codigo en IDE y explicar implementacion; no repetir demo funcional completa del video 1.

---

### **[0:00-0:30] Introducción Técnica (30 seg)**

**Lo que se ve:**
- IDE (VS Code o similar) con el proyecto abierto
- Estructura de carpetas del frontend

**Lo que se dice:**
- **Frase 1:** "Bienvenido a la explicación técnica del frontend de RealPrint."  
  **Dirígete a:** [`frontend/package.json`](../../frontend/package.json)  
  **Acción en pantalla:** abre la base del proyecto y las dependencias.
- **Frase 2:** "En este video te mostraré cómo está estructurado el código, qué tecnologías usamos y cómo fluye la información en la aplicación."  
  **Dirígete a:** [`frontend/src/App.tsx`](../../frontend/src/App.tsx)  
  **Acción en pantalla:** enseña el árbol de carpetas.
- **Frase 3:** "El proyecto está construido con React 18, TypeScript y Vite, que nos da excelente rendimiento en desarrollo y compilación."  
  **Dirígete a:** [`frontend/package.json`](../../frontend/package.json), [`frontend/vite.config.js`](../../frontend/vite.config.js), [`frontend/tsconfig.json`](../../frontend/tsconfig.json)  
  **Acción en pantalla:** resalta la configuración técnica.

**📁 Archivos clave:**
- 📦 Config: [`frontend/package.json`](../../frontend/package.json) (dependencias: React, TypeScript, Vite, Zod, React Router)
- ⚙️ Config Vite: [`frontend/vite.config.js`](../../frontend/vite.config.js)
- 🔧 Config TypeScript: [`frontend/tsconfig.json`](../../frontend/tsconfig.json)
- 📂 Carpeta src: [`frontend/src/App.tsx`](../../frontend/src/App.tsx)

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
- **Frase 1:** "La estructura del frontend sigue arquitectura modular."  
  **Dirígete a:** [`frontend/src/App.tsx`](../../frontend/src/App.tsx)  
  **Acción en pantalla:** muestra la carpeta raíz del código.
- **Frase 2:** "Tenemos pages donde están las vistas principales como Login, Dashboard, etc."  
  **Dirígete a:** [`frontend/src/pages/Login.tsx`](../../frontend/src/pages/Login.tsx)  
  **Acción en pantalla:** abre la carpeta de páginas.
- **Frase 3:** "Luego components contiene componentes reutilizables como LoginForm, PedidoCard, etc."  
  **Dirígete a:** [`frontend/src/components/LoginForm.tsx`](../../frontend/src/components/LoginForm.tsx)  
  **Acción en pantalla:** enseña los componentes reutilizables.
- **Frase 4:** "En services tenemos la lógica de comunicación con el backend mediante fetch."  
  **Dirígete a:** [`frontend/src/services/index.ts`](../../frontend/src/services/index.ts)  
  **Acción en pantalla:** muestra el archivo de servicios.
- **Frase 5:** "Context maneja el estado global de autenticación usando React Context API."  
  **Dirígete a:** [`frontend/src/context/AuthContext.tsx`](../../frontend/src/context/AuthContext.tsx)  
  **Acción en pantalla:** abre el contexto de autenticación.
- **Frase 6:** "Schemas define validaciones usando Zod - esta es nuestra capa de seguridad del lado cliente."  
  **Dirígete a:** [`frontend/src/schemas/orderValidation.ts`](../../frontend/src/schemas/orderValidation.ts)  
  **Acción en pantalla:** enseña los esquemas de validación.
- **Frase 7:** "Y en hooks tenemos custom hooks personalizados para lógica reutilizable."  
  **Dirígete a:** [`frontend/src/hooks/useLogin.ts`](../../frontend/src/hooks/useLogin.ts)  
  **Acción en pantalla:** entra en la carpeta de hooks si existe.
- **Frase 8:** "Esta estructura mantiene el código limpio y escalable."  
  **Dirígete a:** [`frontend/src/App.tsx`](../../frontend/src/App.tsx)  
  **Acción en pantalla:** cierra con una vista general de la estructura.

**📁 Estructura física:**
- 📄 Páginas: [`frontend/src/pages/Login.tsx`](../../frontend/src/pages/Login.tsx), [`frontend/src/pages/admin/AdminDashboard.tsx`](../../frontend/src/pages/admin/AdminDashboard.tsx), [`frontend/src/pages/cliente/ClienteDashboard.tsx`](../../frontend/src/pages/cliente/ClienteDashboard.tsx)
- 🧩 Componentes: [`frontend/src/components/LoginForm.tsx`](../../frontend/src/components/LoginForm.tsx), [`frontend/src/components/layout/ProtectedRoute.tsx`](../../frontend/src/components/layout/ProtectedRoute.tsx), [`frontend/src/components/CreateOrderForm/CreateOrderForm.tsx`](../../frontend/src/components/CreateOrderForm/CreateOrderForm.tsx)
- 🌍 Servicios: [`frontend/src/services/index.ts`](../../frontend/src/services/index.ts) (fetch/requests)
- 🎯 Contexto: [`frontend/src/context/AuthContext.tsx`](../../frontend/src/context/AuthContext.tsx)
- ✅ Esquemas: [`frontend/src/schemas/orderValidation.ts`](../../frontend/src/schemas/orderValidation.ts)
- 🪝 Hooks: [`frontend/src/hooks/useLogin.ts`](../../frontend/src/hooks/useLogin.ts) → custom hooks propios
- 🎨 Estilos: [`frontend/src/App.css`](../../frontend/src/App.css), con Tailwind CSS ([`frontend/tailwind.config.js`](../../frontend/tailwind.config.js))

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
- **Frase 1:** "El sistema de autenticación es fundamental."  
  **Dirígete a:** [`frontend/src/components/LoginForm.tsx`](../../frontend/src/components/LoginForm.tsx)  
  **Acción en pantalla:** abre el formulario de login.
- **Frase 2:** "Cuando un usuario hace login, primero validamos los datos del lado cliente usando Zod - esto asegura que cumplan ciertos requisitos antes de enviar."  
  **Dirígete a:** [`frontend/src/schemas/orderValidation.ts`](../../frontend/src/schemas/orderValidation.ts)  
  **Acción en pantalla:** muestra la validación del esquema.
- **Frase 3:** "Luego hacemos una petición POST al backend, que verifica las credenciales en base de datos y devuelve un token JWT."  
  **Dirígete a:** [`frontend/src/components/LoginForm.tsx`](../../frontend/src/components/LoginForm.tsx) o [`frontend/src/services/index.ts`](../../frontend/src/services/index.ts)  
  **Acción en pantalla:** enseña la petición de autenticación.
- **Frase 4:** "Este token se almacena en localStorage."  
  **Dirígete a:** [`frontend/src/context/AuthContext.tsx`](../../frontend/src/context/AuthContext.tsx)  
  **Acción en pantalla:** muestra el guardado del token.
- **Frase 5:** "El AuthContext mantiene el estado de autenticación en toda la app - guarda el usuario actual y el token."  
  **Dirígete a:** [`frontend/src/context/AuthContext.tsx`](../../frontend/src/context/AuthContext.tsx)  
  **Acción en pantalla:** resalta la gestión del estado global.
- **Frase 6:** "Luego, un ProtectedRoute usa este contexto para permitir o denegar el acceso a páginas según roles."  
  **Dirígete a:** [`frontend/src/components/layout/ProtectedRoute.tsx`](../../frontend/src/components/layout/ProtectedRoute.tsx)  
  **Acción en pantalla:** enseña la lógica de protección de rutas.
- **Frase 7:** "Si intentas acceder a una página de admin siendo cliente, automáticamente te redirige."  
  **Dirígete a:** [`frontend/src/components/layout/ProtectedRoute.tsx`](../../frontend/src/components/layout/ProtectedRoute.tsx)  
  **Acción en pantalla:** finaliza mostrando la redirección.

**📁 Archivos detallados:**
- 🔐 Formulario Login: [`frontend/src/components/LoginForm.tsx`](../../frontend/src/components/LoginForm.tsx) (validación con Zod, POST)
  - Línea clave: `schema.parse(data)` o `safeParse(data)`
  - API call: `POST /api/auth/login`
- 🌍 Contexto Auth: [`frontend/src/context/AuthContext.tsx`](../../frontend/src/context/AuthContext.tsx)
  - Almacena: `user`, `token`, `isAuthenticated`, `role`
  - localStorage: `authToken`, `userRole`
- 🛂 Rutas protegidas: [`frontend/src/components/layout/ProtectedRoute.tsx`](../../frontend/src/components/layout/ProtectedRoute.tsx)
  - Valida rol vs ruta requerida
  - Redirecciona si no autorizado
- ✅ Esquema: [`frontend/src/schemas/orderValidation.ts`](../../frontend/src/schemas/orderValidation.ts)
  - Validación: email, contraseña (min length, format)
- 🔗 Backend: [`backend/src/main/java/com/realprint/realprintbackend/controller/AuthController.java`](../../backend/src/main/java/com/realprint/realprintbackend/controller/AuthController.java) (POST /api/auth/login)

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
- **Frase 1:** "En el ClienteDashboard, por ejemplo, usamos hooks de React para manejar el estado."  
  **Dirígete a:** [`frontend/src/pages/cliente/ClienteDashboard.tsx`](../../frontend/src/pages/cliente/ClienteDashboard.tsx)  
  **Acción en pantalla:** abre el dashboard del cliente.
- **Frase 2:** "Al montar el componente, un useEffect llama a un servicio que trae todos los pedidos del cliente desde el backend."  
  **Dirígete a:** [`frontend/src/pages/cliente/ClienteDashboard.tsx`](../../frontend/src/pages/cliente/ClienteDashboard.tsx) y [`frontend/src/services/index.ts`](../../frontend/src/services/index.ts)  
  **Acción en pantalla:** señala el `useEffect` y la llamada al servicio.
- **Frase 3:** "El estado se actualiza y se renderizan los componentes Card."  
  **Dirígete a:** [`frontend/src/components/CreateOrderForm/CreateOrderForm.tsx`](../../frontend/src/components/CreateOrderForm/CreateOrderForm.tsx)  
  **Acción en pantalla:** muestra la tarjeta reutilizable.
- **Frase 4:** "Cada card es reutilizable y responde a acciones del usuario."  
  **Dirígete a:** [`frontend/src/components/CreateOrderForm/CreateOrderForm.tsx`](../../frontend/src/components/CreateOrderForm/CreateOrderForm.tsx)  
  **Acción en pantalla:** permanece en la tarjeta para explicar sus props.
- **Frase 5:** "Cuando el cliente hace clic en Nuevo Pedido, se abre un formulario."  
  **Dirígete a:** [`frontend/src/pages/cliente/LinearPedidoEditor.tsx`](../../frontend/src/pages/cliente/LinearPedidoEditor.tsx)  
  **Acción en pantalla:** abre el formulario de pedido.
- **Frase 6:** "Este formulario usa validación en tiempo real con Zod - cada vez que cambias un campo, se valida."  
  **Dirígete a:** [`frontend/src/schemas/orderValidation.ts`](../../frontend/src/schemas/orderValidation.ts)  
  **Acción en pantalla:** muestra el esquema de validación.
- **Frase 7:** "Si hay errores, los ve inmediatamente."  
  **Dirígete a:** [`frontend/src/pages/cliente/LinearPedidoEditor.tsx`](../../frontend/src/pages/cliente/LinearPedidoEditor.tsx)  
  **Acción en pantalla:** enseña los mensajes de error en el formulario.
- **Frase 8:** "Cuando envía el formulario, hacemos un POST con los datos validados, la aplicación espera la respuesta del backend y si es exitosa, nos redirige a la lista de pedidos con un mensaje de éxito."  
  **Dirígete a:** [`frontend/src/services/index.ts`](../../frontend/src/services/index.ts) y [`frontend/src/pages/cliente/ClienteDashboard.tsx`](../../frontend/src/pages/cliente/ClienteDashboard.tsx)  
  **Acción en pantalla:** muestra el envío y la redirección final.

**📁 Archivos y conceptos:**
- 👤 Dashboard Cliente: [`frontend/src/pages/cliente/ClienteDashboard.tsx`](../../frontend/src/pages/cliente/ClienteDashboard.tsx)
  - `useState([])` para lista de pedidos
  - `useEffect(() => { fetchPedidos() }, [])` al montar
  - Mapeo: `pedidos.map(p => <PedidoCard key={p.id} pedido={p} />)`
  
- 📦 Componente formulario/pasos: [`frontend/src/components/CreateOrderForm/CreateOrderForm.tsx`](../../frontend/src/components/CreateOrderForm/CreateOrderForm.tsx)
  - Props: `pedido: Pedido`
  - Render: datos del pedido (id, estado, createdAt)
  - Acciones: click para abrir detalles
  
- ➕ Formulario Pedido: [`frontend/src/pages/cliente/LinearPedidoEditor.tsx`](../../frontend/src/pages/cliente/LinearPedidoEditor.tsx)
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
- **Frase 1:** "La comunicación con el backend está centralizada en servicios."  
  **Dirígete a:** [`frontend/src/services/index.ts`](../../frontend/src/services/index.ts)  
  **Acción en pantalla:** abre el archivo de servicios.
- **Frase 2:** "Cada servicio es una función que hace fetch a un endpoint específico."  
  **Dirígete a:** [`frontend/src/services/index.ts`](../../frontend/src/services/index.ts)  
  **Acción en pantalla:** recorre las funciones principales.
- **Frase 3:** "Por ejemplo, fetchPedidos() hace GET a /api/pedidos."  
  **Dirígete a:** [`frontend/src/services/index.ts`](../../frontend/src/services/index.ts)  
  **Acción en pantalla:** señala `fetchPedidos()`.
- **Frase 4:** "Nota que todas las peticiones incluyen el token JWT en los headers bajo Authorization: Bearer."  
  **Dirígete a:** [`frontend/src/services/index.ts`](../../frontend/src/services/index.ts)  
  **Acción en pantalla:** resalta los headers comunes.
- **Frase 5:** "Esto permite al backend verificar que eres un usuario autenticado."  
  **Dirígete a:** [`backend/src/main/java/com/realprint/realprintbackend/controller/AuthController.java`](../../backend/src/main/java/com/realprint/realprintbackend/controller/AuthController.java)  
  **Acción en pantalla:** vincula el frontend con el backend.
- **Frase 6:** "El servicio createPedido() valida localmente primero, luego hace POST con los datos."  
  **Dirígete a:** [`frontend/src/services/index.ts`](../../frontend/src/services/index.ts)  
  **Acción en pantalla:** muestra `createPedido()`.
- **Frase 7:** "uploadFile() es especial - usa FormData porque estamos subiendo archivos binarios."  
  **Dirígete a:** [`frontend/src/services/index.ts`](../../frontend/src/services/index.ts)  
  **Acción en pantalla:** señala `uploadFile()`.
- **Frase 8:** "Todos los servicios tienen manejo de errores: si la respuesta no es exitosa, lanzamos un error que el componente puede capturar y mostrar al usuario."  
  **Dirígete a:** [`frontend/src/services/index.ts`](../../frontend/src/services/index.ts)  
  **Acción en pantalla:** muestra el bloque `try/catch`.

**📁 Archivo principal:**
- 🌐 API Service: [`frontend/src/services/index.ts`](../../frontend/src/services/index.ts)
  
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

- 🔗 Endpoints Backend: Ver [`backend/src/main/java/com/realprint/realprintbackend/controller/`](../../backend/src/main/java/com/realprint/realprintbackend/controller/)
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
- **Frase 1:** "Zod es una librería de validación que nos permite definir esquemas en TypeScript."  
  **Dirígete a:** [`frontend/src/schemas/orderValidation.ts`](../../frontend/src/schemas/orderValidation.ts)  
  **Acción en pantalla:** abre el esquema de validación.
- **Frase 2:** "Por ejemplo, el esquema de pedido define que tipo debe ser una cadena de ciertos valores, cantidad debe ser un número positivo, descripcion máximo 500 caracteres, y el archivo debe ser un PDF menor a 10MB."  
  **Dirígete a:** [`frontend/src/schemas/orderValidation.ts`](../../frontend/src/schemas/orderValidation.ts)  
  **Acción en pantalla:** muestra cada regla una por una.
- **Frase 3:** "En el formulario, usamos schema.safeParse(datos) para validar."  
  **Dirígete a:** [`frontend/src/pages/cliente/LinearPedidoEditor.tsx`](../../frontend/src/pages/cliente/LinearPedidoEditor.tsx)  
  **Acción en pantalla:** enseña el formulario que consume el esquema.
- **Frase 4:** "Si hay errores, nos devuelve un objeto con los errores específicos que mostramos al usuario."  
  **Dirígete a:** [`frontend/src/pages/cliente/LinearPedidoEditor.tsx`](../../frontend/src/pages/cliente/LinearPedidoEditor.tsx)  
  **Acción en pantalla:** muestra el bloque de errores.
- **Frase 5:** "Si es válido, procedemos a enviar."  
  **Dirígete a:** [`frontend/src/services/index.ts`](../../frontend/src/services/index.ts)  
  **Acción en pantalla:** vuelve al envío de datos.
- **Frase 6:** "Esto combina típicamente con TypeScript que nos da tipos estáticos - tanto Zod como TypeScript trabajan juntos para asegurar que los datos que manejamos son siempre del tipo correcto."  
  **Dirígete a:** [`frontend/tsconfig.json`](../../frontend/tsconfig.json) y [`frontend/src/vite-env.d.ts`](../../frontend/src/vite-env.d.ts)  
  **Acción en pantalla:** finaliza mostrando el tipado del proyecto.

**📁 Archivos de validación:**
- ✅ Esquema Pedido: [`frontend/src/schemas/orderValidation.ts`](../../frontend/src/schemas/orderValidation.ts)
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
  
- ✅ Esquema Auth: [`frontend/src/schemas/orderValidation.ts`](../../frontend/src/schemas/orderValidation.ts)
  ```typescript
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  });
  ```

- 🔤 Tipos TypeScript: [`frontend/src/vite-env.d.ts`](../../frontend/src/vite-env.d.ts) y tipos inferidos en componentes
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
- **Frase 1:** "Para resumir, el frontend de RealPrint usa React con hooks para componentes funcionales, TypeScript para seguridad de tipos, Zod para validación robusta, React Context para estado global, y una estructura modular con separación clara entre páginas, componentes y servicios."  
  **Dirígete a:** [`frontend/package.json`](../../frontend/package.json), [`frontend/src/context/AuthContext.tsx`](../../frontend/src/context/AuthContext.tsx), [`frontend/src/schemas/orderValidation.ts`](../../frontend/src/schemas/orderValidation.ts), [`frontend/src/services/index.ts`](../../frontend/src/services/index.ts)  
  **Acción en pantalla:** resume abriendo las piezas clave del frontend.
- **Frase 2:** "Esto hace el código mantenible, escalable y seguro."  
  **Dirígete a:** [`frontend/src/App.tsx`](../../frontend/src/App.tsx)  
  **Acción en pantalla:** enseña la estructura general una última vez.
- **Frase 3:** "Si quieres ver el backend o tener más detalles, déjame comentarios."  
  **Dirígete a:** [`backend/src/main/java/com/realprint/realprintbackend/controller/`](../../backend/src/main/java/com/realprint/realprintbackend/controller/)  
  **Acción en pantalla:** conecta con el lado servidor.
- **Frase 4:** "¡Gracias!"  
  **Dirígete a:** vista general del proyecto  
  **Acción en pantalla:** cierra con una visión global del repositorio.

**📁 Resumen de tecnologías:**
- ⚛️ **React 18**: Componentes funcionales con hooks
- 🔤 **TypeScript**: Tipado estático
- ✅ **Zod**: Validación de datos
- 🎯 **React Context**: Estado global (auth)
- 🛣️ **React Router**: Navegación
- 🎨 **Tailwind CSS**: Estilos (config: [`frontend/tailwind.config.js`](../../frontend/tailwind.config.js))
- ✨ **Vite**: Build tool (config: [`frontend/vite.config.js`](../../frontend/vite.config.js))

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

### Video 1: Motivacion + Interfaz (5 min)
| Tiempo | Sección | Duración |
|--------|---------|----------|
| 0:00 - 1:00 | Problema + Motivacion | 1m |
| 1:00 - 2:00 | Login y Roles | 1m |
| 2:00 - 3:20 | Cliente → Nuevo Pedido | 1m 20s |
| 3:20 - 4:40 | Admin → Gestion Pedidos | 1m 20s |
| 4:40 - 5:00 | Cierre y puente al codigo | 20s |

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
│   │   ├── Login.tsx                   [Video 1: 1:00-2:00] [Video 2: 1:15-2:00]
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx      [Video 1: 3:20-4:40]
│   │   │   └── AdminPedidos.tsx        [Video 1: 3:20-4:40]
│   │   └── cliente/
│   │       ├── ClienteDashboard.tsx    [Video 1: 2:00-3:20] [Video 2: 2:00-3:05]
│   │       └── LinearPedidoEditor.tsx  [Video 1: 2:00-3:20]
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
| **Motivacion del Proyecto** | `docs/md/Memoria_Final.md` (1.1, 1.2) | V1 | 0:00-1:00 |
| **Login / Autenticacion** | UI login + `LoginForm.tsx`, `AuthContext.tsx`, `ProtectedRoute.tsx` | V1, V2 | 1:00-2:00, 1:15-2:00 |
| **Dashboard Admin** | `AdminDashboard.tsx`, `AdminPedidos.tsx` | V1 | 3:20-4:40 |
| **Dashboard Cliente** | `ClienteDashboard.tsx` | V1, V2 | 2:00-3:20, 2:00-3:05 |
| **Crear Pedido** | `LinearPedidoEditor.tsx`, `pedido.schema.ts` | V1, V2 | 2:00-3:20, 3:50-4:30 |
| **Subir Archivo** | UI adjuntos + `api.ts` | V1 | 2:00-3:20 |
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
