# 📖 Referencia de APIs y Componentes

**Última actualización:** 2026-03-22

---

## 🎣 Custom Hooks

### usePagination

Manejo de paginación con estado.

```javascript
import { usePagination, PaginationControls } from '@/hooks';

const {
  currentPage,
  totalPages,
  paginatedItems,
  goToPage,
  nextPage,
  prevPage,
  pageInfo,
} = usePagination(data, itemsPerPage);
```

**Parámetros:**
- `data` (array): Items a paginar
- `itemsPerPage` (number): Default 25

**Retorna:**
- `pageInfo`: { currentPage, totalPages, hasNextPage, hasPrevPage, ... }
- `paginatedItems`: Array de items de la página actual
- Métodos de navegación: `goToPage()`, `nextPage()`, `prevPage()`

---

### useData

Acceso al contexto global de datos.

```javascript
import { useData } from '@/context';

const {
  pedidos,
  inventario,
  usuarios,
  updatePedido,
  addInventario,
  getEstadisticas,
} = useData();
```

---

### useApiStatus

Manejo de estado de carga/error en operaciones async.

```javascript
const { isLoading, error, setLoading, setError } = useApiStatus();

const handleCreate = async () => {
  setLoading(true);
  try {
    await service.create(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

### useLogin

Hook para autenticación.

```javascript
const { login, logout, user, isAuthenticated, loading } = useLogin();

const handleLogin = async (username, password) => {
  await login(username, password);
};
```

---

## 🧩 Componentes UI

### ErrorBoundary

Captura errores de componentes hijos.

```jsx
<ErrorBoundary 
  name="MiComponente"
  onReset={() => console.log('Reset')}
>
  <MiComponenteComplejo />
</ErrorBoundary>
```

**Props:**
- `name` (string): Identificador del boundary
- `fallback` (JSX): Custom fallback UI
- `onReset` (function): Callback en reset

---

### Table (Componente UI básico)

Tabla reutilizable sin paginación integrada.

```jsx
<Table
  columns={[
    { key: 'id', header: 'ID' },
    { key: 'nombre', header: 'Nombre' },
  ]}
  data={items}
/>
```

---

### TableWithPagination

Tabla con paginación integrada (memoizada).

```jsx
<TableWithPagination
  columns={[
    { key: 'id', header: 'ID' },
    { 
      key: 'estado', 
      header: 'Estado',
      render: (val) => <Badge>{val}</Badge>
    },
  ]}
  data={pedidos}
  itemsPerPage={25}
  onRowClick={(row) => navigate(`/pedido/${row.id}`)}
  loading={isLoading}
  empty="No hay pedidos"
/>
```

**Props:**
- `columns` (array): Definición de columnas
- `data` (array): Datos a mostrar
- `itemsPerPage` (number): Default 25
- `onRowClick` (function): Click en fila
- `loading` (boolean): Muestra skeleton
- `empty` (string): Mensaje sin datos

---

### PaginationControls

Controles de paginación reutilizables.

```jsx
<PaginationControls 
  pageInfo={pageInfo} 
  onPageChange={(page) => goToPage(page)} 
/>
```

**Props:**
- `pageInfo` (object): Info de paginación
- `onPageChange` (function): Callback de cambio

---

### ErrorFallback

UI elegante cuando hay error (usada por ErrorBoundary).

```jsx
<ErrorFallback 
  error={error}
  resetErrorBoundary={() => window.location.reload()}
/>
```

---

## 🛠️ Servicios

### logger

Sistema centralizado de logging.

```javascript
import { logger } from '@/services';

// Diferentes niveles
logger.debug('Mensaje debug', { extra: 'data' });
logger.info('Acción ejecutada', { userId: 1 });
logger.warn('Advertencia', { field: 'email' });
logger.error('Error', { error: 'details' });
logger.fatal('Error fatal', { critical: true });

// Métodos útiles
const logs = logger.getLogs();           // Todos los logs
const errors = logger.getLogs('ERROR');  // Solo errores
const json = logger.exportLogs();        // Exportar JSON
logger.clearLogs();                      // Limpiar
```

---

### validators

Validadores reutilizables.

```javascript
import {
  isRequired,
  isEmail,
  isPhone,
  isMinLength,
  isUsername,
  isStrongPassword,
  validateLoginForm,
  validatePedidoForm,
  validateUsuarioForm,
  validateInventarioForm,
} from '@/utils/validators';

// Primitivos
if (!isEmail(email)) errors.email = 'Invalid';

// De formulario
const result = validatePedidoForm({
  cliente: 'Juan',
  cantidad: 50,
});

if (!result.isValid) {
  console.log(result.errors);
}
```

**Validadores disponibles:**
- `isRequired(value)`
- `isEmail(value)`
- `isPhone(value)`
- `isMinLength(value, min)`
- `isMaxLength(value, max)`
- `isMinNumber(value, min)`
- `isMaxNumber(value, max)`
- `isUsername(value)` - 3-20 chars, alfanumérico
- `isStrongPassword(value)` - 8+ con símbolos
- `isEnum(value, options)` - Valor permitido
- Y más...

---

### authService

Autenticación.

```javascript
import { authService } from '@/services';

const { user, token } = await authService.login(username, password);
await authService.logout();
const user = authService.getCurrentUser();
```

---

### API Services

Pedidos, inventario, usuarios, etc.

```javascript
import {
  pedidosService,
  inventarioService,
  usuariosService,
} from '@/services';

// Crear
const pedido = await pedidosService.create({ cliente: 'Juan' });

// Actualizar
await pedidosService.update(id, { estado: 'completado' });

// Eliminar
await pedidosService.remove(id);

// Listar
const pedidos = await pedidosService.list();
```

---

## 🎨 Context & State

### DataContext

Acceso a todos los dominios.

```javascript
const data = useContext(DataContext);

// Disponibles:
data.pedidos              // array
data.setPedidos           // setter
data.addPedido            // agregar
data.updatePedido         // actualizar
data.updatePedidoSafe     // con fallback
data.deletePedido         // eliminar
// ... y más para otros dominios
```

### AuthContext

Autenticación.

```javascript
const {
  user,
  isAuthenticated,
  login,
  logout,
  loading,
} = useContext(AuthContext);
```

---

## 🔌 Performance Utilities

### lazyLoad

Code splitting automático.

```javascript
import { lazyLoad } from '@/hooks/usePerformance';

const AdminPedidos = lazyLoad(() => import('./pages/admin/AdminPedidos'));

// En rutas:
<Route path="pedidos" element={<AdminPedidos />} />
```

---

### useIntersectionObserver

Lazy load cuando elemento es visible.

```javascript
import { useIntersectionObserver } from '@/hooks/usePerformance';

const { ref, isVisible } = useIntersectionObserver();

return (
  <div ref={ref}>
    {isVisible && <ExpensiveComponent />}
  </div>
);
```

---

## 📦 Tipos de Props (JSDoc)

Todos los componentes principales tienen tipos JSDoc:

```javascript
/**
 * @param {Object} props
 * @param {Array} props.data - Datos a mostrar
 * @param {number} props.itemsPerPage - Items por página (default 25)
 * @param {Function} props.onRowClick - Click en fila
 * @returns {JSX.Element}
 */
```

---

## 🧪 Testing Ejemplos

### Test un hook

```javascript
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '@/hooks';

it('debe paginar items', () => {
  const { result } = renderHook(() => 
    usePagination(items, 25)
  );

  expect(result.current.totalPages).toBe(4);
  
  act(() => {
    result.current.nextPage();
  });

  expect(result.current.currentPage).toBe(2);
});
```

### Test un componente

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '@/components/MyComponent';

it('debe renderizar', () => {
  render(<MyComponent />);
  expect(screen.getByText('Texto')).toBeInTheDocument();
});
```

---

## 🔍 Debugging

### Ver logs en consola
```javascript
import { logger } from '@/services';

// Ver todos los logs en consola
console.log(logger.getLogs());

// Filtrar por nivel
console.log(logger.getLogs('ERROR'));
```

### Devtools React
```bash
# Instalar extensión React DevTools
# Chrome: react-devtools extension
# Firefox: react-devtools add-on
```

### Testing UI
```bash
npm run test:ui
# Abre: http://localhost:51204
```

---

## 📚 Más Información

- **GUIA_INSTALACION.md** - Cómo instalar y configurar
- **REFERENCIA_RAPIDA.md** - Shortcuts y comandos
- **GUIA_FUNCIONAL_FRONTEND.md** - Features en detalle

---

**¡Listo para desarrollar! 🚀**

