package com.realprint.realprintbackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoints de prueba para validar la seguridad.
 *
 * Nos sirven para comprobar rápido si el JWT funciona y si los roles están bien aplicados.
 */
@RestController
public class TestSecurityController {

    // Solo debería responder si el usuario tiene rol ADMIN.
    @GetMapping("/admin/ping")
    public String adminPing() {
        return "OK admin";
    }

    // Puede entrar tanto CLIENTE como ADMIN.
    @GetMapping("/cliente/ping")
    public String clientePing() {
        return "OK cliente";
    }
}
