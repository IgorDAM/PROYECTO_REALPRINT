/**
 * Cliente HTTP centralizado de RealPrint.
 *
 * **Responsabilidades:**
 * 1. Construir URLs hacia el backend (configurable por VITE_API_URL)
 * 2. Inyectar token JWT automáticamente en cada request
 * 3. Manejar timeouts con AbortController (evita bloqueos en UI)
 * 4. Parsear respuestas según Content-Type
 * 5. Normalizar errores para que la UI siempre reciba ApiError
 *
 * **Autenticación:**
 * - Si hay token guardado en localStorage, lo incluye como Bearer token
 * - No incluye token si no hay sesión activa (rutas públicas)
 *
 * **Manejo de errores:**
 * - Todos los errores (red, timeout, HTTP) se convierten a ApiError
 * - Preserva información de estado y código para debugging
 *
 * **Ejemplo de uso:**
 * ```typescript
 * try {
 *   const datos = await httpClient.get('/pedidos');
 *   // ...
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     console.error(error.message, error.details);
 *   }
 * }
 * ```
 *
 * @see tokenStorage.ts para saber cómo se guarda/recupera el token
 * @see errors.ts para entender normalizeApiError
 * @see authService.ts para flow de login que provee el token
 */
import { ApiError, normalizeApiError } from "./errors";
import { getToken } from "./tokenStorage";

/**
 * Tiempo maximo por defecto para una solicitud HTTP.
 * Evita que la UI quede bloqueada si el backend no responde.
 */
const DEFAULT_TIMEOUT_MS = 10000;

/**
 * URL base configurable por entorno.
 * Prioriza VITE_API_URL (documentacion) y mantiene compatibilidad con VITE_API_BASE_URL.
 */
const BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "";

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

interface HttpClientApi {
  request: (path: string, options?: RequestOptions) => Promise<unknown>;
  get: (path: string, options?: RequestOptions) => Promise<unknown>;
  post: (path: string, body?: unknown, options?: RequestOptions) => Promise<unknown>;
  put: (path: string, body?: unknown, options?: RequestOptions) => Promise<unknown>;
  patch: (path: string, body?: unknown, options?: RequestOptions) => Promise<unknown>;
  delete: (path: string, options?: RequestOptions) => Promise<unknown>;
}

/**
 * Construye la URL final de peticion.
 * Si no hay base URL, asume rutas relativas (util en desarrollo con mismo host).
 */
function buildUrl(path: string): string {
  if (!BASE_URL) return path;
  return `${BASE_URL}${path}`;
}

/**
 * Parsea la respuesta segun su content-type.
 * Devuelve JSON cuando aplica y texto para respuestas no JSON.
 */
async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

/**
 * Ejecuta una solicitud HTTP con:
 * - timeout por AbortController,
 * - cabeceras comunes,
 * - token Bearer automatico si existe,
 * - normalizacion de errores.
 */
async function request(path: string, { method = "GET", body, headers = {}, timeout = DEFAULT_TIMEOUT_MS } = {} as RequestOptions): Promise<unknown> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const token = getToken();
    const response = await fetch(buildUrl(path), {
      method,
      headers: {
        // Estandariza payload JSON para toda la app.
        "Content-Type": "application/json",
        // Inyecta auth solo cuando hay sesion activa.
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      // Convierte errores HTTP en ApiError para mantener un contrato unico.
      throw new ApiError((data as any)?.message || "Error en la solicitud", {
        status: response.status,
        code: (data as any)?.code || "HTTP_ERROR",
        details: data,
      });
    }

    return data;
  } catch (error) {
    // Nunca propagamos errores "crudos"; los normalizamos para la UI.
    throw normalizeApiError(error);
  } finally {
    // Limpia el temporizador para evitar fugas de memoria.
    clearTimeout(timeoutId);
  }
}

/**
 * API publica del cliente HTTP.
 * Expone helpers por verbo para evitar repetir configuracion.
 */
export const httpClient: HttpClientApi = {
  request,
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};
