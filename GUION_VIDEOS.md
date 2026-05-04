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

---

### **[0:30-1:45] Flujo 1: Login (1 minuto 15 seg)**

**Lo que se ve:**
1. Pantalla de login completa
2. Ingreso de credenciales (usuario: `admin` / contraseña: `admin123`)
3. Animación de carga
4. Redirección a dashboard

**Lo que se dice:**
> "Empecemos con el **login**. La aplicación tiene dos tipos de usuarios: administradores y clientes. Vamos a ingresar con credenciales de admin. Como ves, la interfaz tiene un diseño moderno con gradientes y elementos decorativos. El formulario valida que ingresemos datos válidos antes de enviar. Una vez autenticado, el backend nos devuelve un token JWT que se almacena en localStorage, y la aplicación nos redirige automáticamente al dashboard correspondiente según nuestro rol."

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

---

### **[4:30-5:00] Resumen y Mejores Prácticas (30 seg)**

**Lo que se dice:**
> "Para resumir, el frontend de RealPrint usa **React** con hooks para componentes funcionales, **TypeScript** para seguridad de tipos, **Zod** para validación robusta, **React Context** para estado global, y una **estructura modular** con separación clara entre páginas, componentes y servicios. Esto hace el código **mantenible, escalable y seguro**. Si quieres ver el **backend** o tener más detalles, déjame comentarios. ¡Gracias!"

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

## 🔗 Recursos en el Proyecto

### Archivos Clave a Mostrar (Video 2)
```
frontend/src/
├── pages/
│   ├── Login.tsx                      ← Página de login
│   ├── admin/
│   │   ├── AdminDashboard.tsx         ← Dashboard admin
│   │   └── AdminPedidos.tsx           ← Gestión de pedidos
│   └── cliente/
│       ├── ClienteDashboard.tsx       ← Dashboard cliente
│       └── LinearPedidoEditor.tsx     ← Crear pedido
├── components/
│   ├── LoginForm.tsx                  ← Formulario login
│   ├── PedidoCard.tsx                 ← Card de pedido
│   └── ...
├── services/
│   ├── api.ts                         ← Todas las llamadas API
│   └── ...
├── context/
│   └── AuthContext.tsx                ← Estado de auth
├── schemas/
│   └── pedido.schema.ts               ← Validaciones Zod
└── hooks/
    └── ...
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

## 📌 Notas Finales

- **Duración**: Respeta los 5 min por video. Si algo no cabe, prepara versión extendida.
- **Claridad**: Habla lentamente, hace pausas entre conceptos.
- **Visualización**: En video 2, es importante que el code sea legible (zoom grande).
- **Tono**: Profesional pero cercano. Eres explicando a un compañero.
- **Flujo**: Los dos videos son complementarios - Video 1 muestra QUÉ hace, Video 2 muestra CÓMO lo hace.

---

¡Listo! Ya tienes todo lo que necesitas para grabar. Buena suerte con los videos 🎬

