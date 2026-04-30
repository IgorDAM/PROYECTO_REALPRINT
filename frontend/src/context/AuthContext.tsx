/**
 * Contexto global de autenticacion.
 *
 * Rol arquitectonico:
 * - expone estado de sesion a toda la UI,
 * - delega la logica de login/logout en authService,
 * - evita que componentes conozcan detalles de almacenamiento o API.
 *
 * Soporta:
 * - VITE_USE_LOCAL_AUTH=true: login local (demo/testing).
 * - VITE_USE_LOCAL_AUTH=false: login contra API con JWT.
 * - Decodificacion de JWT si aplicable.
 * - Deteccion de token expirado.
 */
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "../services";

type Role = "admin" | "cliente" | string;

interface AuthUser {
  id?: number | string;
  username?: string;
  name?: string;
  role?: Role;
  especialidad?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<{ success: true; user: AuthUser } | { success: false; error: string }>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isTokenValid: () => boolean;
}

interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function decodeJWT(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload)) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return false;
  return Date.now() >= decoded.exp * 1000;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Hidrata sesion al arrancar para mantener login tras recarga.
    const savedUser = authService.getCurrentUser();
    const savedToken = localStorage.getItem("realprint_token");

    if (savedToken && isTokenExpired(savedToken)) {
      // Token expirado: limpiar sesion
      localStorage.removeItem("realprint_token");
      authService.logout();
      setUser(null);
      setToken(null);
    } else if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
    } else if (savedUser) {
      setUser(savedUser);
    }

    setLoading(false);
  }, []);

  // Adaptador entre UI y authService: devuelve contrato estable { success, user/error }.
  const login: AuthContextValue["login"] = async (username, password) => {
    try {
      const { user: loggedUser, token: loginToken } = await authService.login({ username, password });
      setUser(loggedUser);
      if (loginToken) {
        setToken(loginToken);
      }
      return { success: true, user: loggedUser };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "No se ha podido iniciar sesion";
      return { success: false, error: message };
    }
  };

  // Cierra estado React y sesion persistida de forma atomica.
  const logout = () => {
    setUser(null);
    setToken(null);
    authService.logout();
  };

  // Verifica si el token actual es valido y no expirado.
  const isTokenValid = () => {
    if (!token) return false;
    return !isTokenExpired(token);
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isTokenValid,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook de consumo seguro del contexto.
 * Falla rapido si se usa fuera del provider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}

