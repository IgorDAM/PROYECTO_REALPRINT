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
}

