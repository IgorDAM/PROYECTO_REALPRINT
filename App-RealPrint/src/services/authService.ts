import { httpClient } from "./httpClient";
import { ApiError, normalizeApiError } from "./errors";
import { clearSession, getStoredUser, setStoredUser, setToken } from "./tokenStorage";
import { logger } from "./logger";

/**
 * Fuente de usuarios para entorno local/demo.
 * Se lee desde la misma clave que usa DataContext para mantener compatibilidad.
 */
const USERS_STORAGE_KEY = "realprint_usuarios";

interface DemoUser {
  id: number;
  username: string;
  password: string;
  nombre: string;
  role: string;
  activo: boolean;
}

interface AuthUser {
  id?: number | string;
  username?: string;
  name?: string;
  role?: string;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

interface AuthServiceApi {
  login: (credentials: { username: string; password: string }) => Promise<AuthResponse>;
  logout: () => void;
  getCurrentUser: () => AuthUser | null;
}

/**
 * Usuarios de respaldo si aun no existe informacion en localStorage.
 * Permite login inmediato mientras no haya backend real conectado.
 */
const DEFAULT_DEMO_USERS: DemoUser[] = [
  { id: 1, username: "admin", password: "admin123", nombre: "Administrador", role: "admin", activo: true },
  { id: 2, username: "cliente", password: "cliente123", nombre: "Cliente Demo", role: "cliente", activo: true },
  { id: 3, username: "operario_demo_serigrafia", password: "operario123", nombre: "Operario Demo Serigrafia", role: "operario", activo: true },
  { id: 4, username: "operario_demo_rotulacion", password: "operario123", nombre: "Operario Demo Rotulacion", role: "operario", activo: true },
];

/**
 * Toggle de estrategia de autenticacion:
 * - true  -> login local (demo/offline)
 * - false -> login por API real
 */
const USE_LOCAL_AUTH = import.meta.env.VITE_USE_LOCAL_AUTH !== "false";

/**
 * Lee usuarios guardados localmente con tolerancia a datos corruptos.
 */
function readUsersFromStorage(): DemoUser[] {
  const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);

  if (!rawUsers) return DEFAULT_DEMO_USERS;

  try {
    return JSON.parse(rawUsers) as DemoUser[];
  } catch {
    return DEFAULT_DEMO_USERS;
  }
}

/**
 * Elimina campos sensibles (password, metadatos no necesarios) antes de exponer user a la UI.
 */
function sanitizeUser(user: Record<string, any>): AuthUser {
  return {
    id: user.id,
    username: user.username,
    name: user.nombre || user.name,
    role: user.role,
  };
}

/**
 * Login local para fase de transicion.
 * Mantiene el contrato de respuesta de la version API ({ user, token }).
 */
async function loginLocal(username: string, password: string): Promise<AuthResponse> {
  logger.info('Login attempt (local)', { username });

  const users = readUsersFromStorage();
  const foundUser = users.find(
    (u) => u.username === username && u.password === password && u.activo !== false,
  );

  if (!foundUser) {
    logger.warn('Login failed: invalid credentials', { username });
    throw new ApiError("Credenciales incorrectas", {
      status: 401,
      code: "INVALID_CREDENTIALS",
    });
  }

  const user = sanitizeUser(foundUser);
  const token = `local-token-${user.id}-${Date.now()}`;

  setStoredUser(user);
  setToken(token);

  logger.info('Login successful', { username, userId: user.id, role: user.role });

  return { user, token };
}

/**
 * Login contra backend.
 * Espera un endpoint /auth/login que devuelva user y token.
 */
async function loginApi(username: string, password: string): Promise<AuthResponse> {
  const response = await httpClient.post("/auth/login", { username, password });
  const user = sanitizeUser((response as any).user || {});

  setStoredUser(user);
  if ((response as any).token) setToken((response as any).token);

  return { user, token: (response as any).token };
}

/**
 * Fachada publica de autenticacion consumida por AuthContext.
 * Centraliza persistencia de sesion y normalizacion de errores.
 */
export const authService: AuthServiceApi = {
  async login({ username, password }) {
    try {
      if (USE_LOCAL_AUTH) {
        return await loginLocal(username, password);
      }

      return await loginApi(username, password);
    } catch (error) {
      throw normalizeApiError(error, "No se ha podido iniciar sesion");
    }
  },

  /** Cierra sesion limpiando token y usuario persistido. */
  logout() {
    const currentUser = getStoredUser() as any;
    logger.info('Logout', { username: currentUser?.username });
    clearSession();
  },

  /** Devuelve el usuario actual de sesion para restaurar estado al recargar. */
  getCurrentUser() {
    return getStoredUser();
  },
};
