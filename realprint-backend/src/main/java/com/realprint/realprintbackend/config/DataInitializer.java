package com.realprint.realprintbackend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.realprint.realprintbackend.entity.RolUsuario;
import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.repository.UsuarioRepository;

/**
 * Inicializadora de datos para desarrollo y testing.
 *
 * Crea usuarios de prueba cuando la BD está vacía.
 * Esto facilita debugging sin tener que crear usuarios manualmente.
 *
 * Usuarios creados:
 * - admin / admin123 (Rol: ADMIN)
 * - cliente1 / cliente123 (Rol: CLIENTE)
 * - operario1 / operario123 (Rol: OPERARIO)
 */
@Configuration
public class DataInitializer {

    /**
     * Bean que se ejecuta al iniciar la aplicación.
     * Inicializa usuarios de prueba si no existen.
     */
    @Bean
    public CommandLineRunner initializeData(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Si la BD ya tiene usuarios, no hacer nada (evitar duplicados)
            if (usuarioRepository.count() > 0) {
                System.out.println("✓ Base de datos ya contiene usuarios. Saltando inicialización.");
                return;
            }

            System.out.println("Inicializando usuarios de prueba...");

            // Crear usuario ADMIN
            Usuario admin = Usuario.builder()
                    .username("admin")
                    .nombre("Administrador Sistema")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .rol(RolUsuario.ADMIN)
                    .activo(true)
                    .build();

            // Crear usuario CLIENTE
            Usuario cliente = Usuario.builder()
                    .username("cliente1")
                    .nombre("Cliente Prueba")
                    .passwordHash(passwordEncoder.encode("cliente123"))
                    .rol(RolUsuario.CLIENTE)
                    .activo(true)
                    .build();

            // Guardar en BD
            usuarioRepository.saveAll(java.util.List.of(admin, cliente));

            System.out.println("✓ Usuarios de prueba creados exitosamente:");
            System.out.println("  - admin / admin123");
            System.out.println("  - cliente1 / cliente123");
        };
    }
}

