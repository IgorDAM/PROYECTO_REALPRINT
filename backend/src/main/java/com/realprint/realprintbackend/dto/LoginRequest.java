package com.realprint.realprintbackend.dto;

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
    private String username;

    /** Password en texto plano (solo viaja en HTTPS) */
    private String password;
}