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
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Persiste token de acceso para autenticacion Bearer. */
export function setToken(token: string): void {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
}

/** Elimina solo el token manteniendo el resto de datos si fuese necesario. */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
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
