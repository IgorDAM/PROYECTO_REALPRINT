package com.realprint.realprintbackend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;

/**
 * Configuración de datasource para Render (production).
 * Lee DATABASE_URL inyectado por Render y lo normaliza a JDBC.
 */
@Configuration
@Profile("production")
public class RenderDatabaseConfiguration {

    @Bean(name = "dataSource")
    public DataSource dataSource(Environment env) {
        String databaseUrl = env.getProperty("DATABASE_URL");

        if (databaseUrl == null || databaseUrl.isBlank()) {
            throw new IllegalStateException("DATABASE_URL no está configurado. Render debe inyectar esta variable.");
        }

        System.out.println("[RenderDatabaseConfiguration] DATABASE_URL encontrado: " + databaseUrl);

        // Normalizar de postgresql://... a jdbc:postgresql://...
        String jdbcUrl = normalizeUrl(databaseUrl);
        System.out.println("[RenderDatabaseConfiguration] URL normalizada: " + jdbcUrl);

        // DataSourceBuilder construye desde la URL JDBC
        return DataSourceBuilder.create()
                .url(jdbcUrl)
                .driverClassName("org.postgresql.Driver")
                .build();
    }

    private static String normalizeUrl(String databaseUrl) {
        if (databaseUrl.startsWith("jdbc:")) {
            return databaseUrl;
        }

        if (databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://")) {
            // Convertir postgresql://user:pass@host:port/db a jdbc:postgresql://user:pass@host:port/db
            if (databaseUrl.startsWith("postgresql://")) {
                return "jdbc:postgresql://" + databaseUrl.substring("postgresql://".length());
            } else {
                return "jdbc:postgresql://" + databaseUrl.substring("postgres://".length());
            }
        }

        throw new IllegalArgumentException("DATABASE_URL tiene formato inválido: " + databaseUrl);
    }
}
