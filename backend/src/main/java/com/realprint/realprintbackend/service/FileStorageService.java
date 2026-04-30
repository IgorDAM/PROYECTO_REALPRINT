package com.realprint.realprintbackend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import jakarta.annotation.PostConstruct;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class FileStorageService {

    private static final long MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "jpg", "jpeg", "png");

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private Path rootPath;

    @PostConstruct
    void init() {
        try {
            rootPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(rootPath);
        } catch (IOException ex) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "No se pudo inicializar el directorio de archivos", ex);
        }
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "Debes adjuntar un archivo");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new ResponseStatusException(BAD_REQUEST, "El archivo supera el tamaño máximo permitido (10 MB)");
        }

        String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "archivo" : file.getOriginalFilename());
        String extension = extractExtension(originalName);

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ResponseStatusException(BAD_REQUEST, "Formato no permitido. Usa PDF, JPG o PNG");
        }

        String safeName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String storedName = UUID.randomUUID() + "-" + safeName;

        Path target = rootPath.resolve(storedName).normalize();
        if (!target.startsWith(rootPath)) {
            throw new ResponseStatusException(BAD_REQUEST, "Nombre de archivo inválido");
        }

        try {
            // Comentario didáctico: REPLACE_EXISTING permite reintentos sin dejar el flujo bloqueado.
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return storedName;
        } catch (IOException ex) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "No se pudo guardar el archivo", ex);
        }
    }

    public StoredFile load(String fileName) {
        String normalizedName = Paths.get(fileName).getFileName().toString();
        Path filePath = rootPath.resolve(normalizedName).normalize();

        if (!filePath.startsWith(rootPath) || !Files.exists(filePath)) {
            throw new ResponseStatusException(NOT_FOUND, "Archivo no encontrado");
        }

        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new ResponseStatusException(NOT_FOUND, "Archivo no disponible");
            }

            return new StoredFile(resource, normalizedName, resolveMediaType(normalizedName));
        } catch (IOException ex) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "No se pudo leer el archivo", ex);
        }
    }

    private String extractExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == fileName.length() - 1) {
            return "";
        }
        return fileName.substring(dotIndex + 1).toLowerCase(Locale.ROOT);
    }

    private MediaType resolveMediaType(String fileName) {
        String extension = extractExtension(fileName);
        return switch (extension) {
            case "pdf" -> MediaType.APPLICATION_PDF;
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
            case "png" -> MediaType.IMAGE_PNG;
            default -> MediaType.APPLICATION_OCTET_STREAM;
        };
    }

    public record StoredFile(Resource resource, String fileName, MediaType mediaType) {
    }
}

