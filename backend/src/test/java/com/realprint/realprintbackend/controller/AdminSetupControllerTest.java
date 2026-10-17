package com.realprint.realprintbackend.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.repository.UsuarioRepository;

/**
 * Pruebas del fail-safe de /setup/admin: sin SETUP_SECRET configurado o con
 * una clave incorrecta, nadie debe poder crear un usuario ADMIN, aunque la
 * base de datos este vacia.
 */
@ExtendWith(MockitoExtension.class)
class AdminSetupControllerTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminSetupController controller;

    private AdminSetupController.AdminRequest request(String setupSecret) {
        return new AdminSetupController.AdminRequest("nuevoadmin", "Nuevo Admin", "password123", setupSecret);
    }

    @Test
    void createInitialAdminSinSetupSecretConfiguradoDevuelve403YNoCreaNada() {
        // app.setup.secret vacio (valor por defecto cuando no se define SETUP_SECRET)
        ReflectionTestUtils.setField(controller, "setupSecret", "");

        ResponseEntity<?> response = controller.createInitialAdmin(request("cualquier-cosa"));

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void createInitialAdminConClaveIncorrectaDevuelve403YNoCreaNada() {
        ReflectionTestUtils.setField(controller, "setupSecret", "la-clave-correcta");

        ResponseEntity<?> response = controller.createInitialAdmin(request("una-clave-cualquiera"));

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void createInitialAdminConClaveCorrectaYBdVaciaCreaElAdmin() {
        ReflectionTestUtils.setField(controller, "setupSecret", "la-clave-correcta");
        when(usuarioRepository.count()).thenReturn(0L);
        when(passwordEncoder.encode(any())).thenReturn("hash-simulado");

        ResponseEntity<?> response = controller.createInitialAdmin(request("la-clave-correcta"));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void createInitialAdminConClaveCorrectaPeroBdConUsuariosNoCreaNada() {
        ReflectionTestUtils.setField(controller, "setupSecret", "la-clave-correcta");
        when(usuarioRepository.count()).thenReturn(1L);

        ResponseEntity<?> response = controller.createInitialAdmin(request("la-clave-correcta"));

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void checkStatusNoRevelaElNumeroDeUsuarios() {
        when(usuarioRepository.count()).thenReturn(5L);

        ResponseEntity<?> response = controller.checkStatus();

        Object body = response.getBody();
        assertEquals(AdminSetupController.StatusResponse.class, body.getClass());
        AdminSetupController.StatusResponse status = (AdminSetupController.StatusResponse) body;
        assertEquals(false, status.needsSetup());
        // StatusResponse solo tiene needsSetup: si alguien reintroduce userCount,
        // este test deja de compilar y hay que revisarlo a proposito.
        assertEquals(1, AdminSetupController.StatusResponse.class.getRecordComponents().length);
    }
}
