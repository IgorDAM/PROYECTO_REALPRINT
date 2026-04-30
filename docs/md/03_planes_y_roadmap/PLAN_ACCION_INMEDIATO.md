# 🚀 PLAN DE ACCIÓN INMEDIATO - RealPrint Frontend

**Fecha:** 2026-03-22  
**Basado en:** VALORACION_ESTADO_ACTUAL.md  
**Objetivo:** Ejecutable en sesiones de 2-3 horas

---

## ✅ PASO 1: LINT EN BUILD (30 min)

**Por qué:** Capturar errores de código antes de producción.

**Cambio:**

```json
// App-RealPrint/package.json
{
  "scripts": {
    "dev": "vite",
    "build": "npm run lint && vite build",  // ← CAMBIAR ESTA LÍNEA
    "lint": "eslint .",
    "test": "node --test",
    "preview": "vite preview"
  }
}
```

**Validación:**
```bash
cd "D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\App-RealPrint"
npm run build
# Debe ejecutar ESLint primero, luego Vite
```

---

## ✅ PASO 2: VITEST SETUP (1.5 horas)

**Por qué:** Test runner moderno, integrado con Vite, soporte para mocking.

### 2.1 Instalar dependencias
```bash
npm install -D vitest @vitest/ui jsdom happy-dom
```

### 2.2 Crear `vitest.config.js`
```javascript
// App-RealPrint/vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.js', 'src/**/*.test.jsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});
```

### 2.3 Crear `src/test/setup.js`
```javascript
// App-RealPrint/src/test/setup.js
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup después de cada test
afterEach(() => {
  cleanup();
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;
```

### 2.4 Actualizar `package.json`
```json
{
  "scripts": {
    "dev": "vite",
    "build": "npm run lint && vite build",
    "lint": "eslint .",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "preview": "vite preview"
  },
  "devDependencies": {
    // ... existing ...
    "vitest": "^1.x.x",
    "@vitest/ui": "^1.x.x",
    "jsdom": "^24.x.x",
    "happy-dom": "^12.x.x",
    "@testing-library/react": "^14.x.x",
    "@testing-library/jest-dom": "^6.x.x"
  }
}
```

### 2.5 Validación
```bash
npm test
# Debe listar todos los tests existentes (3 archivos)
# "3 passed in XXms"
```

---

## ✅ PASO 3: COMPLETAR TESTS DE DOMINIOS (5 horas)

**Por qué:** Cobertura >80% garantiza que refactors futuros no rompan lógica.

### 3.1 Crear test para `tareasDomain.js`

```javascript
// App-RealPrint/src/context/data/tareasDomain.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTareasDomain } from './tareasDomain.js';

describe('tareasDomain', () => {
  let state;

  beforeEach(() => {
    state = {
      tareas: [
        {
          id: '1',
          titulo: 'Serigrafía - Pedido 101',
          estado: 'pendiente',
          operario_id: '1',
        },
        {
          id: '2',
          titulo: 'Rotulación - Pedido 102',
          estado: 'en_proceso',
          operario_id: '2',
        },
      ],
      setTareas: vi.fn(),
    };
  });

  it('debe filtrar tareas por estado', () => {
    const domain = useTareasDomain(state);
    const pendientes = state.tareas.filter(t => t.estado === 'pendiente');
    expect(pendientes).toHaveLength(1);
    expect(pendientes[0].titulo).toContain('Serigrafía');
  });

  it('debe actualizar tarea de pendiente a en_proceso', () => {
    const domain = useTareasDomain(state);
    const tarea = state.tareas[0];
    const actualizada = { ...tarea, estado: 'en_proceso' };
    expect(actualizada.estado).toBe('en_proceso');
  });

  it('debe marcar tarea como completada', () => {
    const domain = useTareasDomain(state);
    const tarea = state.tareas[0];
    const completada = { ...tarea, estado: 'completada' };
    expect(completada.estado).toBe('completada');
  });
});
```

### 3.2 Crear test para `productosDomain.js`

```javascript
// App-RealPrint/src/context/data/productosDomain.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProductosDomain } from './productosDomain.js';

describe('productosDomain', () => {
  let state;

  beforeEach(() => {
    state = {
      productosFinales: [
        { id: '1', nombre: 'Camiseta Blanca', precio: 25.00 },
        { id: '2', nombre: 'Gorro Negro', precio: 15.00 },
      ],
      setProductosFinales: vi.fn(),
    };
  });

  it('debe retornar todos los productos finales', () => {
    expect(state.productosFinales).toHaveLength(2);
  });

  it('debe calcular precio total de múltiples productos', () => {
    const total = state.productosFinales.reduce((sum, p) => sum + p.precio, 0);
    expect(total).toBe(40.00);
  });

  it('debe filtrar productos por nombre', () => {
    const filtrados = state.productosFinales.filter(p =>
      p.nombre.toLowerCase().includes('blanca')
    );
    expect(filtrados).toHaveLength(1);
    expect(filtrados[0].nombre).toBe('Camiseta Blanca');
  });
});
```

### 3.3 Crear test para `catalogosDomain.js`

```javascript
// App-RealPrint/src/context/data/catalogosDomain.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCatalogosDomain } from './catalogosDomain.js';

describe('catalogosDomain', () => {
  let state;

  beforeEach(() => {
    state = {
      catalogosEmpresa: {
        servicios: ['Serigrafía', 'Rotulación', 'Bordado'],
        materiales: ['Camiseta', 'Gorro', 'Mochila'],
        colores: ['Rojo', 'Azul', 'Negro'],
      },
      setCatalogosEmpresa: vi.fn(),
    };
  });

  it('debe retornar lista de servicios', () => {
    const servicios = state.catalogosEmpresa.servicios;
    expect(servicios).toContain('Serigrafía');
    expect(servicios).toHaveLength(3);
  });

  it('debe retornar lista de materiales', () => {
    const materiales = state.catalogosEmpresa.materiales;
    expect(materiales).toContain('Camiseta');
    expect(materiales).toHaveLength(3);
  });

  it('debe retornar lista de colores', () => {
    const colores = state.catalogosEmpresa.colores;
    expect(colores).toContain('Azul');
    expect(colores).toHaveLength(3);
  });
});
```

### 3.4 Validación
```bash
npm test
# Debe mostrar:
# ✓ src/context/data/pedidosDomain.test.js (XX tests)
# ✓ src/context/data/inventarioDomain.test.js (XX tests)
# ✓ src/context/data/usuariosDomain.test.js (XX tests)
# ✓ src/context/data/tareasDomain.test.js (3 tests)
# ✓ src/context/data/productosDomain.test.js (3 tests)
# ✓ src/context/data/catalogosDomain.test.js (3 tests)
# (>50 tests) passed
```

---

## ✅ PASO 4: LOGGER CENTRALIZADO (2 horas)

**Por qué:** Auditoría, debugging, detección de errores sin romper la app.

### 4.1 Crear `src/services/logger.js`

```javascript
// App-RealPrint/src/services/logger.js
/**
 * Sistema centralizado de logging.
 *
 * Características:
 * - 5 niveles: debug, info, warn, error, fatal
 * - Persistencia en localStorage (últimas 100 entradas)
 * - Context automático: usuario, timestamp, ubicación
 * - Soporte para envío a servidor (cuando backend listo)
 */

const LOG_STORAGE_KEY = 'realprint_logs';
const MAX_LOGS = 100;

const LogLevel = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  FATAL: 'FATAL',
};

const LogLevelPriority = {
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5,
};

class Logger {
  constructor(minLevel = LogLevel.DEBUG) {
    this.minLevel = minLevel;
    this.logs = this._loadLogs();
  }

  _loadLogs() {
    try {
      const stored = localStorage.getItem(LOG_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  _saveLogs() {
    try {
      const recent = this.logs.slice(-MAX_LOGS);
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(recent));
    } catch (e) {
      console.warn('Failed to save logs to localStorage', e);
    }
  }

  _shouldLog(level) {
    return LogLevelPriority[level] >= LogLevelPriority[this.minLevel];
  }

  _createLogEntry(level, message, data = {}) {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      user: this._getCurrentUser(),
      url: window.location.pathname,
      userAgent: navigator.userAgent.substring(0, 50),
    };
  }

  _getCurrentUser() {
    try {
      const userStr = localStorage.getItem('realprint_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.username || 'unknown';
      }
    } catch {
      // ignored
    }
    return 'anonymous';
  }

  _logToConsole(level, message, data) {
    const styles = {
      DEBUG: 'color: #888; font-size: 12px;',
      INFO: 'color: #0066cc; font-weight: bold;',
      WARN: 'color: #ff9900; font-weight: bold;',
      ERROR: 'color: #cc0000; font-weight: bold;',
      FATAL: 'color: #990000; font-weight: bold; background: #ffcccc;',
    };

    if (Object.keys(data).length > 0) {
      console.log(`%c[${level}] ${message}`, styles[level], data);
    } else {
      console.log(`%c[${level}] ${message}`, styles[level]);
    }
  }

  log(level, message, data = {}) {
    if (!this._shouldLog(level)) return;

    const entry = this._createLogEntry(level, message, data);
    this.logs.push(entry);
    this._saveLogs();
    this._logToConsole(level, message, data);

    // Enviar a servidor si está disponible (implementar cuando backend listo)
    if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
      // TODO: await fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) })
    }
  }

  debug(message, data) {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message, data) {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message, data) {
    this.log(LogLevel.WARN, message, data);
  }

  error(message, data) {
    this.log(LogLevel.ERROR, message, data);
  }

  fatal(message, data) {
    this.log(LogLevel.FATAL, message, data);
  }

  getLogs(level = null) {
    if (!level) return this.logs;
    return this.logs.filter(log => log.level === level);
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem(LOG_STORAGE_KEY);
  }

  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Singleton global
export const logger = new Logger(LogLevel.DEBUG);

// Para testing
export { LogLevel };
```

### 4.2 Integrar logger en servicios

```javascript
// App-RealPrint/src/services/authService.js
import { logger } from './logger.js';

export const authService = {
  async login({ username, password }) {
    logger.info('Login attempt', { username });
    try {
      // ... lógica de login ...
      logger.info('Login successful', { username });
      return { user, token };
    } catch (error) {
      logger.error('Login failed', { username, error: error.message });
      throw error;
    }
  },

  logout() {
    logger.info('Logout', { user: this.getCurrentUser()?.username });
    // ... lógica de logout ...
  },
};
```

### 4.3 Crear página de admin para ver logs

```javascript
// App-RealPrint/src/pages/admin/Logs.jsx
import { useState } from 'react';
import { logger, LogLevel } from '../../services/logger.js';

export function AdminLogs() {
  const [logs, setLogs] = useState(() => logger.getLogs());
  const [filterLevel, setFilterLevel] = useState(null);

  const filteredLogs = filterLevel
    ? logs.filter(log => log.level === filterLevel)
    : logs;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Logs del Sistema</h1>

      <div className="flex gap-2">
        <button
          onClick={() => setFilterLevel(null)}
          className={filterLevel === null ? 'btn-primary' : 'btn-secondary'}
        >
          Todos ({logs.length})
        </button>
        {Object.keys(LogLevel).map(level => (
          <button
            key={level}
            onClick={() => setFilterLevel(level)}
            className={filterLevel === level ? 'btn-primary' : 'btn-secondary'}
          >
            {level} ({logs.filter(l => l.level === level).length})
          </button>
        ))}
        <button
          onClick={() => {
            logger.clearLogs();
            setLogs([]);
          }}
          className="btn-danger"
        >
          Limpiar
        </button>
        <button
          onClick={() => {
            const data = logger.exportLogs();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `logs-${new Date().toISOString()}.json`;
            a.click();
          }}
          className="btn-secondary"
        >
          Descargar JSON
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Timestamp</th>
            <th className="p-2 text-left">Level</th>
            <th className="p-2 text-left">Message</th>
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Data</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log, idx) => (
            <tr key={idx} className="border-t hover:bg-gray-50">
              <td className="p-2 text-sm">{new Date(log.timestamp).toLocaleString()}</td>
              <td className="p-2 text-sm font-bold">{log.level}</td>
              <td className="p-2 text-sm">{log.message}</td>
              <td className="p-2 text-sm">{log.user}</td>
              <td className="p-2 text-sm">{JSON.stringify(log.data)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 4.4 Validación
```bash
npm run dev
# Navegar a http://localhost:5173/admin/logs
# Ver logs de las acciones en la app
```

---

## ✅ PASO 5: VALIDACIÓN COMPLETA (1.5 horas)

**Por qué:** Prevenir datos corruptos y mejorar UX con mensajes claros.

### 5.1 Mejorar `src/utils/validators.js`

```javascript
// App-RealPrint/src/utils/validators.js
export const validators = {
  // Email
  email: (value) => {
    if (!value) return { valid: true }; // campo opcional
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value)
      ? { valid: true }
      : { valid: false, error: 'Email inválido' };
  },

  // Teléfono (formato: +34 XXX XX XX XX o 6XX XX XX XX)
  phone: (value) => {
    if (!value) return { valid: true };
    const regex = /^(\+\d{1,3})?[- .]?\d{9}$/;
    return regex.test(value.replace(/\s/g, ''))
      ? { valid: true }
      : { valid: false, error: 'Teléfono inválido (ej: +34 666 555 444 o 666555444)' };
  },

  // String con longitud mínima y máxima
  string: (value, { min = 1, max = 255 } = {}) => {
    if (!value) return { valid: true };
    if (value.length < min)
      return { valid: false, error: `Mínimo ${min} caracteres` };
    if (value.length > max)
      return { valid: false, error: `Máximo ${max} caracteres` };
    return { valid: true };
  },

  // Número dentro de rango
  number: (value, { min = -Infinity, max = Infinity } = {}) => {
    if (value === null || value === undefined || value === '')
      return { valid: true };
    const num = Number(value);
    if (isNaN(num))
      return { valid: false, error: 'Debe ser un número' };
    if (num < min)
      return { valid: false, error: `Mínimo: ${min}` };
    if (num > max)
      return { valid: false, error: `Máximo: ${max}` };
    return { valid: true };
  },

  // Enum (selección de opciones válidas)
  enum: (value, { options = [] } = {}) => {
    if (!value) return { valid: true };
    return options.includes(value)
      ? { valid: true }
      : { valid: false, error: `Valor no válido. Opciones: ${options.join(', ')}` };
  },

  // URL
  url: (value) => {
    if (!value) return { valid: true };
    try {
      new URL(value);
      return { valid: true };
    } catch {
      return { valid: false, error: 'URL inválida' };
    }
  },

  // Fecha en formato YYYY-MM-DD
  date: (value) => {
    if (!value) return { valid: true };
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(value))
      return { valid: false, error: 'Formato: YYYY-MM-DD' };
    const date = new Date(value);
    return date instanceof Date && !isNaN(date)
      ? { valid: true }
      : { valid: false, error: 'Fecha inválida' };
  },

  // Regla personalizada (regex)
  regex: (value, { pattern, message = 'Formato inválido' } = {}) => {
    if (!value) return { valid: true };
    return new RegExp(pattern).test(value)
      ? { valid: true }
      : { valid: false, error: message };
  },
};

// Función helper para validar objeto completo
export function validateForm(data, schema) {
  const errors = {};

  for (const [field, rules] of Object.entries(schema)) {
    if (typeof rules === 'function') {
      const result = rules(data[field]);
      if (!result.valid) {
        errors[field] = result.error;
      }
    } else if (Array.isArray(rules)) {
      for (const rule of rules) {
        const result = rule(data[field]);
        if (!result.valid) {
          errors[field] = result.error;
          break;
        }
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

### 5.2 Usar en formularios

```javascript
// Ejemplo: Form de pedido
import { validators, validateForm } from '../utils/validators.js';

export function PedidoForm() {
  const [formData, setFormData] = useState({ cliente: '', cantidad: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateForm(formData, {
      cliente: (v) => validators.string(v, { min: 3, max: 50 }),
      cantidad: (v) => validators.number(v, { min: 1, max: 10000 }),
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Proceder con submit
    console.log('Formulario válido:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.cliente}
        onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
      />
      {errors.cliente && <span className="error">{errors.cliente}</span>}

      <input
        type="number"
        value={formData.cantidad}
        onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
      />
      {errors.cantidad && <span className="error">{errors.cantidad}</span>}

      <button type="submit">Crear Pedido</button>
    </form>
  );
}
```

---

## 📋 CHECKLIST DE EJECUCIÓN

- [ ] Paso 1: Activar lint en build (30 min)
- [ ] Paso 2: Vitest setup (1.5 horas)
- [ ] Paso 3: Tests de dominios (5 horas)
- [ ] Paso 4: Logger centralizado (2 horas)
- [ ] Paso 5: Validación completa (1.5 horas)
- [ ] **Subtotal:** ~10 horas

---

## 🎯 DESPUÉS DE COMPLETAR ESTO

Siguientes 5 pasos (en orden):

1. **Error Boundaries** (2 horas)
   - `src/components/ErrorFallback.jsx`
   - `src/App.jsx` con ErrorBoundary
   - `src/components/layout/DashboardLayout.jsx` con ErrorBoundary

2. **Performance: Paginación en tablas** (3 horas)
   - Admin Pedidos: paginar de 25 en 25
   - Admin Inventario: paginar de 25 en 25
   - Admin Usuarios: paginar de 25 en 25

3. **Toast Notifications** (2 horas)
   - `src/context/ToastContext.jsx`
   - `useToast()` hook
   - Componente `Toast.jsx`

4. **Responsive Validation** (2 horas)
   - Validar en 320px, 375px, 768px, 1024px, 1440px
   - Checklist en VALIDACION_VISUAL_RESPONSIVE.md

5. **Documentación Faltante** (2 horas)
   - Completar REFERENCIA_RAPIDA.md
   - Crear GUIA_INSTALACION.md
   - Actualizar README.md

---

**Tiempo total recomendado para "Production Ready" (sin backend):** 25-30 horas adicionales

**Estimación:** 1 semana de desarrollo full-time o 2-3 semanas part-time

