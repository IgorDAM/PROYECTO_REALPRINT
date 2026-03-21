/**
 * Error base de la capa de servicios.
 *
 * Por que existe:
 * - unifica el formato de error que consume la UI,
 * - evita condicionales distintos por cada origen de fallo.
 */
export class ApiError extends Error {
  constructor(message, { status = 500, code = "API_ERROR", details = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Convierte cualquier error (fetch, timeout, excepcion JS, etc.)
 * en una instancia de ApiError con un contrato estable.
 */
export function normalizeApiError(error, fallbackMessage = "Ha ocurrido un error inesperado") {
  if (error instanceof ApiError) {
    // Ya viene normalizado desde un servicio interno.
    return error;
  }

  if (error?.name === "AbortError") {
    // AbortController usa AbortError cuando vence el timeout.
    return new ApiError("La solicitud ha tardado demasiado", {
      status: 408,
      code: "TIMEOUT_ERROR",
    });
  }

  if (error instanceof Error) {
    // Preserva el mensaje original para facilitar depuracion.
    return new ApiError(error.message || fallbackMessage, {
      code: "UNEXPECTED_ERROR",
      details: error,
    });
  }

  // Fallback para errores no tipados (strings, objetos arbitrarios, etc.).
  return new ApiError(fallbackMessage, {
    code: "UNKNOWN_ERROR",
    details: error,
  });
}
