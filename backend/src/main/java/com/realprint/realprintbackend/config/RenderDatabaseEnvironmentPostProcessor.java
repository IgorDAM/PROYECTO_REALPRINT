package com.realprint.realprintbackend.config;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

/**
 * Normaliza la configuración de PostgreSQL de Render antes de que Spring cree
 * el datasource.
 */
public class RenderDatabaseEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final String PROPERTY_SOURCE_NAME = "render-database-overrides";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Map<String, Object> overrides = new LinkedHashMap<>();

        String rawUrl = firstNonBlank(
                environment.getProperty("SPRING_DATASOURCE_URL"),
                environment.getProperty("DATABASE_URL"));
        if (rawUrl != null) {
            overrides.put("spring.datasource.url", normalizeJdbcUrl(rawUrl.trim()));
        }

        String username = firstNonBlank(
                environment.getProperty("SPRING_DATASOURCE_USERNAME"),
                environment.getProperty("DB_USER"));
        if (username != null) {
            overrides.put("spring.datasource.username", username);
        }

        String password = firstNonBlank(
                environment.getProperty("SPRING_DATASOURCE_PASSWORD"),
                environment.getProperty("DB_PASSWORD"));
        if (password != null) {
            overrides.put("spring.datasource.password", password);
        }

        if (!overrides.isEmpty()) {
            environment.getPropertySources().addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, overrides));
        }
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

    static String normalizeJdbcUrl(String rawUrl) {
        if (rawUrl.startsWith("jdbc:")) {
            return rawUrl;
        }

        if (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://")) {
            String normalizedSchemeUrl = rawUrl.startsWith("postgres://")
                    ? rawUrl
                    : "postgres://" + rawUrl.substring("postgresql://".length());

            try {
                URI uri = new URI(normalizedSchemeUrl);
                String host = uri.getHost();
                int port = uri.getPort();
                String path = uri.getPath() == null ? "" : uri.getPath();
                String query = uri.getRawQuery();

                if (host == null || host.isBlank()) {
                    throw new IllegalArgumentException("DATABASE_URL no contiene host");
                }

                StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://");
                jdbcUrl.append(host);
                if (port > 0) {
                    jdbcUrl.append(":").append(port);
                }
                if (!path.isEmpty()) {
                    jdbcUrl.append(path);
                }
                if (query != null && !query.isBlank()) {
                    jdbcUrl.append("?").append(query);
                }
                return jdbcUrl.toString();
            } catch (URISyntaxException ex) {
                throw new IllegalArgumentException("DATABASE_URL no tiene un formato válido", ex);
            }
        }

        throw new IllegalArgumentException("Formato de URL de base de datos no soportado: " + rawUrl);
    }

    private static String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.trim().isEmpty()) {
                return value;
            }
        }
        return null;
    }
}
