package com.realprint.realprintbackend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.realprint.realprintbackend.entity.RolUsuario;
import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

/**
 * Endpoint temporal para crear el usuario admin inicial.
 * IMPORTANTE: Solo disponible cuando NO hay usuarios en la BD, Y ADEMÁS
 * solo si se proporciona la clave de configuración correcta (app.setup.secret,
 * variable de entorno SETUP_SECRET). Sin esa variable definida, el endpoint
 * queda deshabilitado por completo (fail-safe): nadie puede crear un admin
 * aunque la BD esté vacía.
 *
 * Esto evita que, justo tras un despliegue y antes de que el admin real se
 * registre, cualquiera que encuentre la URL pueda crearse una cuenta de
 * administrador.
 *
 * Se auto-desactiva después del primer uso (la BD deja de estar vacía).
 */
@RestController
@RequestMapping("/setup")
@RequiredArgsConstructor
public class AdminSetupController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.setup.secret:}")
    private String setupSecret;

    @PostMapping("/admin")
    public ResponseEntity<?> createInitialAdmin(@RequestBody AdminRequest request) {
        // Fail-safe: sin SETUP_SECRET configurado, el endpoint está deshabilitado.
        if (setupSecret == null || setupSecret.isBlank()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Endpoint de configuración inicial deshabilitado: no se ha definido SETUP_SECRET en el servidor.");
        }

        if (request == null || request.setupSecret() == null || !setupSecret.equals(request.setupSecret())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Clave de configuración incorrecta.");
        }

        // Solo permitir si la BD está vacía
        if (usuarioRepository.count() > 0) {
            return ResponseEntity.badRequest()
                .body("El sistema ya tiene usuarios. Este endpoint está deshabilitado.");
        }

        // Crear usuario admin
        Usuario admin = Usuario.builder()
                .username(request.username())
                .nombre(request.nombre())
                .passwordHash(passwordEncoder.encode(request.password()))
                .rol(RolUsuario.ADMIN)
                .activo(true)
                .build();

        usuarioRepository.save(admin);

        return ResponseEntity.ok()
            .body("Usuario admin creado exitosamente. Este endpoint ahora está deshabilitado.");
    }

    /**
     * No exige la clave de configuración: solo informa si el sistema necesita
     * el primer admin, sin revelar cuántos usuarios hay (antes se devolvía el
     * recuento exacto).
     */
    @GetMapping("/status")
    public ResponseEntity<?> checkStatus() {
        boolean needsSetup = usuarioRepository.count() == 0;

        return ResponseEntity.ok()
            .body(new StatusResponse(needsSetup));
    }

    record AdminRequest(String username, String nombre, String password, String setupSecret) {}
    record StatusResponse(boolean needsSetup) {}
}
