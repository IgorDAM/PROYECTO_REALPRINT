package com.realprint.realprintbackend.config;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.realprint.realprintbackend.entity.Usuario;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

/**
 * Utilidad para trabajar con JWT.
 *
 * Este componente se encarga solo de la parte técnica del token:
 * - crearlo
 * - leer datos internos (claims)
 * - comprobar si sigue siendo válido
 */
@Component
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    public String generateToken(Usuario usuario) {
        // Fecha actual = momento de emisión del token.
        Date now = new Date();
        // Calculamos la fecha de caducidad sumando la duración configurada.
        Date expiry = new Date(now.getTime() + expirationMs);

        // Guardamos el rol dentro del token para no tener que consultarlo en cada request.
        Map<String, Object> claims = Map.of("rol", usuario.getRol().name());

        return Jwts.builder()
                .claims(claims)
                .subject(usuario.getUsername())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("rol", String.class);
    }

    public boolean isTokenValid(String token, String expectedUsername) {
        String username = extractUsername(token);
        // El token es válido si pertenece al usuario esperado y no está caducado.
        return username.equals(expectedUsername) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        // Si la fecha de expiración ya pasó, el token se considera inválido.
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    private Claims extractAllClaims(String token) {
        // Parseamos el token con la clave secreta para leer sus claims de forma segura.
        return Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Key getSigningKey() {
        // La clave secreta debe tener longitud suficiente para HS256/HS384.
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}