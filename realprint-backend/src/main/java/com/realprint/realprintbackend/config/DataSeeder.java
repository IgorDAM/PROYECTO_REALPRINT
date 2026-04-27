package com.realprint.realprintbackend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.realprint.realprintbackend.entity.RolUsuario;
import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

/**
 * Cargador de datos mínimos para desarrollo.
 *
 * Nos permite probar el login desde el primer día sin tener que crear usuarios a mano.
 */
@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedUsuarios(UsuarioRepository usuarioRepository) {
        return args -> {
            // Solo creamos el admin si todavía no existe, así evitamos duplicados.
            if (usuarioRepository.findByUsername("admin").isEmpty()) {
                // Creamos un usuario administrador de prueba para validar la seguridad.
                Usuario admin = new Usuario(
                        "admin",
                        passwordEncoder.encode("admin123"),
                        "Administrador",
                        "admin@realprint.local",
                        RolUsuario.ADMIN
                );
                usuarioRepository.save(admin);
            }
        };
    }
}