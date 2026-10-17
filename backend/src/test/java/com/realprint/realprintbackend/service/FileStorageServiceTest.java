package com.realprint.realprintbackend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

/**
 * Comprueba que FileStorageService valida el contenido real del archivo
 * (firma de los primeros bytes) y no solo la extensión del nombre.
 */
class FileStorageServiceTest {

    private static final byte[] PDF_BYTES = "%PDF-1.4 test".getBytes(StandardCharsets.US_ASCII);
    private static final byte[] JPEG_BYTES = {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, 0x00, 0x10};
    private static final byte[] PNG_BYTES = {(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00};

    @TempDir
    Path tempDir;

    private FileStorageService service;

    @BeforeEach
    void setUp() {
        service = new FileStorageService();
        ReflectionTestUtils.setField(service, "uploadDir", tempDir.toString());
        service.init();
    }

    @Test
    void aceptaPdfConFirmaValida() throws IOException {
        String stored = service.store(new MockMultipartFile("file", "diseno.pdf", "application/pdf", PDF_BYTES));

        assertTrue(Files.exists(tempDir.resolve(stored)));
    }

    @Test
    void aceptaJpegConFirmaValida() throws IOException {
        String stored = service.store(new MockMultipartFile("file", "foto.jpg", "image/jpeg", JPEG_BYTES));

        assertTrue(Files.exists(tempDir.resolve(stored)));
    }

    @Test
    void aceptaPngConFirmaValida() throws IOException {
        String stored = service.store(new MockMultipartFile("file", "logo.png", "image/png", PNG_BYTES));

        assertTrue(Files.exists(tempDir.resolve(stored)));
    }

    @Test
    void rechazaPngConContenidoFalsoYNoGuardaNada() throws IOException {
        MockMultipartFile falso = new MockMultipartFile("file", "foto.png", "image/png", "hola".getBytes(StandardCharsets.US_ASCII));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> service.store(falso));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        try (var archivos = Files.list(tempDir)) {
            assertEquals(0, archivos.count(), "No debe quedar ningún archivo en disco");
        }
    }

    @Test
    void rechazaArchivoMasCortoQueLaFirma() {
        MockMultipartFile corto = new MockMultipartFile("file", "logo.png", "image/png", new byte[] {(byte) 0x89, 0x50});

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> service.store(corto));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
    }

    @Test
    void rechazaExtensionNoPermitidaAunqueElContenidoSeaUnPdf() {
        MockMultipartFile exe = new MockMultipartFile("file", "programa.exe", "application/octet-stream", PDF_BYTES);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> service.store(exe));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
    }
}
