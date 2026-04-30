package com.realprint.realprintbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de salida para el login.
 *
 * **Estructura:**
 * Devuelve un objeto anidado 'user' que contiene los datos del usuario autenticado,
 * más el token JWT. Esta estructura coincide con el contrato esperado por el frontend.
 *
 * **Consumidor:** Frontend (authService.ts) espera exactamente esta forma de JSON.
 *
 * **Ejemplo de respuesta:**
 * ```json
 * {
 *   "token": "eyJhbGc...",
 *   "user": {
 *     "id": 1,
 *     "username": "admin",
 *     "name": "Administrador",
 *     "role": "admin"
 *   }
 * }
 * ```
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    /** Token JWT que el frontend enviará en Authorization: Bearer ... */
    private String token;

    /** Datos del usuario autenticado (anidados para consistencia con frontend) */
    private UserInfo user;

    /**
     * Información mínima del usuario después del login.
     * Nombres de campos coinciden con el frontend (minúsculas, inglés).
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserInfo {
        /** ID técnico del usuario en BD */
        private Long id;

        /** Username técnico usado para login */
        private String username;

        /** Nombre visible para mostrar en UI */
        private String name;

        /** Rol funcional (admin, cliente) para autorización en frontend */
        private String role;
    }
}

