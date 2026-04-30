package com.realprint.realprintbackend.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Optional;

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

import com.realprint.realprintbackend.entity.RolUsuario;
import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.repository.PedidoRepository;
import com.realprint.realprintbackend.repository.UsuarioRepository;
import com.realprint.realprintbackend.service.FileStorageService;

@ExtendWith(MockitoExtension.class)
class FileControllerTest {

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PedidoRepository pedidoRepository;

    @InjectMocks
    private FileController fileController;

    @Test
    void uploadDevuelveUrlYNombre() {
        // Comentario didáctico: el controlador construye URL con el contexto HTTP actual.
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

    @Test
    void downloadDevuelveAdjunto() {
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
        assertEquals("attachment; filename=\"1234-diseno.pdf\"", response.getHeaders().getFirst("Content-Disposition"));
        assertEquals(resource, response.getBody());
    }

    @Test
    void downloadClientePropietarioPermitido() {
        byte[] payload = "png-demo".getBytes(StandardCharsets.UTF_8);
        ByteArrayResource resource = new ByteArrayResource(payload);

        Usuario cliente = Usuario.builder()
                .id(42L)
                .username("cliente")
                .passwordHash("hash")
                .nombre("Cliente")
                .email("cliente@demo.com")
                .rol(RolUsuario.CLIENTE)
                .activo(true)
                .build();

        when(usuarioRepository.findByUsername("cliente")).thenReturn(Optional.of(cliente));
        when(pedidoRepository.existsByClienteIdAndFileUrlsJsonContaining(42L, "1234-diseno.pdf")).thenReturn(true);
        when(fileStorageService.load("1234-diseno.pdf")).thenReturn(
                new FileStorageService.StoredFile(resource, "1234-diseno.pdf", MediaType.APPLICATION_PDF));

        UsernamePasswordAuthenticationToken clienteAuth = new UsernamePasswordAuthenticationToken(
                "cliente",
                "",
                java.util.List.of(new SimpleGrantedAuthority("ROLE_CLIENTE")));

        ResponseEntity<?> response = fileController.download("1234-diseno.pdf", clienteAuth);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(resource, response.getBody());
    }

    @Test
    void downloadClienteNoPropietarioDenegado() {
        Usuario cliente = Usuario.builder()
                .id(77L)
                .username("cliente")
                .passwordHash("hash")
                .nombre("Cliente")
                .email("cliente@demo.com")
                .rol(RolUsuario.CLIENTE)
                .activo(true)
                .build();

        when(usuarioRepository.findByUsername("cliente")).thenReturn(Optional.of(cliente));
        when(pedidoRepository.existsByClienteIdAndFileUrlsJsonContaining(77L, "1234-diseno.pdf")).thenReturn(false);

        UsernamePasswordAuthenticationToken clienteAuth = new UsernamePasswordAuthenticationToken(
                "cliente",
                "",
                java.util.List.of(new SimpleGrantedAuthority("ROLE_CLIENTE")));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> fileController.download("1234-diseno.pdf", clienteAuth));

        assertEquals(403, exception.getStatusCode().value());
    }
}

