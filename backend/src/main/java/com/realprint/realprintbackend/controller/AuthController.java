package com.realprint.realprintbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.realprint.realprintbackend.dto.LoginRequest;
import com.realprint.realprintbackend.dto.LoginResponse;
import com.realprint.realprintbackend.exception.UnauthorizedException;
import com.realprint.realprintbackend.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;

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
    @Operation(
        summary = "Login de usuario",
        description = "Autentica al usuario y devuelve un token JWT",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Credenciales de acceso",
            required = true,
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = LoginRequest.class),
                examples = @ExampleObject(
                    name = "Login de administrador",
                    value = "{\n" +
                        "  \"username\": \"admin\",\n" +
                        "  \"password\": \"admin123\"\n" +
                        "}"
                )
            )
        )
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Login exitoso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = LoginResponse.class),
                examples = @ExampleObject(
                    name = "Respuesta exitosa",
                    value = "{\n" +
                        "  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\",\n" +
                        "  \"user\": {\n" +
                        "    \"id\": 1,\n" +
                        "    \"username\": \"admin\",\n" +
                        "    \"nombre\": \"Administrador\",\n" +
                        "    \"role\": \"admin\"\n" +
                        "  }\n" +
                        "}"
                )
            )
        ),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
        @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
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

    /**
     * Endpoint de healthcheck para keep-alive en Render.
     * No requiere autenticacion pero levanta los beans de AuthService.
     * Responde rapidamente sin usar recursos de la BD.
     */
    @Operation(
        summary = "Health check del modulo de autenticación",
        description = "Verifica que el modulo de autenticación está disponible. Usado por keep-alive en CI/CD."
    )
    @ApiResponse(responseCode = "200", description = "Servicio de autenticación disponible")
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("{\"status\":\"ok\"}");
    }
}