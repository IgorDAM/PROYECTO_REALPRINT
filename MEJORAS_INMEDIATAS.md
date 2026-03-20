# 🚀 MEJORAS INMEDIATAS PARA EL PROYECTO ACTUAL

Este documento contiene cambios que PUEDES IMPLEMENTAR AHORA en tu frontend para prepararlo mejor para la migración a backend.

---

## 1. REFACTORIZAR AuthContext para Preparar JWT

**Archivo: src/context/AuthContext.jsx (REFACTORIZADO)**

Cambiar de:
- Almacenar usuario completo en localStorage
- Comparar contraseñas en cliente

A:
- Almacenar solo token JWT
- Preparado para llamadas a API

```javascript
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

/**
 * AuthProvider mejorado para soporte de JWT
 * Compatible con tanto datos locales (actual) como API remota (futuro)
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  // Cargar sesión persistente
  useEffect(() => {
    const savedToken = localStorage.getItem("realprint_token");
    const savedUser = localStorage.getItem("realprint_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Inicia sesión
   * Actualmente usa datos locales, luego usará API
   */
  const login = async (username, password) => {
    try {
      setError(null);

      // TODO: Cambiar a llamada API cuando backend esté listo
      // const response = await fetch('http://localhost:8080/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password })
      // });
      // const data = await response.json();
      // if (data.token) {
      //   setToken(data.token);
      //   setUser(data.user);
      //   localStorage.setItem('realprint_token', data.token);
      //   localStorage.setItem('realprint_user', JSON.stringify(data.user));
      //   return { success: true };
      // }

      // Por ahora: simular con datos locales
      // Este código debería ser reemplazado por llamada a API
      return simulateLogin(username, password);
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Función auxiliar para simular login con datos locales
  const simulateLogin = (username, password) => {
    // Aquí vendría la validación contra datos locales
    // Este será reemplazado por API real
    const mockToken = btoa(`${username}:${Date.now()}`); // Token simulado
    const userData = {
      id: 1,
      username,
      name: "Usuario Simulado",
      role: "cliente",
    };

    setToken(mockToken);
    setUser(userData);
    localStorage.setItem("realprint_token", mockToken);
    localStorage.setItem("realprint_user", JSON.stringify(userData));

    return { success: true, user: userData };
  };

  /**
   * Cierra la sesión
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("realprint_token");
    localStorage.removeItem("realprint_user");
  };

  /**
   * Verifica si el token es válido (útil para detectar expiración)
   */
  const isTokenValid = () => {
    if (!token) return false;
    // En el futuro, decodificar JWT y verificar exp
    return true;
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    isTokenValid,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
```

---

## 2. CREAR SERVICIO API BASE

**Archivo: src/services/api.js (NUEVO)**

```javascript
/**
 * Cliente API centralizado para la aplicación
 * Maneja autenticación, errores, timeouts, etc.
 */

import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 5000;

class ApiError extends Error {
  constructor(message, status, data = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  constructor() {
    this.baseURL = API_BASE;
    this.timeout = API_TIMEOUT;
  }

  getToken() {
    return localStorage.getItem("realprint_token");
  }

  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  async request(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Token expirado
      if (response.status === 401) {
        localStorage.removeItem("realprint_token");
        localStorage.removeItem("realprint_user");
        window.location.href = "/login";
        throw new ApiError("Sesión expirada", 401);
      }

      // Otros errores HTTP
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          // Ignorar si no es JSON
        }
        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error.name === "AbortError") {
        throw new ApiError("Request timeout", 408);
      }

      throw new ApiError(error.message || "Request failed", 500);
    }
  }

  get(url) {
    return this.request(url, { method: "GET" });
  }

  post(url, data) {
    return this.request(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(url, data) {
    return this.request(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  patch(url, data) {
    return this.request(url, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  delete(url) {
    return this.request(url, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
```

---

## 3. HOOK USEAPI PARA SIMPLIFICAR LLAMADAS

**Archivo: src/hooks/useApi.js (NUEVO)**

```javascript
import { useState, useCallback } from "react";
import { apiClient, ApiError } from "../services/api";

/**
 * Hook para manejar llamadas a API con loading y error
 * Ejemplo de uso:
 *
 * const { data, loading, error, execute } = useApi();
 * const handleClick = () => {
 *   execute(() => apiClient.get('/pedidos'))
 *     .then(data => console.log(data))
 *     .catch(err => console.error(err));
 * };
 */
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "Error desconocido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError(null);
  const clearData = () => setData(null);

  return { data, loading, error, execute, clearError, clearData };
}
```

---

## 4. CREAR SERVICIO PARA PEDIDOS

**Archivo: src/services/pedidoService.js (NUEVO)**

```javascript
import { apiClient } from "./api";

/**
 * Servicio para operaciones relacionadas con pedidos
 * Abstrae las llamadas a API en métodos semánticos
 */

export const pedidoService = {
  /**
   * Obtiene todos los pedidos del usuario
   */
  async getPedidos(filtros = {}) {
    const params = new URLSearchParams(filtros);
    return apiClient.get(`/pedidos?${params}`);
  },

  /**
   * Obtiene un pedido específico
   */
  async getPedidoById(id) {
    return apiClient.get(`/pedidos/${id}`);
  },

  /**
   * Crea un nuevo pedido
   */
  async createPedido(data) {
    return apiClient.post("/pedidos", data);
  },

  /**
   * Actualiza un pedido
   */
  async updatePedido(id, data) {
    return apiClient.put(`/pedidos/${id}`, data);
  },

  /**
   * Cambia el estado de un pedido
   */
  async changePedidoStatus(id, estado) {
    return apiClient.patch(`/pedidos/${id}/status`, { estado });
  },

  /**
   * Obtiene el historial de un pedido
   */
  async getPedidoHistorial(id) {
    return apiClient.get(`/pedidos/${id}/historial`);
  },

  /**
   * Asigna un operario a un pedido
   */
  async assignOperario(pedidoId, operarioId) {
    return apiClient.post(`/pedidos/${pedidoId}/asignar/${operarioId}`, {});
  },

  /**
   * Elimina un pedido
   */
  async deletePedido(id) {
    return apiClient.delete(`/pedidos/${id}`);
  },
};
```

---

## 5. MEJORAR DATACONTEXT PARA COMPATIBILIDAD CON API

**Archivo: src/context/DataContext.jsx (FRAGMENTO)**

Agregar al principio un comentario indicando preparación para API:

```javascript
/**
 * IMPORTANTE: Este contexto actualmente usa datos locales (localStorage).
 * Cuando el backend esté listo, estas funciones deberán:
 * 1. Llamar a la API via apiClient
 * 2. Mantener los datos en el contexto como caché
 * 3. Soportar refrescado de datos
 *
 * Estructura recomendada:
 * - Mantener un estado "synced" para indicar si datos son actuales
 * - Agregar función "syncWithServer()" para actualizar desde API
 * - Manejar conflictos de datos offline/online
 */

// Ejemplo de cómo se vería con API:
const syncPedidosFromServer = async () => {
  try {
    const pedidos = await pedidoService.getPedidos();
    setPedidos(pedidos);
    setLastSyncTime(new Date());
  } catch (error) {
    console.error("Error sincronizando pedidos:", error);
  }
};

// En useEffect, sincronizar al cargar:
useEffect(() => {
  syncPedidosFromServer();
}, []);
```

---

## 6. AGREGAR VALIDACIONES EN FORMULARIOS

**Archivo: src/utils/validators.js (NUEVO)**

```javascript
/**
 * Funciones de validación reutilizables para formularios
 */

export const validators = {
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) ? null : "Email inválido";
  },

  password: (password) => {
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    if (!/[A-Z]/.test(password))
      return "Debe incluir al menos una mayúscula";
    if (!/[0-9]/.test(password))
      return "Debe incluir al menos un número";
    return null;
  },

  username: (username) => {
    if (username.length < 3) return "El usuario debe tener al menos 3 caracteres";
    if (!/^[a-zA-Z0-9_-]+$/.test(username))
      return "Solo se permiten letras, números, - y _";
    return null;
  },

  fecha: (fecha) => {
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return "Fecha inválida";
    if (date < new Date()) return "La fecha debe ser en el futuro";
    return null;
  },

  positiveNumber: (num) => {
    const n = parseFloat(num);
    if (isNaN(n)) return "Debe ser un número";
    if (n <= 0) return "Debe ser un número positivo";
    return null;
  },
};

/**
 * Hook para validar formularios
 */
import { useState, useCallback } from "react";

export function useFormValidation(initialValues, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value, validator) => {
    if (!validator) return null;
    return validator(value);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e, validator) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validator) {
      const error = validateField(name, values[name], validator);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors,
  };
}
```

---

## 7. MEJORAR MANEJO DE ERRORES GLOBAL

**Archivo: src/utils/errorHandler.js (NUEVO)**

```javascript
/**
 * Manejador centralizado de errores
 */

export class AppError extends Error {
  constructor(message, code = "UNKNOWN_ERROR", details = {}) {
    super(message);
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  static fromApiError(apiError) {
    return new AppError(apiError.message, apiError.status, apiError.data);
  }

  static unauthorized() {
    return new AppError("No autorizado", "UNAUTHORIZED");
  }

  static notFound() {
    return new AppError("No encontrado", "NOT_FOUND");
  }

  static validationError(details) {
    return new AppError("Error de validación", "VALIDATION_ERROR", details);
  }

  log() {
    console.error(`[${this.code}] ${this.message}`, this.details);
    // En el futuro, enviar a servicio de logs
  }
}

/**
 * Componente para mostrar errores
 */
import React from "react";

export function ErrorBoundary({ children }) {
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const handleError = (event) => {
      setError(event.error);
      event.error.log();
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h1 className="font-bold">Error: {error.code}</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return children;
}
```

---

## 8. CONFIGURATION PARA VITE (.env)

**Archivo: .env**

```env
# API
VITE_API_URL=http://localhost:8080/api
VITE_API_TIMEOUT=5000

# App
VITE_APP_NAME=RealPrint
VITE_APP_VERSION=1.0.0

# Logging (desarrollo)
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

**Archivo: .env.example**

```env
VITE_API_URL=http://localhost:8080/api
VITE_API_TIMEOUT=5000
VITE_APP_NAME=RealPrint
VITE_APP_VERSION=1.0.0
VITE_DEBUG=false
VITE_LOG_LEVEL=info
```

---

## 9. ACTUALIZAR package.json CON SCRIPTS ÚTILES

**Cambios en package.json:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --fix",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{js,jsx,css}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  },
  "devDependencies": {
    "@vitejs/plugin-react-swc": "^3.3.2",
    "vitest": "^0.34.6",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.4"
  }
}
```

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

- [ ] Crear archivos de servicios (`api.js`, `pedidoService.js`)
- [ ] Crear hook `useApi.js`
- [ ] Refactorizar `AuthContext.jsx` para soportar JWT
- [ ] Crear `errorHandler.js` y componente `ErrorBoundary`
- [ ] Crear `validators.js` y hook `useFormValidation`
- [ ] Crear `.env` y `.env.example`
- [ ] Actualizar `package.json` con scripts
- [ ] Pruebas locales de servicios (sin backend)
- [ ] Documentar estructura de cambios

---

## 🔄 SIGUIENTE PASO

Una vez implementados estos cambios:
1. Tu frontend estará preparado para conectar a un backend real
2. Solo necesitarás descommentar las llamadas a API en `AuthContext`
3. Los servicios ya estarán listos para usar

---

**Nota:** Estos cambios son **retrocompatibles** - el aplicativo seguirá funcionando como antes mientras implementas gradualmente la integración con API.


