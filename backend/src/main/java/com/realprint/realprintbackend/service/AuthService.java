package com.realprint.realprintbackend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.realprint.realprintbackend.config.JwtService;
import com.realprint.realprintbackend.dto.LoginRequest;
import com.realprint.realprintbackend.dto.LoginResponse;
import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.exception.UnauthorizedException;
import com.realprint.realprintbackend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

/**
 * Servicio de autenticación.
 *
 * **Responsabilidades:**
 * 1) Buscar usuario en BD por username
 * 2) Verificar que el usuario esté activo
 * 3) Validar contraseña contra hash almacenado
 * 4) Generar token JWT válido
 * 5) Devolver respuesta en formato esperado por frontend
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

    /**
     * Ejecuta el proceso de login.
     * @param request Credenciales enviadas por el frontend (username + password)
     * @return Response con token y datos del usuario
     * @throws UnauthorizedException Si usuario no existe, contraseña es incorrecta o usuario está inactivo
     */
    public LoginResponse login(LoginRequest request) {
        // Buscamos el usuario por su nombre de acceso.
        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Usuario o contraseña incorrectos"));

        // Un usuario desactivado no puede entrar.
        if (!usuario.isActivo()) {
            throw new UnauthorizedException("Usuario inactivo");
        }

        // Comparamos la contraseña en texto con el hash guardado en la base de datos.
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new UnauthorizedException("Usuario o contraseña incorrectos");
        }

        // Si todo es correcto, generamos el token JWT real.
        String token = jwtService.generateToken(usuario);

        // Construimos la respuesta con estructura anidada 'user' como espera el frontend.
        return LoginResponse.builder()
                .token(token)
                .user(
                    LoginResponse.UserInfo.builder()
                        .id(usuario.getId())
                        .username(usuario.getUsername())
                        .name(usuario.getNombre())
                        .role(usuario.getRol().name().toLowerCase()) // Convertir a minúsculas para consistencia
                        .build()
                )
                .build();
    }
}