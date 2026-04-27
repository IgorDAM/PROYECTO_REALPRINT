package com.realprint.realprintbackend.controller;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.server.ResponseStatusException;

import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.repository.PedidoRepository;
import com.realprint.realprintbackend.repository.UsuarioRepository;
import com.realprint.realprintbackend.service.FileStorageService;

import lombok.RequiredArgsConstructor;

import static org.springframework.http.HttpStatus.FORBIDDEN;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;
    private final UsuarioRepository usuarioRepository;
    private final PedidoRepository pedidoRepository;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> upload(@RequestParam("file") MultipartFile file) {
        String storedName = fileStorageService.store(file);

        // Comentario didáctico: devolvemos URL absoluta para que frontend pueda abrirla
        // incluso cuando app y backend están en hosts/puertos diferentes.
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

    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<?> download(@PathVariable String fileName, Authentication authentication) {
        // Comentario didáctico: permitimos acceso en estos casos:
        // 1. Usuario autenticado y verificamos permisos
        // 2. Acceso público (fallback para desarrollo/demo local)
        if (authentication != null && authentication.isAuthenticated()) {
            validateDownloadAccess(fileName, authentication);
        } else {
            // FALLBACK: permitir descarga sin autenticación (para VITE_USE_LOCAL_AUTH=true)
            // En producción, este bloque debería estar comentado o removido
            System.out.println("ADVERTENCIA: Descargando archivo sin autenticación: " + fileName);
        }

        FileStorageService.StoredFile storedFile = fileStorageService.load(fileName);

        return ResponseEntity.ok()
                .contentType(storedFile.mediaType())
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + storedFile.fileName() + "\"")
                .body(storedFile.resource());
    }

    private void validateDownloadAccess(String fileName, Authentication authentication) {
        // Si llegamos aquí, ya sabemos que authentication != null && isAuthenticated()

        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);

        // Comentario didáctico: admin puede descargar cualquier archivo para gestionar producción.
        if (isAdmin) {
            return;
        }

        Usuario usuario = usuarioRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(FORBIDDEN, "Usuario no válido"));

        boolean belongsToUser = pedidoRepository.existsByClienteIdAndFileUrlsJsonContaining(usuario.getId(), fileName);
        if (!belongsToUser) {
            throw new ResponseStatusException(FORBIDDEN, "No tienes permisos para descargar este archivo");
        }
    }
}

