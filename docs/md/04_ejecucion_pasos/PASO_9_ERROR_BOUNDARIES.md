# ✅ PASO 9 - Error Boundaries

**Fecha:** 2026-03-23  
**Duración estimada:** 2 horas  
**Objetivo:** Implementar Error Boundaries para capturar errores de componentes y mejorar la resiliencia

---

## 🎯 QUÉ SE HARÁ

Crear una estructura robusta de Error Boundaries para:
- ✅ Capturar errores de componentes React
- ✅ Mostrar interfaz amigable cuando algo falla
- ✅ Registrar errores en el logger
- ✅ Permitir recuperación sin recargar la página
- ✅ Proteger rutas específicas

---

## 🚀 EJECUCIÓN PASO A PASO

### Paso 9.1: Crear componente base ErrorBoundary (30 min)

Crear el archivo `src/components/ErrorBoundary.jsx`:

```javascript
// App-RealPrint/src/components/ErrorBoundary.jsx
import React from 'react';
import { logger } from '../services/logger.js';

/**
 * Error Boundary - Captura errores de componentes hijos
 *
 * Uso:
 * <ErrorBoundary>
 *   <MiComponente />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Guardar error en state
    this.setState({
      error,
      errorInfo,
    });

    // Registrar en logger
    logger.error('Error capturado por ErrorBoundary', {
      message: error.message,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    // En producción, enviar a servicio de error tracking
    if (process.env.NODE_ENV === 'production') {
      // await fetch('/api/errors', { method: 'POST', body: ... })
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            {/* Icono de error */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
            </div>

            {/* Título */}
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Algo salió mal
            </h1>

            {/* Descripción */}
            <p className="text-center text-gray-600 mb-6">
              Lo sentimos, encontramos un error inesperado. Por favor, intenta de nuevo.
            </p>

            {/* Error Details (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded border border-gray-300">
                <p className="text-sm font-mono text-gray-700 break-words">
                  <strong>Error:</strong> {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2 text-xs">
                    <summary className="cursor-pointer font-bold">
                      Stack de componentes
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-50 overflow-auto text-gray-600">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Intentar de nuevo
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded transition"
              >
                Ir al inicio
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-500 text-xs mt-6">
              Error ID: {new Date().getTime()}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**Validación:**
```bash
npm run dev
# No debe haber errores de compilación
```

---

### Paso 9.2: Crear ErrorFallback para rutas específicas (20 min)

Crear `src/components/ErrorFallback.jsx`:

```javascript
// App-RealPrint/src/components/ErrorFallback.jsx
import { useNavigate } from 'react-router-dom';
import { logger } from '../services/logger.js';

/**
 * Componente de fallback para errores en rutas específicas
 * Más ligero que ErrorBoundary, para uso directo
 */
export function ErrorFallback({ error, resetError }) {
  const navigate = useNavigate();

  const handleReset = () => {
    logger.info('Error fallback reset');
    if (resetError) resetError();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Error en la página
        </h1>

        <p className="text-center text-gray-600 mb-6">
          No pudimos cargar esta sección. Intenta de nuevo o vuelve al inicio.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <div className="mb-6 p-4 bg-gray-100 rounded border border-gray-300">
            <p className="text-sm font-mono text-gray-700 break-words">
              {error.message}
            </p>
          </div>
        )}

        <button
          onClick={handleReset}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
```

---

### Paso 9.3: Envolver App.jsx con ErrorBoundary (20 min)

Actualizar `src/App.jsx`:

```javascript
// App-RealPrint/src/App.jsx
import ErrorBoundary from './components/ErrorBoundary';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// ... otros imports ...

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Rutas protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  {/* Más rutas internas... */}
                </Route>
              </Route>

              {/* Ruta 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
```

---

### Paso 9.4: ErrorBoundary para DashboardLayout (20 min)

Actualizar o crear `src/components/layout/DashboardLayout.jsx`:

```javascript
// App-RealPrint/src/components/layout/DashboardLayout.jsx
import ErrorBoundary from '../ErrorBoundary';
import Navigation from './Navigation';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="flex-1">
        <ErrorBoundary>
          <main className="p-6">
            <Outlet />
          </main>
        </ErrorBoundary>
      </div>
    </div>
  );
}
```

---

### Paso 9.5: Crear página 404 personalizada (20 min)

Crear `src/pages/NotFoundPage.jsx`:

```javascript
// App-RealPrint/src/pages/NotFoundPage.jsx
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <h1 className="text-9xl font-bold">404</h1>
        <p className="text-2xl font-semibold mt-4">Página no encontrada</p>
        <p className="text-blue-100 mt-2 mb-8">
          Lo sentimos, la página que buscas no existe.
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
```

---

### Paso 9.6: Tests para ErrorBoundary (30 min)

Crear `src/components/__tests__/ErrorBoundary.test.jsx`:

```javascript
// App-RealPrint/src/components/__tests__/ErrorBoundary.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../ErrorBoundary';

// Componente que lanza error
function ThrowError() {
  throw new Error('Test error');
}

// Componente OK
function GoodComponent() {
  return <div>Todo bien</div>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Silenciar console.error para tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('debe renderizar componentes hijos sin error', () => {
    render(
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Todo bien')).toBeInTheDocument();
  });

  it('debe capturar errores y mostrar fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
  });

  it('debe tener botón para reintentar', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    const button = screen.getByRole('button', { name: /Intentar de nuevo/i });
    expect(button).toBeInTheDocument();
  });

  it('debe mostrar detalles de error en desarrollo', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Test error/)).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });
});
```

---

### Paso 9.7: Pruebas manuales (20 min)

```bash
cd "D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\App-RealPrint"

# 1. Iniciar aplicación
npm run dev
# → http://localhost:5173

# 2. Navegar a ruta inexistente
# → http://localhost:5173/pagina-inexistente
# Debe mostrar página 404

# 3. Verificar que las páginas normales funcionan
# → http://localhost:5173/
# Debe mostrar dashboard normal

# 4. En consola del navegador (F12)
# → Verificar que no hay errores críticos

# 5. Ejecutar tests
npm test
# Todos los tests deben pasar incluyendo ErrorBoundary.test.jsx
```

---

## ✅ CHECKLIST DE COMPLETITUD

- [ ] `src/components/ErrorBoundary.jsx` creado
- [ ] `src/components/ErrorFallback.jsx` creado  
- [ ] `src/App.jsx` envuelto con ErrorBoundary
- [ ] `src/components/layout/DashboardLayout.jsx` con ErrorBoundary anidado
- [ ] `src/pages/NotFoundPage.jsx` creada y ruteada
- [ ] `src/components/__tests__/ErrorBoundary.test.jsx` con tests
- [ ] Todos los tests pasan (npm test)
- [ ] Build sin errores (npm run build)
- [ ] Lint sin errores (npm run lint)
- [ ] Pruebas manuales completadas

---

## 📊 RESUMEN PASO 9

| Componente | Líneas | Propósito |
|-----------|--------|----------|
| ErrorBoundary | ~120 | Captura errores globales |
| ErrorFallback | ~60 | Fallback ligero para rutas |
| NotFoundPage | ~40 | Página 404 personalizada |
| ErrorBoundary.test | ~80 | Tests de cobertura |
| **TOTAL** | **~300** | **Error handling robusto** |

---

## 🎯 PRÓXIMO PASO

**PASO 10: Performance - Paginación en Tablas** (3 horas)
- Implementar paginación en Admin Pedidos
- Implementar paginación en Admin Inventario  
- Implementar paginación en Admin Usuarios
- Usar custom hook `usePagination`

---

## 📝 NOTAS IMPORTANTES

1. **Error Boundaries solo capturan errores de render**
   - No capturan: eventos, async/await, timeouts
   - Para esos casos, usar try/catch tradicional

2. **Development vs Production**
   - En desarrollo: muestra stack trace completo
   - En producción: mensaje amigable sin detalles técnicos

3. **Logging**
   - Todos los errores se registran en `logger`
   - Admin puede ver logs en `/admin/logs`

4. **Recuperación**
   - Botón "Intentar de nuevo" para reintentar
   - Botón "Ir al inicio" para ir al dashboard
   - Prevenir loops infinitos de errores

---

**Status:** 🟡 En Ejecución  
**Completado:** Documentación paso 9  
**Próximo:** Implementar paso 9

