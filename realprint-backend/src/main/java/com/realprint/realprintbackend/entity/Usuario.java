package com.realprint.realprintbackend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
/**
 * Entidad JPA que representa a un usuario de la aplicación.
 *
 * La guardamos en la tabla `usuarios` porque después será la base del login
 * y de la autorización por roles.
 */
public class Usuario {

    // Identificador técnico autogenerado por la base de datos.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre de acceso único para entrar en la aplicación.
    @Column(nullable = false, unique = true)
    private String username;

    // Hash de la contraseña, nunca la contraseña en claro.
    @Column(nullable = false)
    private String passwordHash;

    // Nombre visible para mostrar en la interfaz.
    @Column(nullable = false)
    private String nombre;

    // Email opcional para contacto o recuperación.
    private String email;

    // Rol guardado como texto para que sea legible en la base de datos.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RolUsuario rol;

    // Permite desactivar el acceso sin borrar el usuario.
    @Column(nullable = false)
    @Builder.Default
    private boolean activo = true;
}
