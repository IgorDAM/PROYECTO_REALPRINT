/**
 * Claves centralizadas para almacenamiento de sesion.
 * Mantenerlas aqui evita literales duplicados en la app.
 */
const TOKEN_KEY = "realprint_token";
const USER_KEY = "realprint_user";

/**
 * Parseo seguro de JSON desde localStorage.
 * Si los datos estan corruptos, devuelve null en lugar de romper la UI.
 */
function parseJson(value: string | null): unknown {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/** Devuelve el token actual o null si no hay sesion. */
/** Devuelve el token actual. Busca primero en localStorage (persistente)
 *  y luego en sessionStorage (sesión) para soportar "Recordarme" opcional.
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

/** Persiste token de acceso para autenticacion Bearer. */
/**
 * Persiste token de acceso.
 * Si `remember` es true (por defecto), guarda en localStorage (persistente),
 * si es false guarda en sessionStorage (se elimina al cerrar la pestaña).
 */
export function setToken(token: string, remember = true): void {
  if (!token) return;
  try {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
      // Limpia cualquier token en sessionStorage para evitar duplicados/confusión
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Silenciar errores de storage (por ejemplo, en modos privados o restricciones)
  }
}

/** Elimina solo el token manteniendo el resto de datos si fuese necesario. */
export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

/** Recupera el usuario serializado en sesion. */
export function getStoredUser(): unknown {
  return parseJson(localStorage.getItem(USER_KEY));
}

/** Persiste una copia "sanitizada" del usuario autenticado. */
export function setStoredUser(user: Record<string, any>): void {
  if (!user) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/** Elimina el usuario persistido. */
export function clearStoredUser(): void {
  localStorage.removeItem(USER_KEY);
}

/**
 * Limpia por completo la sesion local.
 * Se usa en logout y en futuros flujos de token expirado.
 */
export function clearSession(): void {
  clearToken();
  clearStoredUser();
}
