package com.realprint.realprintbackend.service;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

/**
 * Adaptador entre nuestra entidad `Usuario` y el contrato que espera Spring Security.
 *
 * Spring no trabaja directamente con nuestras entidades JPA, sino con `UserDetails`.
 * Por eso aquí transformamos los datos de la base de datos al formato que necesita.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Buscamos el usuario real en base de datos.
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        // Spring Security trabaja con roles usando el prefijo ROLE_.
        String role = "ROLE_" + usuario.getRol().name();

        // Construimos el usuario de seguridad con username, hash y permisos.
        return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getPasswordHash())
                .disabled(!usuario.isActivo())
                .authorities(List.of(new SimpleGrantedAuthority(role)))
                .build();
    }
}