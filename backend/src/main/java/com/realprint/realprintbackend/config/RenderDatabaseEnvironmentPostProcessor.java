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

        // Parsear: [user[:password]@]host[:port]/database[?params]
        String user = null;
        String password = null;
        String host = null;
        String port = "5432";
        String database = "";
        String params = "";

        // Separar database y parámetros
        int slashIdx = urlWithoutScheme.indexOf('/');
        String authority;
        if (slashIdx > 0) {
            authority = urlWithoutScheme.substring(0, slashIdx);
            String rest = urlWithoutScheme.substring(slashIdx + 1);
            int qIdx = rest.indexOf('?');
            if (qIdx > 0) {
                database = rest.substring(0, qIdx);
                params = rest.substring(qIdx);
            } else {
                database = rest;
            }
        } else {
            authority = urlWithoutScheme;
        }

        // Parsear autoridad: [user[:password]@]host[:port]
        int atIdx = authority.lastIndexOf('@');
        if (atIdx > 0) {
            String credentials = authority.substring(0, atIdx);
            String hostPort = authority.substring(atIdx + 1);

            int colonIdx = credentials.indexOf(':');
            if (colonIdx > 0) {
                user = credentials.substring(0, colonIdx);
                password = credentials.substring(colonIdx + 1);
            } else {
                user = credentials;
            }

            // Parsear host:port
            int portColonIdx = hostPort.lastIndexOf(':');
            if (portColonIdx > 0) {
                host = hostPort.substring(0, portColonIdx);
                port = hostPort.substring(portColonIdx + 1);
            } else {
                host = hostPort;
            }
        } else {
            // Sin credenciales
            int portColonIdx = authority.lastIndexOf(':');
            if (portColonIdx > 0) {
                host = authority.substring(0, portColonIdx);
                port = authority.substring(portColonIdx + 1);
            } else {
                host = authority;
            }
        }

        // Construir URL JDBC sin credenciales en la URL
        String url = "jdbc:postgresql://" + host + ":" + port + "/" + database + params;

        // Agregar parámetros de usuario y contraseña
        if (user != null) {
            String sep = params.isEmpty() ? "?" : "&";
            url += sep + "user=" + user;
            if (password != null) {
                url += "&password=" + password;
            }
        }

        return url;
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
