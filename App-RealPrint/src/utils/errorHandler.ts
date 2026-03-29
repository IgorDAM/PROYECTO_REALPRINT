/**
 * Normaliza mensajes de error para mostrarlos en UI.
 * Mantiene el componente limpio y evita repetir condicionantes.
 */
export function getReadableErrorMessage(error, fallback = "Ha ocurrido un error") {
  if (!error) return fallback;

  if (typeof error === "string") return error;

  if (error.message && typeof error.message === "string") {
    return error.message;
  }

  if (error.details?.message && typeof error.details.message === "string") {
    return error.details.message;
  }

  return fallback;
}

/**
 * Heuristica simple para decidir si reintentar una solicitud.
 */
export function isRetryableError(error) {
  const status = error?.status;
  return status === 408 || status === 429 || (status >= 500 && status <= 599);
}

