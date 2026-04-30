package com.realprint.realprintbackend.config;

import java.io.IOException;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.realprint.realprintbackend.service.CustomUserDetailsService;

import lombok.RequiredArgsConstructor;

/**
 * Filtro que revisa el header Authorization en cada petición.
 *
 * Si encuentra un Bearer token válido, coloca la autenticación en el
 * SecurityContext para que Spring Security sepa quién está haciendo la llamada.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Leemos el encabezado estándar que usa JWT: Authorization: Bearer <token>
        String authHeader = request.getHeader("Authorization");

        // Si no hay Bearer token, seguimos la cadena normal
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Quitamos la palabra Bearer para quedarnos solo con el token.
        String jwt = authHeader.substring(7);
        String username = jwtService.extractUsername(jwt);

        // Evitamos sobreescribir una autenticación que ya haya sido establecida.
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(jwt, userDetails.getUsername())) {
                // Creamos el objeto de autenticación que entiende Spring Security.
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                // Añadimos detalles de la petición para trazabilidad y depuración.
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}