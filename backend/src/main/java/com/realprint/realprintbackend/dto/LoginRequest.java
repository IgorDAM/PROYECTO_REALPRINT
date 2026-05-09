package com.realprint.realprintbackend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de entrada para login.
 * El frontend envía username y password en el body del POST /auth/login.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {

    /** Identificador de acceso del usuario */
    @NotBlank(message = "El username es obligatorio")
    private String username;

    /** Password en texto plano (solo viaja en HTTPS) */
    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
}