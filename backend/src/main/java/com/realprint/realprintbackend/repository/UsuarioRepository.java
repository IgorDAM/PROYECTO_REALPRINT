package com.realprint.realprintbackend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.realprint.realprintbackend.entity.Usuario;

/**
 * Repositorio de acceso a datos de usuarios.
 *
 * Extiende JpaRepository para heredar CRUD básico y además añadimos
 * consultas personalizadas por nombre de usuario.
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Necesitamos este método para el login y para cargar usuarios en JWT.
    Optional<Usuario> findByUsername(String username);

    // Usado por "olvidé mi contraseña" para aceptar username O email como identificador.
    Optional<Usuario> findByEmail(String email);

    // Usado para validar el token de "olvidé mi contraseña" al resetear la clave.
    Optional<Usuario> findByResetToken(String resetToken);
}

