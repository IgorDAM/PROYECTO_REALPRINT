package com.realprint.realprintbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.realprint.realprintbackend.dto.ForgotPasswordRequest;
import com.realprint.realprintbackend.dto.LoginRequest;
import com.realprint.realprintbackend.dto.LoginResponse;
import com.realprint.realprintbackend.dto.ResetPasswordRequest;
import com.realprint.realprintbackend.exception.UnauthorizedException;
import com.realprint.realprintbackend.service.AuthService;
import com.realprint.realprintbackend.service.UsuarioService;

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
    private final UsuarioService usuarioService;

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
     * Endpoint de healthcheck para comprobar que el backend responde.
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

    /**
     * Inicia el flujo de recuperación de contraseña.
     *
     * Por seguridad, SIEMPRE responde 200 con el mismo mensaje genérico,
     * exista o no una cuenta asociada al identificador (evita que se pueda
     * averiguar qué usernames/emails están registrados probando aquí).
     */
    @Operation(
        summary = "Solicitar recuperación de contraseña",
        description = "Genera un enlace de recuperación de un solo uso (caduca a los 30 minutos) si el identificador " +
                      "(username o email) corresponde a una cuenta existente. La respuesta es siempre la misma para no " +
                      "revelar si la cuenta existe."
    )
    @ApiResponse(responseCode = "200", description = "Petición procesada (independientemente de si la cuenta existe)")
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        usuarioService.requestPasswordReset(request.getIdentifier());
        return ResponseEntity.ok("{\"message\":\"Si existe una cuenta asociada, recibirás instrucciones para continuar.\"}");
    }

    /**
     * Completa el flujo de recuperación: cambia la contraseña usando el token recibido.
     */
    @Operation(
        summary = "Restablecer contraseña",
        description = "Establece una nueva contraseña a partir de un token de recuperación válido y no caducado."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Contraseña restablecida correctamente"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
        @ApiResponse(responseCode = "401", description = "Token inválido o caducado")
    })
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        usuarioService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("{\"message\":\"Contraseña actualizada correctamente.\"}");
    }
}