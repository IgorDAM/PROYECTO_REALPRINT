package com.realprint.realprintbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.realprint.realprintbackend.dto.LoginRequest;
import com.realprint.realprintbackend.dto.LoginResponse;
import com.realprint.realprintbackend.exception.UnauthorizedException;
import com.realprint.realprintbackend.service.AuthService;

import lombok.RequiredArgsConstructor;

/**
 * Controlador REST de autenticación (Cap13 REST).
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Endpoint de login esperado por el frontend.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * Manejador local para devolver 401 en errores de autenticación.
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<String> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(401).body(ex.getMessage());
    }
}