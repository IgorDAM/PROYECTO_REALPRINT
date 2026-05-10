package com.realprint.realprintbackend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.entity.RolUsuario;
import com.realprint.realprintbackend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

/**
 * Inicializador de datos para desarrollo.
 *
 * Crea automáticamente el usuario "dev-user" si no existe.
 * Este usuario es usado por DevAuthenticationFilter.
 */
@Configuration
@Profile("development")
@RequiredArgsConstructor
public class DevDataInitializer {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initDevUser() {
        return args -> {
            // Crear o reparar usuario admin
            var adminOpt = usuarioRepository.findByUsername("admin");
            if (adminOpt.isPresent()) {
                Usuario admin = adminOpt.get();
                // Reparar si tiene rol incorrecto
                if (admin.getRol() != RolUsuario.ADMIN) {
                    admin.setRol(RolUsuario.ADMIN);
                    admin.setNombre("Administrador");
                    admin.setEmail("admin@realprint.com");
                    admin.setPasswordHash(passwordEncoder.encode("admin123"));
                    usuarioRepository.save(admin);
                    System.out.println("⚠ Usuario admin reparado: admin / admin123 (rol actualizado a ADMIN)");
                }
            } else {
                Usuario admin = Usuario.builder()
                        .username("admin")
                        .nombre("Administrador")
                        .email("admin@realprint.com")
                        .passwordHash(passwordEncoder.encode("admin123"))
                        .rol(RolUsuario.ADMIN)
                        .activo(true)
                        .build();

                usuarioRepository.save(admin);
                System.out.println("✓ Usuario admin creado: admin / admin123");
            }

            // Crear usuario dev-user si no existe
            if (!usuarioRepository.findByUsername("dev-user").isPresent()) {
                Usuario devUser = Usuario.builder()
                        .username("dev-user")
                        .nombre("Usuario de Desarrollo")
                        .email("dev@realprint.local")
                        .passwordHash(passwordEncoder.encode("dev123"))
                        .rol(RolUsuario.CLIENTE)
                        .activo(true)
                        .build();

                usuarioRepository.save(devUser);
                System.out.println("✓ Usuario de desarrollo creado: dev-user / dev123");
            }

            // Crear usuario cliente de prueba si no existe
            if (!usuarioRepository.findByUsername("cliente").isPresent()) {
                Usuario cliente = Usuario.builder()
                        .username("cliente")
                        .nombre("Cliente Demo")
                        .email("cliente@realprint.com")
                        .passwordHash(passwordEncoder.encode("cliente123"))
                        .rol(RolUsuario.CLIENTE)
                        .activo(true)
                        .build();

                usuarioRepository.save(cliente);
                System.out.println("✓ Usuario cliente creado: cliente / cliente123");
            }
        };
    }
}
