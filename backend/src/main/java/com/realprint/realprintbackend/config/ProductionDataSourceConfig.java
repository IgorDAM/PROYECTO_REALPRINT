package com.realprint.realprintbackend.config;

import java.net.URI;
import java.net.URISyntaxException;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import com.zaxxer.hikari.HikariDataSource;

/**
 * Configuración explícita de datasource para producción.
 *
 * Render expone DATABASE_URL como URL PostgreSQL sin prefijo JDBC, así que aquí
 * normalizamos el valor antes de inicializar Hibernate.
 */
@Configuration
@Profile("production")
public class ProductionDataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(ProductionDataSourceConfig.class);

    private final Environment environment;

    public ProductionDataSourceConfig(Environment environment) {
        this.environment = environment;
    }

    @Bean(name = "dataSource")
    @Primary
    public DataSource dataSource() {
        DatabaseConnectionInfo connectionInfo = resolveConnectionInfo();

        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(connectionInfo.jdbcUrl());
        dataSource.setUsername(connectionInfo.username());
        dataSource.setPassword(connectionInfo.password());
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setMaximumPoolSize(20);
        dataSource.setMinimumIdle(2);
        dataSource.setConnectionTimeout(30000L);
        dataSource.setIdleTimeout(600000L);
        dataSource.setMaxLifetime(1800000L);

        log.info("Datasource de producción configurado con {}", connectionInfo.obfuscatedJdbcUrl());
        return dataSource;
    }

    private DatabaseConnectionInfo resolveConnectionInfo() {
        String rawUrl = firstNonBlank(
                environment.getProperty("SPRING_DATASOURCE_URL"),
                environment.getProperty("DATABASE_URL"),
                environment.getProperty("DB_URL"));

        if (rawUrl == null || rawUrl.trim().isEmpty()) {
            String host = firstNonBlank(environment.getProperty("DB_HOST"), "localhost");
            String port = firstNonBlank(environment.getProperty("DB_PORT"), "5432");
            String database = firstNonBlank(environment.getProperty("DB_NAME"), "realprint_db");
            return new DatabaseConnectionInfo(
                    "jdbc:postgresql://" + host + ":" + port + "/" + database + "?sslmode=require",
                    firstNonBlank(
                            environment.getProperty("SPRING_DATASOURCE_USERNAME"),
                            environment.getProperty("DB_USER"),
                            "postgres"),
                    firstNonBlank(
                            environment.getProperty("SPRING_DATASOURCE_PASSWORD"),
                            environment.getProperty("DB_PASSWORD"),
                            ""));
        }

        String normalizedUrl = normalizeJdbcUrl(rawUrl.trim());
        String username = firstNonBlank(
                environment.getProperty("SPRING_DATASOURCE_USERNAME"),
                environment.getProperty("DB_USER"),
                extractUsernameFromUrl(rawUrl),
                "postgres");
        String password = firstNonBlank(
                environment.getProperty("SPRING_DATASOURCE_PASSWORD"),
                environment.getProperty("DB_PASSWORD"),
                extractPasswordFromUrl(rawUrl),
                "");

        return new DatabaseConnectionInfo(
                normalizedUrl,
                username,
                password);
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

    private static String extractUsernameFromUrl(String rawUrl) {
        try {
            URI uri = new URI(rawUrl.startsWith("postgresql://")
                    ? "postgres://" + rawUrl.substring("postgresql://".length())
                    : rawUrl);
            if (uri.getUserInfo() == null || uri.getUserInfo().isBlank()) {
                return "";
            }
            String[] parts = uri.getUserInfo().split(":", 2);
            return parts.length > 0 ? parts[0] : "";
        } catch (URISyntaxException ex) {
            return "";
        }
    }

    private static String extractPasswordFromUrl(String rawUrl) {
        try {
            URI uri = new URI(rawUrl.startsWith("postgresql://")
                    ? "postgres://" + rawUrl.substring("postgresql://".length())
                    : rawUrl);
            if (uri.getUserInfo() == null || uri.getUserInfo().isBlank()) {
                return "";
            }
            String[] parts = uri.getUserInfo().split(":", 2);
            return parts.length > 1 ? parts[1] : "";
        } catch (URISyntaxException ex) {
            return "";
        }
    }

    private static String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.trim().isEmpty()) {
                return value;
            }
        }
        return null;
    }

    private record DatabaseConnectionInfo(String jdbcUrl, String username, String password) {
        String obfuscatedJdbcUrl() {
            return jdbcUrl.replaceFirst("//[^/@]+@", "//***:***@");
        }
    }
}
