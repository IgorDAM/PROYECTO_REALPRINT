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
            // Solo crear si no existe: admin
            if (usuarioRepository.findByUsername("admin").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setNombre("Administrador");
                admin.setEmail("admin@realprint.com");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setRol(RolUsuario.ADMIN);
                admin.setActivo(true);
                usuarioRepository.save(admin);
                System.out.println("✓ Usuario admin creado");
            }

            // Solo crear si no existe: dev-user
            if (usuarioRepository.findByUsername("dev-user").isEmpty()) {
                Usuario devUser = new Usuario();
                devUser.setUsername("dev-user");
                devUser.setNombre("Usuario de Desarrollo");
                devUser.setEmail("dev@realprint.local");
                devUser.setPasswordHash(passwordEncoder.encode("dev123"));
                devUser.setRol(RolUsuario.CLIENTE);
                devUser.setActivo(true);
                usuarioRepository.save(devUser);
                System.out.println("✓ Usuario de desarrollo creado");
            }

            // Solo crear si no existe: cliente
            if (usuarioRepository.findByUsername("cliente").isEmpty()) {
                Usuario cliente = new Usuario();
                cliente.setUsername("cliente");
                cliente.setNombre("Cliente Demo");
                cliente.setEmail("cliente@realprint.com");
                cliente.setPasswordHash(passwordEncoder.encode("cliente123"));
                cliente.setRol(RolUsuario.CLIENTE);
                cliente.setActivo(true);
                usuarioRepository.save(cliente);
                System.out.println("✓ Usuario cliente creado");
            }
        };
    }
}
