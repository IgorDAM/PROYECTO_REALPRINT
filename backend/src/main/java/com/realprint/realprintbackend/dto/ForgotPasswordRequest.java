package com.realprint.realprintbackend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de entrada para POST /auth/forgot-password.
 *
 * `identifier` acepta tanto el username como el email del usuario.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordRequest {

    @NotBlank(message = "Introduce tu correo o nombre de usuario")
    private String identifier;
}
