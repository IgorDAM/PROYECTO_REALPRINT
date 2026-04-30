package com.realprint.realprintbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuración central de seguridad.
 *
 * Idea clave:
 * - No usamos sesión de servidor (JWT stateless).
 * - El filtro JWT se ejecuta antes de la autenticación estándar.
 * - Las rutas se protegen por rol desde aquí para que el control sea claro.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // Desactivamos CSRF porque trabajamos con un frontend separado y JWT.
                .csrf(csrf -> csrf.disable())
                // Permite que el backend acepte peticiones desde Vite/React.
                .cors(Customizer.withDefaults())
                // H2 console necesita iframes para verse en navegador.
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                // Stateless = no guardamos sesión en memoria del servidor.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Login y consola H2 deben quedar accesibles para arrancar y depurar.
                        .requestMatchers("/auth/login", "/h2-console/**", "/error").permitAll()
                        // Descargas de archivos: permitir acceso sin autenticación (fallback desarrollo).
                        // El controlador valida permisos si hay token JWT presente.
                        .requestMatchers("/files/**").permitAll()
                        // Solo administradores pueden listar todos los pedidos con GET /pedidos
                        // Otros como GET /pedidos/{id}, POST /pedidos, PUT /pedidos/{id} requieren auth.
                        .requestMatchers("/pedidos").hasRole("ADMIN")
                        // El resto de rutas requieren autenticación (CLIENTE o ADMIN).
                        .requestMatchers("/**").authenticated()
                        // El resto de rutas requieren autenticación.
                        .anyRequest().authenticated()
                )
                // Nuestro filtro JWT debe correr antes del filtro estándar de usuario/contraseña.
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt es el encoder recomendado para guardar hashes de contraseñas.
        return new BCryptPasswordEncoder();
    }
}