package com.realprint.realprintbackend.controller;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.realprint.realprintbackend.service.FileStorageService;

import lombok.RequiredArgsConstructor;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses; // ✅ faltaba este
// Content, Schema, ArraySchema eliminados — no se usan en este controller

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
@Tag (name = "Archivos", description = "Operaciones relacionadas con la gestión de archivos para pedidos")
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
    @Operation  (summary = "Subir archivo a una orden",
               description = "Permite a los clientes subir archivos relacionados con sus pedidos. Solo los usuarios con rol CLIENTE pueden realizar esta acción." +
                                "Los administradores no tienen permitido subir archivos, ya que su función es gestionar la producción.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Archivo subido exitosamente, se devuelve la URL del archivo."),
        @ApiResponse(responseCode = "400", description = "Archivo inválido (tamaño o formato no permitido)."),
        @ApiResponse(responseCode = "403", description = "Acceso denegado. Solo los clientes pueden subir archivos.")
    })
    @PostMapping("/upload")
    @PreAuthorize("@securityRules.canUploadFile(authentication)")
    public ResponseEntity<Map<String, String>> upload(
            @RequestParam("file") MultipartFile file) {
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
    @Operation  (summary = "Descargar archivo de una orden",
               description = "Permite a los administradores descargar archivos relacionados con los pedidos para gestionar la producción. Solo los usuarios con rol ADMIN pueden realizar esta acción." +
                                "Los clientes no tienen permitido descargar archivos, ya que su función es crear pedidos y subir archivos relacionados.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Archivo descargado exitosamente."),
        @ApiResponse(responseCode = "403", description = "Acceso denegado. Solo los administradores pueden descargar archivos."),
        @ApiResponse(responseCode = "404", description = "Archivo no encontrado.")
    })
    @GetMapping("/files/{fileName:.+}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> download(
            @PathVariable String fileName) {

        // Cargar y servir archivo
        FileStorageService.StoredFile storedFile = fileStorageService.load(fileName);

        return ResponseEntity.ok()
                .contentType(storedFile.mediaType())
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=\"" + storedFile.fileName() + "\"")
                .body(storedFile.resource());
    }
}
