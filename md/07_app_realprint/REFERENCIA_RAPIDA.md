# ⚡ REFERENCIA RÁPIDA - RealPrint Frontend

**Para:** Búsquedas rápidas durante desarrollo  
**Última actualización:** 2026-03-22

---

## 🚀 COMANDOS ESENCIALES

```bash
# Desarrollo local
cd "D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\App-RealPrint"
npm run dev                    # Inicia servidor dev en http://localhost:5173

# Build y validación
npm run lint                   # Ejecuta ESLint
npm run build                  # Build producción (DEBE ejecutar lint antes)
npm test                       # Tests (Vitest, cuando esté instalado)
npm run test:ui               # Tests con UI (Vitest, cuando esté instalado)
npm run test:coverage         # Coverage report (Vitest, cuando esté instalado)

# Preview
npm run preview               # Previsualiza build producción
```

---

## 📂 ESTRUCTURA DE CARPETAS

```
App-RealPrint/
├─ src/
│  ├─ pages/                  # Pantallas por rol
│  │  ├─ Login.jsx
│  │  ├─ Configuracion.jsx
│  │  ├─ admin/               # Admin dashboard y CRUDs
│  │  ├─ cliente/             # Cliente dashboard
│  │  └─ operario/            # Operario dashboard
│  │
│  ├─ components/             # Componentes React
│  │  ├─ ui/                  # Componentes UI reutilizables
│  │  │  ├─ Badge.jsx
│  │  │  ├─ Button.jsx
│  │  │  ├─ Modal.jsx
│  │  │  ├─ Table.jsx
│  │  │  ├─ Input.jsx
│  │  │  ├─ Select.jsx
│  │  │  ├─ Textarea.jsx
│  │  │  ├─ GlassCard.jsx
│  │  │  ├─ StatCard.jsx
│  │  │  └─ index.js (barrel export)
│  │  │
│  │  ├─ layout/              # Componentes de layout
│  │  │  ├─ DashboardLayout.jsx
│  │  │  ├─ Sidebar.jsx
│  │  │  └─ ProtectedRoute.jsx
│  │  │
│  │  └─ [otros].jsx          # Componentes específicos
│  │
│  ├─ hooks/                  # Custom hooks
│  │  ├─ useLogin.js
│  │  ├─ usePedidosData.js
│  │  ├─ useInventarioData.js
│  │  ├─ useUsuariosData.js
│  │  ├─ useTareasData.js
│  │  ├─ useProductosData.js
│  │  ├─ useApiStatus.js
│  │  └─ useLocalStorageState.js
│  │
│  ├─ context/               # Context API
│  │  ├─ AuthContext.jsx
│  │  ├─ DataContext.jsx
│  │  ├─ DataContextCore.jsx
│  │  ├─ DataProviderBridge.jsx
│  │  │
│  │  └─ data/               # Módulos de datos
│  │     ├─ pedidosDomain.js
│  │     ├─ inventarioDomain.js
│  │     ├─ usuariosDomain.js
│  │     ├─ tareasDomain.js
│  │     ├─ productosDomain.js
│  │     ├─ catalogosDomain.js
│  │     ├─ estadisticasDomain.js
│  │     ├─ createDataValue.js
│  │     ├─ useDataState.js
│  │     ├─ useDataDomains.js
│  │     ├─ useLocalStorageState.js
│  │     ├─ dataConfig.js
│  │     ├─ uiContracts.js
│  │     ├─ initialData.js
│  │     ├─ *.test.js         # Tests unitarios
│  │     └─ pedidosDomain.test.js
│  │
│  ├─ services/              # Servicios HTTP y lógica
│  │  ├─ httpClient.js        # Cliente HTTP centralizado
│  │  ├─ authService.js       # Autenticación
│  │  ├─ pedidosService.js    # CRUD pedidos
│  │  ├─ inventarioService.js # CRUD inventario
│  │  ├─ usuariosService.js   # CRUD usuarios
│  │  ├─ tokenStorage.js      # Persistencia de token
│  │  ├─ errors.js            # Clasificación de errores
│  │  ├─ logger.js            # [PRÓXIMO] Logging centralizado
│  │  └─ index.js             # Barrel export
│  │
│  ├─ utils/                 # Utilidades
│  │  ├─ validators.js        # Validación de datos
│  │  └─ errorHandler.js      # Manejo de errores
│  │
│  ├─ test/                  # [PRÓXIMO] Setup de tests
│  │  └─ setup.js
│  │
│  ├─ assets/                # Recursos estáticos
│  │  └─ react.svg
│  │
│  ├─ App.jsx                # Componente raíz
│  ├─ App.css
│  ├─ main.jsx               # Entry point
│  └─ index.css              # Estilos globales
│
├─ public/                   # Archivos públicos
│  ├─ index.html
│  └─ vite.svg
│
├─ package.json              # Dependencias npm
├─ vite.config.js            # Configuración Vite
├─ vitest.config.js          # [PRÓXIMO] Configuración Vitest
├─ tailwind.config.js        # Configuración Tailwind
├─ postcss.config.js         # Configuración PostCSS
├─ eslint.config.js          # Configuración ESLint
├─ eslint.config.ts          # (legacy, usar .js)
├─ .env                       # Variables de entorno (NO COMMITAR)
├─ .env.example              # [PRÓXIMO] Template de .env
├─ .gitignore
├─ README.md
└─ netlify.toml              # Configuración Netlify
```

---

## 🔐 VARIABLES DE ENTORNO (.env)

```bash
# API
VITE_API_URL=http://localhost:8080/api
VITE_API_TIMEOUT=10000

# Autenticación
VITE_USE_LOCAL_AUTH=true                    # true = demo local | false = API

# Feature flags por servicio (VITE_USE_*_SERVICE_CREATE/UPDATE/DELETE)
VITE_USE_PEDIDOS_SERVICE_CREATE=false
VITE_USE_PEDIDOS_SERVICE_UPDATE=false
VITE_USE_PEDIDOS_SERVICE_DELETE=false

VITE_USE_INVENTARIO_SERVICE_CREATE=false
VITE_USE_INVENTARIO_SERVICE_UPDATE=false
VITE_USE_INVENTARIO_SERVICE_DELETE=false

VITE_USE_USUARIOS_SERVICE_CREATE=false
VITE_USE_USUARIOS_SERVICE_UPDATE=false
VITE_USE_USUARIOS_SERVICE_DELETE=false

# Cuando backend esté listo:
# VITE_USE_LOCAL_AUTH=false
# VITE_USE_*_SERVICE_CREATE/UPDATE/DELETE=true
```

---

## 🎨 COLORES Y TOKENS

### Tokens Centralizados (Single Source of Truth)

**Archivo:** `tailwind.config.js` (línea ~28)

```javascript
sidebar: {
  light: "#2563eb",    // primary-600 (gradient end)
  mid: "#1d4ed8",      // primary-700 (gradient mid)
  dark: "#1e3a8a",     // primary-900 (gradient start)
}
```

**Variables CSS derivadas:** `src/index.css` (línea ~8)

```css
--primary-blue: #2563eb
--primary-blue-light: #3b82f6
--primary-blue-dark: #1d4ed8
--sidebar-start: #1e3a8a
--sidebar-mid: #1d4ed8
--sidebar-end: #2563eb
```

**Uso en componentes:**
```jsx
<div className="bg-primary-600">...</div>
<div className="from-blue-900 to-blue-600 bg-gradient-to-b">...</div>
<div className="shadow-sidebar">...</div>
```

👉 **Para cambiar el azul:** Editar `tailwind.config.js` línea 28 + `src/index.css` línea 8-15

---

## 🔑 AUTENTICACIÓN

### Usuarios Demo (VITE_USE_LOCAL_AUTH=true)

```javascript
// Credenciales de prueba (en datosIniciales)
Admin:
  username: "admin"
  role: "admin"

Cliente:
  username: "cliente"
  role: "cliente"

Operario:
  username: "operario"
  role: "operario"
```

### Flow de Auth

```
Login Form → authService.login() → { user, token }
                                         ↓
                                  localStorage:
                                  - realprint_token
                                  - realprint_user
                                         ↓
                                   AuthContext
                                   (useAuth hook)
                                         ↓
                                  ProtectedRoute
                                  (valida rol)
```

### Acceder al usuario actual

```javascript
import { useAuth } from '../context/AuthContext';

export function MyComponent() {
  const { user, token, login, logout } = useAuth();
  
  return <div>{user?.username}</div>;
}
```

---

## 📋 CONTEXTOS DISPONIBLES

### AuthContext (Autenticación)

```javascript
import { useAuth } from '../context/AuthContext';

const {
  user,                    // { id, username, name, role }
  token,                   // JWT token
  login,                   // async (username, password) => { success, user/error }
  logout,                  // () => void
  loading,                 // boolean
  error,                   // string | null
  isAuthenticated,         // boolean
  isTokenValid,            // () => boolean
} = useAuth();
```

### DataContext (Datos)

```javascript
import { useData } from '../context/DataContext';

const {
  // Pedidos
  pedidos,
  addPedido,
  updatePedido,
  deletePedido,
  createPedidoSafe,        // safe wrapper
  updatePedidoSafe,        // safe wrapper
  deletePedidoSafe,        // safe wrapper
  
  // Inventario
  inventario,
  addInventario,
  updateInventario,
  deleteInventario,
  addInventarioSafe,       // safe wrapper
  updateInventarioSafe,    // safe wrapper
  deleteInventarioSafe,    // safe wrapper
  
  // Usuarios
  usuarios,
  addUsuario,
  updateUsuario,
  deleteUsuario,
  addUsuarioSafe,          // safe wrapper
  updateUsuarioSafe,       // safe wrapper
  deleteUsuarioSafe,       // safe wrapper
  
  // Tareas
  tareas,
  updateTarea,
  
  // Productos y catálogos
  productosFinales,
  catalogosEmpresa,
  
  // Utilidades
  getEstadisticas,
} = useData();
```

---

## 🪝 HOOKS ÚTILES

### useLogin (Autenticación simplificada)

```javascript
import { useLogin } from '../hooks/useLogin';

const { login, error, loading } = useLogin();

const handleSubmit = async (username, password) => {
  await login(username, password);
  // Se redirige automáticamente si es exitoso
};
```

### usePedidosData (Pedidos)

```javascript
import { usePedidosData } from '../hooks/usePedidosData';

const {
  pedidos,
  loading,
  error,
  crear,
  actualizar,
  eliminar,
} = usePedidosData();
```

### useInventarioData (Inventario)

```javascript
import { useInventarioData } from '../hooks/useInventarioData';

const {
  inventario,
  loading,
  error,
  crear,
  actualizar,
  eliminar,
} = useInventarioData();
```

### useApiStatus (Estados de carga/error)

```javascript
import { useApiStatus } from '../hooks/useApiStatus';

const { isLoading, error, isSuccess } = useApiStatus(
  async () => {
    return await fetch('/api/endpoint').then(r => r.json());
  },
  { cache: 5000 } // cachea 5s
);
```

---

## 🔌 COMPONENTES UI

### Badge

```jsx
<Badge variant="success" label="Completado" />
<Badge variant="warning" label="En proceso" />
<Badge variant="danger" label="Cancelado" />
```

### Button

```jsx
<Button variant="primary" onClick={handleClick}>
  Guardar
</Button>
<Button variant="secondary" size="sm">
  Cancelar
</Button>
<Button variant="danger" disabled>
  Eliminar
</Button>
```

### Input

```jsx
<Input
  type="text"
  label="Nombre"
  placeholder="Ingrese nombre"
  error={errors.nombre}
  value={formData.nombre}
  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
/>
```

### Modal

```jsx
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirmar">
  <p>¿Estás seguro?</p>
  <Button onClick={handleConfirm}>Sí, continuar</Button>
</Modal>
```

### Table

```jsx
<Table
  columns={[
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'estado', label: 'Estado' },
  ]}
  data={pedidos}
  onRowClick={(pedido) => navigate(`/admin/pedidos/${pedido.id}`)}
/>
```

### Select

```jsx
<Select
  label="Servicio"
  options={[
    { value: 'serigrafia', label: 'Serigrafía' },
    { value: 'rotulacion', label: 'Rotulación' },
  ]}
  value={servicio}
  onChange={setServicio}
/>
```

---

## 🛡️ SERVICIOS HTTP

### httpClient (Cliente HTTP centralizado)

```javascript
import { httpClient } from '../services/httpClient';

// GET
const data = await httpClient.get('/pedidos');

// POST
const result = await httpClient.post('/pedidos', {
  cliente: 'Juan',
  cantidad: 10,
});

// PUT
const updated = await httpClient.put(`/pedidos/${id}`, {
  estado: 'en_proceso',
});

// DELETE
await httpClient.delete(`/pedidos/${id}`);

// Con headers custom
const data = await httpClient.get('/pedidos', {
  headers: { 'X-Custom': 'value' }
});
```

### authService (Autenticación)

```javascript
import { authService } from '../services';

// Login
const { user, token } = await authService.login({
  username: 'admin',
  password: 'password',
});

// Logout
authService.logout();

// Obtener usuario actual
const user = authService.getCurrentUser();

// Verificar si está autenticado
const isAuth = authService.isAuthenticated();
```

### pedidosService, inventarioService, etc.

```javascript
import { pedidosService } from '../services';

// CRUD
const pedidos = await pedidosService.getAll();
const pedido = await pedidosService.getById(id);
const created = await pedidosService.create(data);
const updated = await pedidosService.update(id, data);
await pedidosService.delete(id);

// Safe wrappers (con fallback local)
const result = await pedidosService.createSafe(data);
if (result.success) {
  // Creado en API o guardado localmente
} else {
  // Error
}
```

---

## 📧 VALIDACIÓN

### Validadores disponibles

```javascript
import { validators, validateForm } from '../utils/validators';

// Email
validators.email('user@example.com')  // ✅ valid
validators.email('invalid')          // ❌ error

// Teléfono
validators.phone('666555444')
validators.phone('+34 666 555 444')

// String
validators.string('nombre', { min: 3, max: 50 })

// Number
validators.number(10, { min: 1, max: 100 })

// Enum
validators.enum('admin', { options: ['admin', 'cliente', 'operario'] })

// URL
validators.url('https://example.com')

// Fecha
validators.date('2026-03-22')

// Custom regex
validators.regex('ABC123', { pattern: '^[A-Z]{3}[0-9]{3}$' })

// Validar formulario completo
const validation = validateForm(
  { cliente: 'Juan', cantidad: 10 },
  {
    cliente: (v) => validators.string(v, { min: 3, max: 50 }),
    cantidad: (v) => validators.number(v, { min: 1, max: 10000 }),
  }
);

if (!validation.isValid) {
  console.log(validation.errors);  // { cliente: '', cantidad: 'error...' }
}
```

---

## 🧪 TESTING (Cuando esté instalado)

### Ejecutar tests

```bash
npm test                  # Run all tests
npm test:ui              # Interactive UI
npm test:coverage        # Coverage report
```

### Estructura de un test

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('pedidosDomain', () => {
  let state;

  beforeEach(() => {
    state = {
      pedidos: [{ id: '1', estado: 'pendiente' }],
      setPedidos: vi.fn(),
    };
  });

  it('debe cambiar estado de pedido', () => {
    const pedido = state.pedidos[0];
    expect(pedido.estado).toBe('pendiente');
    
    const actualizado = { ...pedido, estado: 'en_proceso' };
    expect(actualizado.estado).toBe('en_proceso');
  });
});
```

---

## 🐛 DEBUGGING

### Ver localStorage

```javascript
// En navegador console
localStorage.getItem('realprint_token')
localStorage.getItem('realprint_user')
JSON.parse(localStorage.getItem('realprint_pedidos'))
```

### Ver logs (cuando logger esté instalado)

```javascript
import { logger } from '../services/logger';

// Ver todos los logs
logger.getLogs()

// Filtrar por nivel
logger.getLogs('ERROR')

// Exportar
const json = logger.exportLogs()

// Limpiar
logger.clearLogs()
```

### Decodificar JWT

```javascript
function decodeJWT(token) {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
}

const decoded = decodeJWT(localStorage.getItem('realprint_token'));
console.log(decoded);  // { id, username, exp, ... }
```

---

## 📱 BREAKPOINTS TAILWIND

```css
/* Responsive classes: sm: md: lg: xl: 2xl: */
sm:   640px
md:   768px
lg:   1024px
xl:   1280px
2xl:  1536px

/* Ejemplo */
<div className="block md:hidden">    {/* Solo en mobile */}
<div className="hidden md:block">    {/* Solo en desktop */}
<div className="text-sm md:text-base lg:text-lg">  {/* Texto responsivo */}
```

---

## 🚨 ERRORES COMUNES

### "useData debe usarse dentro de DataProvider"
```javascript
// ❌ MALO
const data = useData();  // En componente sin provider

// ✅ BUENO
// En App.jsx
<DataProvider>
  <YourComponent />  {/* Ahora puedes usar useData aquí */}
</DataProvider>
```

### "Cannot update state during render"
```javascript
// ❌ MALO
const [data, setData] = useState(initialData);
setData(newData);  // En render

// ✅ BUENO
useEffect(() => {
  setData(newData);
}, [dependency]);
```

### "Token expired" en API calls
```javascript
// El httpClient chequea automáticamente
// Si token está expirado, borra sesión y redirige a login

// Ver en: src/services/httpClient.js línea ~XXX
```

---

## 🔗 RUTAS PRINCIPALES

```
/                          → Login
/admin                     → Admin Dashboard
/admin/pedidos             → Admin: Listar/crear pedidos
/admin/pedidos/:id         → Admin: Editar pedido
/admin/inventario          → Admin: Gestionar inventario
/admin/usuarios            → Admin: Gestionar usuarios
/admin/productos-finales   → Admin: Gestionar productos
/admin/reportes            → Admin: Reportes

/cliente                   → Cliente Dashboard
/cliente/pedidos           → Cliente: Mis pedidos
/cliente/nuevo-pedido      → Cliente: Crear pedido

/operario                  → Operario Dashboard
/operario/tareas           → Operario: Mis tareas

/configuracion             → Configuración global
```

---

## 📖 DOCUMENTOS PRINCIPALES

| Doc | Para | Ubicación |
|-----|------|-----------|
| VALORACION_ESTADO_ACTUAL.md | Análisis integral completo | Root |
| PLAN_ACCION_INMEDIATO.md | Tareas concretas de las próximas semanas | Root |
| MATRIZ_ESTADO_PROYECTO.md | Métricas y estado visual | Root |
| SESSION_HANDOFF.md | Contexto para siguiente sesión | App-RealPrint/ |
| DESIGN_TOKENS.md | Tokens de color (single source of truth) | App-RealPrint/ |
| INFORME_HARDENING_FINAL.md | Validación de color sidebar | App-RealPrint/ |
| MEJORAS_INMEDIATAS.md | Cambios a implementar en frontend | Root |

---

## 💡 TIPS Y TRUCOS

### Agregar componente nuevo

1. Crear archivo en `src/components/`
2. Exportar en `src/components/index.js` (si es UI)
3. Importar y usar en página

### Agregar página nueva

1. Crear archivo en `src/pages/` (o `src/pages/admin/`, etc.)
2. Agregar ruta en `App.jsx`
3. Proteger con `<ProtectedRoute roles={['admin']}>` si es necesario

### Agregar hook nuevo

1. Crear archivo `src/hooks/useMyHook.js`
2. Usar `useData()`, `useAuth()` dentro si es necesario
3. Exportar en `src/hooks/index.js`
4. Importar en componentes

### Agregar validación

1. Agregar función en `src/utils/validators.js`
2. Usar en formularios con `validateForm()`
3. Mostrar `errors.field` en UI

---

**Última revisión:** 2026-03-22  
**Versión:** 1.0  
**Próxima actualización:** Cuando se agregue Vitest y Logger

