package com.realprint.realprintbackend.config;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class ProductionDataSourceConfigTest {

    @Test
    void normalizeJdbcUrlConvertsRenderPostgresUriToJdbc() {
        String jdbcUrl = ProductionDataSourceConfig.normalizeJdbcUrl(
                "postgres://user:password@dpg-abc123.render.com:5432/realprint_db?sslmode=require");

        assertEquals(
                "jdbc:postgresql://dpg-abc123.render.com:5432/realprint_db?sslmode=require",
                jdbcUrl);
    }

    @Test
    void normalizeJdbcUrlKeepsJdbcUrlsUntouched() {
        String jdbcUrl = ProductionDataSourceConfig.normalizeJdbcUrl(
                "jdbc:postgresql://localhost:5432/realprint_db?sslmode=require");

        assertEquals(
                "jdbc:postgresql://localhost:5432/realprint_db?sslmode=require",
                jdbcUrl);
    }
}
