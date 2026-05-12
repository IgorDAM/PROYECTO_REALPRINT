package com.realprint.realprintbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 *  Configuración de seguridad de la aplicación.
 *  - Define dos cadenas de filtros de seguridad: una para desarrollo (sin autenticación) y otra para producción (con JWT).
 *  - En desarrollo, todas las rutas son accesibles sin autenticación, y se añade un filtro de autenticación de desarrollo que simula un usuario autenticado.
 *  - En producción, se requiere autenticación JWT para todas las rutas excepto las públicas (auth, error, Swagger), y se añade el filtro de autenticación JWT.
 *  - Se deshabilita CSRF, se configuran CORS con valores por defecto, y se establece la política de sesión como stateless para ambas configuraciones.
 *  - Se utiliza BCrypt para el encoding de contraseñas.
 *  - La configuración se activa según el perfil activo: "development" para desarrollo y cualquier otro perfil para producción.
 *
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Profile("development")
    public SecurityFilterChain devSecurityFilterChain(HttpSecurity http) throws Exception {
        DevAuthenticationFilter devAuthFilter = new DevAuthenticationFilter();

        return http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(devAuthFilter, JwtAuthenticationFilter.class)
                .build();
    }

    @Bean
    @Profile("!development")
    public SecurityFilterChain prodSecurityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**", "/error", "/actuator/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}