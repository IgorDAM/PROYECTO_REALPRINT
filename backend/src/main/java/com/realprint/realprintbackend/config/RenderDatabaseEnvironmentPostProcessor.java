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

        if (databaseUrl != null && !databaseUrl.isBlank()) {
            String jdbcUrl = normalizeUrl(databaseUrl.trim());

            Map<String, Object> props = new LinkedHashMap<>();
            props.put("spring.datasource.url", jdbcUrl);

            environment.getPropertySources().addFirst(
                    new MapPropertySource("database-url-from-render", props));
        }
    }

    private static String normalizeUrl(String databaseUrl) {
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

    private static void extractCredentialsFromUrl(String rawUrl, Map<String, Object> overrides,
            ConfigurableEnvironment environment) {
        if (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://")) {
            String normalizedSchemeUrl = rawUrl.startsWith("postgres://")
                    ? rawUrl
                    : "postgres://" + rawUrl.substring("postgresql://".length());

            try {
                URI uri = new URI(normalizedSchemeUrl);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && !userInfo.isBlank()) {
                    String[] parts = userInfo.split(":", 2);
                    if (parts.length >= 1 && !parts[0].isBlank()) {
                        overrides.put("spring.datasource.username", parts[0]);
                    }
                    if (parts.length >= 2 && !parts[1].isBlank()) {
                        overrides.put("spring.datasource.password", parts[1]);
                    }
                }
            } catch (URISyntaxException ex) {
                // Ignorar errores de parsing, las credenciales están en la URL ya
            }
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
                String userInfo = uri.getUserInfo();
                String host = uri.getHost();
                int port = uri.getPort();
                String path = uri.getPath() == null ? "" : uri.getPath();
                String query = uri.getRawQuery();

                if (host == null || host.isBlank()) {
                    throw new IllegalArgumentException("DATABASE_URL no contiene host");
                }

                StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://");
                if (userInfo != null && !userInfo.isBlank()) {
                    jdbcUrl.append(userInfo).append("@");
                }
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
