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
        String[] activeProfiles = environment.getActiveProfiles();
        boolean isProduction = java.util.Arrays.asList(activeProfiles).contains("production");

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
        if (databaseUrl.startsWith("postgresql://")) {
            return "jdbc:postgresql://" + databaseUrl.substring("postgresql://".length());
        }
        if (databaseUrl.startsWith("postgres://")) {
            return "jdbc:postgresql://" + databaseUrl.substring("postgres://".length());
        }
        return databaseUrl;
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
