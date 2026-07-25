package com.realprint.realprintbackend.config;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

/**
 * Copia DATABASE_URL a spring.datasource.url para que Spring Boot lo interprete.
 * Normaliza postgresql:// a jdbc:postgresql://
 */
public class RenderDatabaseEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String databaseUrl = environment.getProperty("DATABASE_URL");
        boolean isProduction = environment.matchesProfiles("production");

        if (databaseUrl != null && !databaseUrl.isBlank()) {
            String jdbcUrl = normalizeJdbcUrl(databaseUrl.trim());

            Map<String, Object> props = new LinkedHashMap<>();
            props.put("spring.datasource.url", jdbcUrl);

            environment.getPropertySources().addFirst(
                    new MapPropertySource("database-url-from-render", props));
        } else if (isProduction) {
            throw new IllegalStateException(
                    "DATABASE_URL environment variable is required in production but was not found. " +
                    "Render must inject DATABASE_URL from the connected PostgreSQL database.");
        }
    }

    static String normalizeJdbcUrl(String databaseUrl) {
        if (databaseUrl.startsWith("jdbc:")) {
            return databaseUrl;
        }

        String urlWithoutScheme = null;
        if (databaseUrl.startsWith("postgresql://")) {
            urlWithoutScheme = databaseUrl.substring("postgresql://".length());
        } else if (databaseUrl.startsWith("postgres://")) {
            urlWithoutScheme = databaseUrl.substring("postgres://".length());
        } else {
            return databaseUrl;
        }

        // Parsear: user:password@host[:port]/database[?params]
        // Agregar puerto 5432 si no está presente
        String authority = urlWithoutScheme;
        String dbAndParams = "";

        int slashIdx = urlWithoutScheme.indexOf('/');
        if (slashIdx > 0) {
            authority = urlWithoutScheme.substring(0, slashIdx);
            dbAndParams = urlWithoutScheme.substring(slashIdx);
        }

        // Verificar si ya tiene puerto
        int atIdx = authority.lastIndexOf('@');
        String hostPart = (atIdx >= 0) ? authority.substring(atIdx + 1) : authority;

        if (!hostPart.contains(":")) {
            // No tiene puerto, agregar 5432
            if (atIdx >= 0) {
                authority = authority.substring(0, atIdx + 1) + hostPart + ":5432";
            } else {
                authority = hostPart + ":5432";
            }
        }

        return "jdbc:postgresql://" + authority + dbAndParams;
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
