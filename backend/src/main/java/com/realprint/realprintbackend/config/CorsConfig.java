package com.realprint.realprintbackend.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Configuración CORS para permitir peticiones desde el frontend.
 *
 * Los orígenes permitidos se configuran mediante la propiedad:
 * - cors.allowed-origins (separados por coma)
 *
 * Desarrollo: http://localhost:*
 * Producción: https://realprint.com,https://www.realprint.com
 */
@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins:http://localhost:*}")
    private String allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Leer orígenes permitidos desde application.properties (permite configuración por entorno)
        List<String> origins = Arrays.asList(allowedOrigins.split(","));
        configuration.setAllowedOriginPatterns(origins);

        // Métodos HTTP (incluye OPTIONS para preflight)
        configuration.setAllowedMethods(List.of(
            "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));

        // Headers permitidos explícitamente (mejor práctica con credentials)
        configuration.setAllowedHeaders(List.of(
            "Authorization",
            "Content-Type",
            "Accept",
            "X-Requested-With"
        ));

        // Headers expuestos al navegador
        configuration.setExposedHeaders(List.of(
            "Authorization"
        ));

        // Permitir credenciales (JWT en Authorization header)
        configuration.setAllowCredentials(true);

        // Cache de preflight: 1 hora
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}

