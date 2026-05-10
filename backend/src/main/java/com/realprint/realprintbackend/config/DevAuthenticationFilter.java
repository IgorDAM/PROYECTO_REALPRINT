package com.realprint.realprintbackend.config;

import java.io.IOException;
import java.util.Arrays;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Filtro de autenticación para desarrollo.
 *
 * Inyecta automáticamente un usuario mock en SecurityContext cuando no hay autenticación.
 * Esto permite probar endpoints en Postman sin JWT en desarrollo.
 *
 * IMPORTANTE: Solo activo en perfil "development".
 * ORDEN: Se ejecuta DESPUÉS de JwtAuthenticationFilter.
 */
public class DevAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Solo inyectar usuario mock si no hay autenticación
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails devUser = User.builder()
                    .username("dev-user")
                    .password("")
                    .authorities(Arrays.asList(
                            new SimpleGrantedAuthority("ROLE_ADMIN"),
                            new SimpleGrantedAuthority("ROLE_CLIENTE")
                    ))
                    .build();

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            devUser,
                            null,
                            devUser.getAuthorities()
                    );

            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }
}
