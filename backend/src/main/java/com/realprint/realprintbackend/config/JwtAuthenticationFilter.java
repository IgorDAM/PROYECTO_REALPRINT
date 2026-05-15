package com.realprint.realprintbackend.config;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
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
import lombok.extern.slf4j.Slf4j;

/**
 * Filtro de autenticación JWT:
 * - Intercepta cada solicitud entrante.
 * - Permite rutas públicas sin token (Swagger, auth, error).
 * - Para otras rutas, busca el token en el header "Authorization".
 * - Si el token es válido, carga los detalles del usuario y establece la autenticación en el contexto de seguridad.
 * - Maneja errores de token sin limpiar el contexto, dejando que otros filtros lo manejen (ej. para 403).
 * - Usa Lombok para inyección de dependencias y logging.
 * - Este filtro se ejecuta antes de que Spring Security procese la solicitud, asegurando que el contexto de seguridad esté configurado correctamente para rutas protegidas.
 */

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // 🔓 Rutas públicas (no pasan por JWT)
        // Nota: context-path es /api, así que las rutas internas no tienen ese prefijo
        if (path.startsWith("/swagger-ui") ||
                path.startsWith("/v3/api-docs") ||
                path.startsWith("/auth") ||
                path.startsWith("/setup") ||
                path.startsWith("/error")) {

            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        // 🔓 Sin token → sigue el filtro normal (Spring decidirá si es 403)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // 🔐 Extraer token
            String jwt = authHeader.substring(7);

            String username = jwtService.extractUsername(jwt);

            // 🔐 Solo autenticar si no hay ya contexto
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // 🔐 Validar token
                if (jwtService.isTokenValid(jwt, userDetails.getUsername())) {

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    log.warn("JWT inválido para usuario: {}", username);
                }
            }

        } catch (Exception e) {
            log.warn("Error procesando JWT: {}", e.getMessage());
            // NO limpiar el contexto aquí, dejar que otros filtros lo manejen
        }

        filterChain.doFilter(request, response);
    }
}