package com.realprint.realprintbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.realprint.realprintbackend.entity.RolUsuario;
import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

/**
 * Endpoint temporal para crear el usuario admin inicial.
 * IMPORTANTE: Solo disponible cuando NO hay usuarios en la BD.
 * Se auto-desactiva después del primer uso.
 */
@RestController
@RequestMapping("/setup")
@RequiredArgsConstructor
public class AdminSetupController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/admin")
    public ResponseEntity<?> createInitialAdmin(@RequestBody AdminRequest request) {
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

    @GetMapping("/status")
    public ResponseEntity<?> checkStatus() {
        long userCount = usuarioRepository.count();
        boolean needsSetup = userCount == 0;

        return ResponseEntity.ok()
            .body(new StatusResponse(needsSetup, userCount));
    }

    record AdminRequest(String username, String nombre, String password) {}
    record StatusResponse(boolean needsSetup, long userCount) {}
}
