package com.realprint.realprintbackend.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import com.realprint.realprintbackend.service.FileStorageService;

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

        ResponseEntity<Map<String, String>> response = fileController.upload(file);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("1234-diseno.pdf", response.getBody().get("fileName"));
        assertEquals("http://localhost:8080/api/files/1234-diseno.pdf", response.getBody().get("url"));
    }

    // NOTA: el test de ADMIN 403 en upload no puede hacerse con Mockito puro.
    // @PreAuthorize no se ejecuta sin el proxy de Spring.
    // Para testear el 403 real, usar @WebMvcTest + MockMvc + @WithMockUser.

    // -----------------------------------------------------------------------
    // DOWNLOAD
    // -----------------------------------------------------------------------

    @Test
    void downloadDevuelveArchivoConHeadersCorrectos() {
        byte[] payload = "pdf-demo".getBytes(StandardCharsets.UTF_8);
        ByteArrayResource resource = new ByteArrayResource(payload);

        when(fileStorageService.load("1234-diseno.pdf")).thenReturn(
                new FileStorageService.StoredFile(resource, "1234-diseno.pdf", MediaType.APPLICATION_PDF));

        ResponseEntity<?> response = fileController.download("1234-diseno.pdf");

        assertEquals(200, response.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_PDF, response.getHeaders().getContentType());
        assertEquals("attachment; filename=\"1234-diseno.pdf\"",
                response.getHeaders().getFirst("Content-Disposition"));
        assertEquals(resource, response.getBody());
    }
}