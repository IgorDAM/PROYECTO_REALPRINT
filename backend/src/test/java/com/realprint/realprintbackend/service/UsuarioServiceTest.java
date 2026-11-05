package com.realprint.realprintbackend.service;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.realprint.realprintbackend.entity.RolUsuario;
import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.exception.UnauthorizedException;
import com.realprint.realprintbackend.repository.UsuarioRepository;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class UsuarioServiceTest {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Usuario clienteCreado;

    @BeforeEach
    void setUp() {
        long timestamp = System.currentTimeMillis();
        Usuario cliente = Usuario.builder()
                .username("testcliente" + timestamp)
                .nombre("Test Cliente")
                .email("testcliente" + timestamp + "@example.com")
                .rol(RolUsuario.CLIENTE)
                .passwordHash(passwordEncoder.encode("passwordOriginal"))
                .activo(true)
                .build();
        clienteCreado = usuarioRepository.save(cliente);
    }

    // --- Escalada de privilegios: un usuario que NO es ADMIN no puede cambiarse
    // su propio rol ni reactivarse/desactivarse a traves de update(). Ver
    // UsuarioController.actualizarUsuario, que calcula isAdmin a partir del rol
    // real del usuario autenticado, nunca de lo que mande el propio cliente. ---

    @Test
    void testUpdateSinSerAdminNoPuedeCambiarRolNiActivo() {
        Usuario intentoDeEscalada = Usuario.builder()
                .nombre("Test Cliente Renombrado")
                .email(clienteCreado.getEmail())
                .rol(RolUsuario.ADMIN) // <- lo que el CLIENTE intenta colarse
                .activo(false)
                .build();

        Usuario resultado = usuarioService.update(clienteCreado.getId(), intentoDeEscalada, false);

        // nombre y email SI los puede tocar el propio usuario.
        assertEquals("Test Cliente Renombrado", resultado.getNombre());

        // rol y activo deben IGNORARSE por completo cuando quien llama no es ADMIN.
        assertEquals(RolUsuario.CLIENTE, resultado.getRol(),
                "Un usuario no-ADMIN no deberia poder auto-promocionarse a ADMIN");
        assertTrue(resultado.getActivo(),
                "Un usuario no-ADMIN no deberia poder (re)activarse/desactivarse a si mismo");
    }

    @Test
    void testUpdateComoAdminSiPermiteCambiarRolYActivo() {
        Usuario cambiosAdmin = Usuario.builder()
                .nombre(clienteCreado.getNombre())
                .email(clienteCreado.getEmail())
                .rol(RolUsuario.ADMIN)
                .activo(false)
                .build();

        Usuario resultado = usuarioService.update(clienteCreado.getId(), cambiosAdmin, true);

        assertEquals(RolUsuario.ADMIN, resultado.getRol());
        assertFalse(resultado.getActivo());
    }

    @Test
    void testUpdateNuncaTocaPasswordHashAunqueVengaEnElBody() {
        String hashOriginal = clienteCreado.getPasswordHash();

        Usuario intentoDeCambiarPassword = Usuario.builder()
                .nombre(clienteCreado.getNombre())
                .email(clienteCreado.getEmail())
                .passwordHash(passwordEncoder.encode("otraContraseñaCualquiera"))
                .build();

        Usuario resultado = usuarioService.update(clienteCreado.getId(), intentoDeCambiarPassword, true);

        assertEquals(hashOriginal, resultado.getPasswordHash(),
                "UsuarioService.update no debe tocar passwordHash bajo ninguna circunstancia");
    }

    // --- Flujo de "olvidé mi contraseña" ---

    @Test
    void testRequestPasswordResetGeneraTokenParaUsuarioExistente() {
        String token = usuarioService.requestPasswordReset(clienteCreado.getUsername());

        Usuario actualizado = usuarioRepository.findById(clienteCreado.getId()).orElseThrow();
        assertNotNull(token);
        assertNotNull(actualizado.getResetToken());
        assertNotEquals(token, actualizado.getResetToken(),
                "En la BD debe guardarse el hash del token, no el token en claro");
        assertNotNull(actualizado.getResetTokenExpiry());
        assertTrue(actualizado.getResetTokenExpiry().isAfter(LocalDateTime.now()));
    }

    @Test
    void testRequestPasswordResetFuncionaTambienConEmail() {
        usuarioService.requestPasswordReset(clienteCreado.getEmail());

        Usuario actualizado = usuarioRepository.findById(clienteCreado.getId()).orElseThrow();
        assertNotNull(actualizado.getResetToken());
    }

    @Test
    void testRequestPasswordResetNoLanzaErrorSiUsuarioNoExiste() {
        // No debe revelar si el identificador existe: ni lanza excepcion ni cambia nada.
        assertDoesNotThrow(() -> usuarioService.requestPasswordReset("usuario-que-no-existe-123"));
    }

    @Test
    void testResetPasswordConTokenValidoActualizaContrasena() {
        String token = usuarioService.requestPasswordReset(clienteCreado.getUsername());

        usuarioService.resetPassword(token, "contraseñaNueva123");

        Usuario actualizado = usuarioRepository.findById(clienteCreado.getId()).orElseThrow();
        assertTrue(passwordEncoder.matches("contraseñaNueva123", actualizado.getPasswordHash()));
        // Token de un solo uso: debe quedar invalidado tras usarse.
        assertNull(actualizado.getResetToken());
        assertNull(actualizado.getResetTokenExpiry());
    }

    @Test
    void testResetPasswordConTokenInvalidoLanzaUnauthorized() {
        assertThrows(UnauthorizedException.class,
                () -> usuarioService.resetPassword("token-que-no-existe", "contraseñaNueva123"));
    }

    @Test
    void testResetPasswordConTokenCaducadoLanzaUnauthorizedYLoInvalida() {
        String token = usuarioService.requestPasswordReset(clienteCreado.getUsername());
        Usuario usuario = usuarioRepository.findById(clienteCreado.getId()).orElseThrow();

        // Forzar la caducidad manualmente.
        usuario.setResetTokenExpiry(LocalDateTime.now().minusMinutes(1));
        usuarioRepository.save(usuario);

        assertThrows(UnauthorizedException.class,
                () -> usuarioService.resetPassword(token, "contraseñaNueva123"));

        Usuario tras = usuarioRepository.findById(clienteCreado.getId()).orElseThrow();
        assertNull(tras.getResetToken(), "El token caducado debe invalidarse para que no se pueda reintentar");
    }
}
