package com.realprint.realprintbackend.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.realprint.realprintbackend.service.FileStorageService;

/**
 * Tests unitarios de FileController con Mockito puro.
 *
 * NOTA IMPORTANTE:
 * El método download() está protegido por @PreAuthorize("hasRole('ADMIN')").
 * Esta anotación NO se ejecuta en tests unitarios con Mockito (requiere el
 * proxy de Spring). Por eso los tests de descarga solo verifican la lógica
 * interna del método (carga y respuesta), no el control de acceso por rol.
 *
 * Para testear que un CLIENTE recibe 403 al intentar descargar, usar
 * @WebMvcTest con MockMvc y Spring Security configurado.
 */
@ExtendWith(MockitoExtension.class)
class FileControllerTest {

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private FileController fileController;

    // -----------------------------------------------------------------------
    // UPLOAD
    // -----------------------------------------------------------------------

    @Test
    void uploadClienteDevuelveUrlYNombre() {
        // El controller construye la URL con el contexto HTTP actual.
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setScheme("http");
        request.setServerName("localhost");
        request.setServerPort(8080);
        request.setContextPath("/api");
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

        when(fileStorageService.store(any(MultipartFile.class))).thenReturn("1234-diseno.pdf");

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "diseno.pdf",
                "application/pdf",
                "contenido-demo".getBytes(StandardCharsets.UTF_8));

        UsernamePasswordAuthenticationToken clienteAuth = new UsernamePasswordAuthenticationToken(
                "cliente",
                "",
                java.util.List.of(new SimpleGrantedAuthority("ROLE_CLIENTE")));

        ResponseEntity<Map<String, String>> response = fileController.upload(file, clienteAuth);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("1234-diseno.pdf", response.getBody().get("fileName"));
        assertEquals("http://localhost:8080/api/files/1234-diseno.pdf", response.getBody().get("url"));
    }

    @Test
    void uploadAdminDenegadoCon403() {
        // La guarda manual del controller rechaza a ADMIN con 403.
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "diseno.pdf",
                "application/pdf",
                "contenido-demo".getBytes(StandardCharsets.UTF_8));

        UsernamePasswordAuthenticationToken adminAuth = new UsernamePasswordAuthenticationToken(
                "admin",
                "",
                java.util.List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> fileController.upload(file, adminAuth));

        assertEquals(403, exception.getStatusCode().value());
    }

    // -----------------------------------------------------------------------
    // DOWNLOAD
    // -----------------------------------------------------------------------

    @Test
    void downloadDevuelveArchivoConHeadersCorrectos() {
        // Verifica que el método construye bien la respuesta (contenido, MIME, header).
        // La autorización real (@PreAuthorize ROLE_ADMIN) se valida en tests de integración.
        byte[] payload = "pdf-demo".getBytes(StandardCharsets.UTF_8);
        ByteArrayResource resource = new ByteArrayResource(payload);

        when(fileStorageService.load("1234-diseno.pdf")).thenReturn(
                new FileStorageService.StoredFile(resource, "1234-diseno.pdf", MediaType.APPLICATION_PDF));

        UsernamePasswordAuthenticationToken adminAuth = new UsernamePasswordAuthenticationToken(
                "admin",
                "",
                java.util.List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));

        ResponseEntity<?> response = fileController.download("1234-diseno.pdf", adminAuth);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_PDF, response.getHeaders().getContentType());
        assertEquals("attachment; filename=\"1234-diseno.pdf\"",
                response.getHeaders().getFirst("Content-Disposition"));
        assertEquals(resource, response.getBody());
    }
}