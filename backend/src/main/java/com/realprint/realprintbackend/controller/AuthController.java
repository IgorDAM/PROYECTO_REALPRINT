package com.realprint.realprintbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.realprint.realprintbackend.dto.LoginRequest;
import com.realprint.realprintbackend.dto.LoginResponse;
import com.realprint.realprintbackend.exception.UnauthorizedException;
import com.realprint.realprintbackend.service.AuthService;

import lombok.RequiredArgsConstructor;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses; // ✅ faltaba este
// Content, Schema, ArraySchema eliminados — no se usan en este controller

/**
 * Controlador REST de autenticación (Cap13 REST).
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag (name = "Autenticación", description = "Operaciones relacionadas con la autenticación de usuarios")
public class AuthController {

    private final AuthService authService;

    /**
     * Endpoint de login esperado por el frontend.
     */
    @Operation  (summary = "Login de usuario", description = "Autentica al usuario y devuelve un token JWT")
    @ApiResponses  (value = {
        @ApiResponse(responseCode = "200", description = "Login exitoso"),
        @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * Manejador local para devolver 401 en errores de autenticación.
     */
    @Operation  (summary = "Manejador de errores de autenticación",
                    description = "Devuelve un mensaje de error con código 401 cuando las credenciales son inválidas")
    @ApiResponses  (value = {
        @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
    })
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<String> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(401).body(ex.getMessage());
    }
}