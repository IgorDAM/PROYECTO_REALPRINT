package com.realprint.realprintbackend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.exception.UnauthorizedException;
import com.realprint.realprintbackend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

/**
 * Servicio de gestión de usuarios.
 *
 * **Responsabilidades:**
 * - CRUD de usuarios
 * - Búsquedas y filtrados
 * - Validaciones de negocio
 *
 * **Operaciones:**
 * - findAll() - Listar todos los usuarios
 * - findById() - Buscar usuario por ID
 * - save() - Crear nuevo usuario
 * - update() - Actualizar usuario existente
 * - delete() - Eliminar usuario
 * - findByUsername() - Buscar por nombre de usuario
 */
@Service
@RequiredArgsConstructor // Lombok genera constructor con los campos finales (usuarioRepository, passwordEncoder)
@Transactional // Todas las operaciones de este servicio se ejecutan dentro de una transacción de base de datos(begin,commit, rollback)
public class UsuarioService {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    // Caducidad del token de recuperación de contraseña.
    private static final long RESET_TOKEN_VALIDITY_MINUTES = 30;

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder; // Inyectamos el PasswordEncoder para manejar contraseñas de forma segura


    /**
     * Devuelve todos los usuarios registrados.
     *
     * **Seguridad:**
     * Este método debería llamarse solo desde controladores protegidos por @PreAuthorize("hasRole('ADMIN')").
     *
     * @return Lista de todos los usuarios
     */
    @Transactional(readOnly = true)
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    /**
     * Devuelve todos los usuarios registrados con paginación.
     *
     * **Seguridad:**
     * Este método debería llamarse solo desde controladores protegidos por @PreAuthorize("hasRole('ADMIN')").
     *
     * @param pageable Configuración de paginación y ordenamiento
     * @return Página de usuarios
     */
    @Transactional(readOnly = true)
    public Page<Usuario> findAll(Pageable pageable) {
        return usuarioRepository.findAll(pageable);
    }

    /**
     * Busca un usuario por ID.
     *
     * @param id ID del usuario
     * @return El usuario encontrado
     * @throws UnauthorizedException Si no existe
     */
    @Transactional(readOnly = true)
    public Usuario findById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado con id: " + id));
    }

    /**
     * Busca un usuario por nombre de usuario (username).
     *
     * Usado principalmente en login y JWT.
     *
     * @param username El nombre de usuario
     * @return El usuario encontrado
     * @throws UnauthorizedException Si no existe
     */
    @Transactional(readOnly = true)
    public Usuario findByUsername(String username) {
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado: " + username));
    }

    /**
     * Crea un nuevo usuario en la base de datos.
     *
     * **Validaciones:**
     * - Username debe ser único
     * - Password debe ser hasheado
     * - Usuario nuevo inicia activo por defecto
     *
     * @param usuario El usuario a crear
     * @return El usuario creado con ID asignado
     * @throws IllegalArgumentException Si el username ya existe
     */
    public Usuario save(Usuario usuario) {
        // Validar que el username sea único
        if (usuario.getUsername() != null && usuarioRepository.findByUsername(usuario.getUsername()).isPresent()) {
            throw new IllegalArgumentException("El usuario " + usuario.getUsername() + " ya existe");
        }

        // Asegurar que la contraseña está hasheada
        if (usuario.getPasswordHash() != null && !usuario.getPasswordHash().startsWith("$2")) {
            usuario.setPasswordHash(passwordEncoder.encode(usuario.getPasswordHash()));
        }

        // Establecer activo = true por defecto si es null
        if (usuario.getActivo() == null) {
            usuario.setActivo(true);
        }

        return usuarioRepository.save(usuario);
    }

    /**
     * Actualiza un usuario existente.
     *
     * **Importante:**
     * - El passwordHash NO se actualiza desde este método
     * - Usa PasswordEncoder si se cambió la contraseña
     *
     * @param id ID del usuario a actualizar
     * @param usuarioActualizado Los datos actualizados
     * @return El usuario actualizado
     * @throws UnauthorizedException Si no existe
     */
    public Usuario update(Long id, Usuario usuarioActualizado, boolean isAdmin) {
        Usuario usuarioExistente = findById(id);

        // Estos campos los puede tocar cualquiera (ADMIN o el propio usuario)
        usuarioExistente.setNombre(usuarioActualizado.getNombre());
        usuarioExistente.setEmail(usuarioActualizado.getEmail());

        // rol y activo SOLO los puede cambiar un ADMIN.
        // Si el que llama no es ADMIN, se ignoran aunque vengan en el body.
        if (isAdmin) {
            usuarioExistente.setRol(usuarioActualizado.getRol());
            if (usuarioActualizado.getActivo() != null) {
                usuarioExistente.setActivo(usuarioActualizado.getActivo());
            }
        }
        // NUNCA actualizar passwordHash desde aquí

        return usuarioRepository.save(usuarioExistente);
    }

    /**
     * Cambia la contraseña de un usuario.
     *
     * **Seguridad:**
     * - Verificar contraseña anterior
     * - Hashear la nueva contraseña
     * - Registro de auditoría recomendado
     *
     * @param id ID del usuario
     * @param passwordActual La contraseña actual en texto plano
     * @param passwordNueva La nueva contraseña en texto plano
     * @throws UnauthorizedException Si la contraseña actual es incorrecta
     */
    public Usuario changePassword(Long id, String passwordActual, String passwordNueva) {
        Usuario usuario = findById(id);

        // Verificar contraseña actual
        if (!passwordEncoder.matches(passwordActual, usuario.getPasswordHash())) {
            throw new UnauthorizedException("Contraseña actual incorrecta");
        }

        // Hashear y establecer nueva contraseña
        usuario.setPasswordHash(passwordEncoder.encode(passwordNueva));
        return usuarioRepository.save(usuario);
    }

    /**
     * Elimina un usuario por ID.
     *
     * **Importante:**
     * En una app real, podríamos preferir borrado lógico (softdelete)
     * en lugar de borrado físico.
     *
     * @param id ID del usuario a eliminar
     * @throws UnauthorizedException Si no existe
     */
    public void delete(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new UnauthorizedException("Usuario no encontrado con id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    /**
     * Desactiva un usuario sin borrarlo.
     *
     * Versión "soft" de eliminación que preserva auditoría.
     *
     * @param id ID del usuario a desactivar
     */
    public Usuario deactivate(Long id) {
        Usuario usuario = findById(id);
        usuario.setActivo(false);
        return usuarioRepository.save(usuario);
    }

    /**
     * Inicia el flujo de "olvidé mi contraseña".
     *
     * **Seguridad:**
     * - Nunca revela si el identificador (username o email) existe o no: el
     *   controlador siempre responde igual, exista o no el usuario.
     * - Genera un token de un solo uso con caducidad de {@link #RESET_TOKEN_VALIDITY_MINUTES}
     *   minutos y lo guarda en el propio usuario.
     *
     * **Limitación conocida:** este proyecto no tiene configurado un proveedor de
     * email (SMTP/SendGrid/etc.), así que el enlace de recuperación se escribe en
     * el log del backend en vez de enviarse por correo. Conectar un envío real de
     * email queda como mejora pendiente.
     *
     * @param identifier username o email del usuario
     */
    public void requestPasswordReset(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            return;
        }

        Usuario usuario = usuarioRepository.findByUsername(identifier)
                .or(() -> usuarioRepository.findByEmail(identifier))
                .orElse(null);

        // No revelar si el usuario existe: si no lo encontramos, simplemente no hacemos nada.
        if (usuario == null) {
            logger.info("Solicitud de recuperación de contraseña para un identificador no encontrado");
            return;
        }

        String token = UUID.randomUUID().toString();
        usuario.setResetToken(token);
        usuario.setResetTokenExpiry(LocalDateTime.now().plusMinutes(RESET_TOKEN_VALIDITY_MINUTES));
        usuarioRepository.save(usuario);

        // TODO: enviar este enlace por email cuando haya un proveedor de correo configurado.
        logger.info("Token de recuperación de contraseña generado para el usuario '{}': /reset-password?token={} (caduca en {} min)",
                usuario.getUsername(), token, RESET_TOKEN_VALIDITY_MINUTES);
    }

    /**
     * Completa el flujo de "olvidé mi contraseña": valida el token y establece la nueva contraseña.
     *
     * @param token El token recibido en el enlace de recuperación
     * @param nuevaPassword La nueva contraseña en texto plano
     * @throws UnauthorizedException Si el token no existe o ha caducado
     */
    public void resetPassword(String token, String nuevaPassword) {
        Usuario usuario = usuarioRepository.findByResetToken(token)
                .orElseThrow(() -> new UnauthorizedException("El enlace de recuperación no es válido"));

        if (usuario.getResetTokenExpiry() == null || usuario.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            // Invalidar el token caducado para que no pueda reintentarse.
            usuario.setResetToken(null);
            usuario.setResetTokenExpiry(null);
            usuarioRepository.save(usuario);
            throw new UnauthorizedException("El enlace de recuperación ha caducado, solicita uno nuevo");
        }

        usuario.setPasswordHash(passwordEncoder.encode(nuevaPassword));
        // Token de un solo uso: se invalida en cuanto se usa.
        usuario.setResetToken(null);
        usuario.setResetTokenExpiry(null);
        usuarioRepository.save(usuario);
    }
}

