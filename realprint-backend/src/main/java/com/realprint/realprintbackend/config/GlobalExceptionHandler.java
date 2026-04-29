package com.realprint.realprintbackend.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.realprint.realprintbackend.exception.PedidoNoEncontradoException;
import com.realprint.realprintbackend.exception.UnauthorizedException;

import lombok.extern.slf4j.Slf4j;

/**
 * Manejador global de excepciones.
 *
 * Intercepta excepciones lanzadas en controllers y las convierte a respuestas HTTP
 * con estructura consistente y códigos de estado apropiados.
 *
 * **Estructura de respuesta de error:**
 * ```json
 * {
 *   "timestamp": "2026-04-28T10:30:00Z",
 *   "status": 404,
 *   "message": "Recurso no encontrado",
 *   "error": "Pedido no encontrado con id: 999"
 * }
 * ```
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Maneja excepciones cuando un pedido no se encuentra.
     * Status HTTP: 404 Not Found
     */
    @ExceptionHandler(PedidoNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> handlePedidoNoEncontrado(PedidoNoEncontradoException ex) {
        log.warn("Pedido no encontrado: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErrorResponse.builder()
                        .status(HttpStatus.NOT_FOUND.value())
                        .message("Pedido no encontrado")
                        .error(ex.getMessage())
                        .build());
    }

    /**
     * Maneja excepciones de autorización (acceso denegado).
     * Status HTTP: 401 Unauthorized
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex) {
        log.warn("Acceso no autorizado: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.builder()
                        .status(HttpStatus.UNAUTHORIZED.value())
                        .message("No autorizado")
                        .error(ex.getMessage())
                        .build());
    }

    /**
     * Maneja excepciones genéricas no esperadas.
     * Status HTTP: 500 Internal Server Error
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Error no esperado", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.builder()
                        .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .message("Error interno del servidor")
                        .error(ex.getMessage() != null ? ex.getMessage() : "Error desconocido")
                        .build());
    }

    /**
     * Modelo para respuestas de error.
     * Se convierte automáticamente a JSON por Spring.
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ErrorResponse {
        private int status;
        private String message;
        private String error;
    }
}

