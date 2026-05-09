package com.realprint.realprintbackend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.realprint.realprintbackend.config.JwtService;
import com.realprint.realprintbackend.dto.LoginRequest;
import com.realprint.realprintbackend.dto.LoginResponse;
import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.exception.UnauthorizedException;
import com.realprint.realprintbackend.repository.UsuarioRepository;
import com.realprint.realprintbackend.security.RateLimiter;

import lombok.RequiredArgsConstructor;

/**
 * Servicio de autenticación.
 *
 * **Responsabilidades:**
 * 1) Prevenir ataques de fuerza bruta con rate limiting
 * 2) Buscar usuario en BD por username
 * 3) Verificar que el usuario esté activo
 * 4) Validar contraseña contra hash almacenado
 * 5) Generar token JWT válido
 * 6) Devolver respuesta en formato esperado por frontend
 *
 * **Contrato con frontend:**
 * El frontend espera una respuesta LoginResponse con estructura:
 * { token: string, user: { id, username, name, role } }
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RateLimiter rateLimiter;

    /**
     * Ejecuta el proceso de login con protección contra fuerza bruta.
     *
     * @param request Credenciales enviadas por el frontend (username + password)
     * @return Response con token y datos del usuario
     * @throws UnauthorizedException Si usuario no existe, contraseña es incorrecta, usuario está inactivo,
     *                              o se alcanzó el límite de intentos
     */
    public LoginResponse login(LoginRequest request) {
        String username = request.getUsername();

        // 1. Verificar rate limiting
        if (!rateLimiter.allowAttempt(username)) {
            int remaining = rateLimiter.getRemainingAttempts(username);
            throw new UnauthorizedException(
                "Demasiados intentos de login. Intenta de nuevo en 5 minutos. Intentos restantes: " + remaining
            );
        }

        // 2. Buscar usuario por su nombre de acceso
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> {
                    rateLimiter.recordFailedAttempt(username);
                    return new UnauthorizedException("Usuario o contraseña incorrectos");
                });

        // 3. Verificar que el usuario esté activo
        if (usuario.getActivo() == null || !usuario.getActivo()) {
            rateLimiter.recordFailedAttempt(username);
            throw new UnauthorizedException("Usuario inactivo");
        }

        // 4. Validar contraseña
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            rateLimiter.recordFailedAttempt(username);
            throw new UnauthorizedException("Usuario o contraseña incorrectos");
        }

        // 5. Login exitoso: resetear contador de intentos
        rateLimiter.resetAttempts(username);

        // 6. Generar token JWT
        String token = jwtService.generateToken(usuario);

        // 7. Construir respuesta con estructura esperada por el frontend
        return LoginResponse.builder()
                .token(token)
                .user(
                    LoginResponse.UserInfo.builder()
                        .id(usuario.getId())
                        .username(usuario.getUsername())
                        .name(usuario.getNombre())
                        .role(usuario.getRol().name().toLowerCase())
                        .build()
                )
                .build();
    }
}