package com.realprint.realprintbackend.service;

import java.util.List;

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
@RequiredArgsConstructor
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

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
    public Usuario update(Long id, Usuario usuarioActualizado) {
        Usuario usuarioExistente = findById(id);

        // Actualizar solo los campos permitidos
        usuarioExistente.setNombre(usuarioActualizado.getNombre());
        usuarioExistente.setEmail(usuarioActualizado.getEmail());
        usuarioExistente.setRol(usuarioActualizado.getRol());
        usuarioExistente.setActivo(usuarioActualizado.isActivo());
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
}

