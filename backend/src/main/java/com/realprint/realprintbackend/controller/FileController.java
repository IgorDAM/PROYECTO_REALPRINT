package com.realprint.realprintbackend.controller;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.server.ResponseStatusException;

import com.realprint.realprintbackend.service.FileStorageService;

import lombok.RequiredArgsConstructor;

import static org.springframework.http.HttpStatus.FORBIDDEN;

/**
 * Controlador REST para gestión de archivos.
 *
 * CAMBIOS mejorados:
 * - POST /upload: Solo CLIENTE puede subir archivos a sus pedidos
 * - GET /files/*: Solo ADMIN puede descargar (para gestión de producción)
 *
 * Uploads (CLIENTE):
 * - Validación de tamaño: máx 10MB
 * - Validación de formato: PDF, JPG, PNG
 * - Almacenamiento seguro con UUID + nombre original
 *
 * Downloads (ADMIN):
 * - Acceso total para admin
 * - Admin gestiona archivos durante la producción
 */
@RestController
@RequestMapping
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    /**
     * POST /upload
     *
     * Subir archivo a una orden.
     * RESTRICCIÓN: Solo CLIENTE puede subir archivos.
     * Admin intentando subir → 403 Forbidden
     *
     * Validaciones:
     * - Tamaño máximo: 10MB
     * - Formatos permitidos: PDF, JPG, PNG
     *
     * @param file Archivo a subir
     * @param auth Contexto de autenticación
     * @return URL del archivo almacenado
     * @throws ResponseStatusException 403 si es ADMIN
     * @throws ResponseStatusException 400 si archivo inválido
     */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> upload(
            @RequestParam("file") MultipartFile file,
            Authentication auth) {
        
        // VALIDACIÓN: Solo CLIENTE puede subir
        boolean isAdmin = auth.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .anyMatch("ROLE_ADMIN"::equals);
        
        if (isAdmin) {
            throw new ResponseStatusException(
                FORBIDDEN,
                "Solo los clientes pueden cargar archivos en sus pedidos. " +
                "Los administradores gestionan la producción."
            );
        }

        // Validar y almacenar archivo
        String storedName = fileStorageService.store(file);

        // Construir URL para acceso por admin
        String fileUrl = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/files/")
                .path(storedName)
                .toUriString();

        return ResponseEntity.ok(Map.of(
                "url", fileUrl,
                "fileUrl", fileUrl,
                "fileName", storedName
        ));
    }

    /**
     * GET /files/{fileName}
     *
     * Descargar archivo de una orden.
     * RESTRICCIÓN: Solo ADMIN puede descargar (para gestión de producción).
     * Cliente intentando descargar → 403 Forbidden
     *
     * @param fileName Nombre del archivo almacenado
     * @param auth Contexto de autenticación (requerido)
     * @return Archivo binario con headers MIME
     * @throws ResponseStatusException 403 si es CLIENTE
     * @throws ResponseStatusException 404 si archivo no existe
     */
    @GetMapping("/files/{fileName:.+}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> download(
            @PathVariable String fileName,
            Authentication auth) {

        // Cargar y servir archivo
        FileStorageService.StoredFile storedFile = fileStorageService.load(fileName);

        return ResponseEntity.ok()
                .contentType(storedFile.mediaType())
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=\"" + storedFile.fileName() + "\"")
                .body(storedFile.resource());
    }
}
