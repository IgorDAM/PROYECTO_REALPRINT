package com.realprint.realprintbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de entrada para POST /auth/reset-password.
 *
 * `token` es el que se generó en forgot-password (de un solo uso, caduca a los 30 min).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {

    @NotBlank(message = "El token es obligatorio")
    private String token;

    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Size(min = 6, message = "La nueva contraseña debe tener al menos 6 caracteres")
    private String newPassword;
}
