package com.realprint.realprintbackend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
 * - cliente / cliente123 (Rol: CLIENTE)
 */
@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    /**
     * Bean que se ejecuta al iniciar la aplicación.
     * Inicializa usuarios de prueba si no existen.
     */
    @Bean
    public CommandLineRunner initializeData(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Si la BD ya tiene usuarios, no hacer nada (evitar duplicados)
            if (usuarioRepository.count() > 0) {
                logger.info("Base de datos ya contiene usuarios. Saltando inicialización.");
                return;
            }

            logger.info("Inicializando usuarios de prueba...");

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
                    .username("cliente")
                    .nombre("Cliente Prueba")
                    .passwordHash(passwordEncoder.encode("cliente123"))
                    .rol(RolUsuario.CLIENTE)
                    .activo(true)
                    .build();

            // Guardar en BD
            usuarioRepository.saveAll(java.util.List.of(admin, cliente));

            logger.info("Usuarios de prueba creados exitosamente");
            logger.info("  - admin / admin123 (ADMIN)");
            logger.info("  - cliente / cliente123 (CLIENTE)");
        };
    }
}

