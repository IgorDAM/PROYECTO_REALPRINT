package com.realprint.realprintbackend.controller;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.realprint.realprintbackend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Endpoints de salud del sistema para keep-alive y monitorización.
 */
@RestController
@RequestMapping("/health")
@RequiredArgsConstructor
@Tag(name = "Health", description = "Endpoints de comprobación de estado del backend y la base de datos")
public class HealthController {

    private final UsuarioRepository usuarioRepository;

    /**
     * Ping ligero del backend sin tocar la base de datos.
     */
    @Operation(
        summary = "Health check básico",
        description = "Devuelve un estado OK del backend sin consultar la base de datos."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Backend disponible")
    })
    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", "ok");
        body.put("service", "realprint-backend");
        body.put("timestamp", OffsetDateTime.now().toString());
        return ResponseEntity.ok(body);
    }

    /**
     * Ping de salud que fuerza una consulta real a la base de datos.
     * Útil para keep-alive externo y para evitar cold start del pool de JPA.
     */
    @Operation(
        summary = "Health check de base de datos",
        description = "Ejecuta una consulta sobre la base de datos para comprobar conectividad y mantenerla activa."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Base de datos disponible")
    })
    @GetMapping("/db")
    public ResponseEntity<Map<String, Object>> databaseHealth() {
        long usuarioCount = usuarioRepository.count();

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", "ok");
        body.put("database", "ok");
        body.put("checkedTable", "usuario");
        body.put("rowCount", usuarioCount);
        body.put("timestamp", OffsetDateTime.now().toString());
        return ResponseEntity.ok(body);
    }
}

