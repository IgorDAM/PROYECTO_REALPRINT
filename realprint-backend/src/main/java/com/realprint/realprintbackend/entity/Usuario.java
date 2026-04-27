package com.realprint.realprintbackend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
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
    private boolean activo = true;

    public Usuario() {
    }

    public Usuario(String username, String passwordHash, String nombre, String email, RolUsuario rol) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.activo = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public RolUsuario getRol() {
        return rol;
    }

    public void setRol(RolUsuario rol) {
        this.rol = rol;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }
}

