package com.realprint.realprintbackend.security;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

/**
 * Rate limiter simple para prevenir ataques de fuerza bruta.
 *
 * **Estrategia:**
 * - Máximo 5 intentos por username en 5 minutos
 * - Después de 5 intentos, bloquea por 5 minutos
 * - Los intentos exitosos resetean el contador
 *
 * **Implementación:**
 * - ConcurrentHashMap para thread-safety
 * - Limpieza automática de entradas expiradas
 * - Sin dependencias externas
 *
 * @see AuthService para uso en login
 */
@Component
public class RateLimiter {

    private static final int MAX_ATTEMPTS = 5;
    private static final long WINDOW_MS = 5 * 60 * 1000; // 5 minutos

    private final Map<String, AttemptRecord> attempts = new ConcurrentHashMap<>();

    /**
     * Verifica si el usuario puede intentar login.
     *
     * @param username Nombre de usuario
     * @return true si puede intentar, false si está bloqueado
     */
    public boolean allowAttempt(String username) {
        cleanupExpiredEntries();

        AttemptRecord record = attempts.get(username);

        if (record == null) {
            return true;
        }

        // Si está fuera de la ventana de tiempo, permitir
        if (isExpired(record)) {
            attempts.remove(username);
            return true;
        }

        // Si alcanzó el máximo, bloquear
        return record.count < MAX_ATTEMPTS;
    }

    /**
     * Registra un intento fallido.
     *
     * @param username Nombre de usuario
     */
    public void recordFailedAttempt(String username) {
        attempts.compute(username, (key, record) -> {
            if (record == null || isExpired(record)) {
                return new AttemptRecord(1, Instant.now().toEpochMilli());
            }
            return new AttemptRecord(record.count + 1, record.firstAttemptTime);
        });
    }

    /**
     * Resetea el contador de intentos (usado en login exitoso).
     *
     * @param username Nombre de usuario
     */
    public void resetAttempts(String username) {
        attempts.remove(username);
    }

    /**
     * Obtiene cuántos intentos quedan.
     *
     * @param username Nombre de usuario
     * @return Intentos restantes
     */
    public int getRemainingAttempts(String username) {
        AttemptRecord record = attempts.get(username);

        if (record == null || isExpired(record)) {
            return MAX_ATTEMPTS;
        }

        return Math.max(0, MAX_ATTEMPTS - record.count);
    }

    /**
     * Verifica si un registro ha expirado.
     */
    private boolean isExpired(AttemptRecord record) {
        long now = Instant.now().toEpochMilli();
        return (now - record.firstAttemptTime) > WINDOW_MS;
    }

    /**
     * Limpia entradas expiradas para evitar crecimiento infinito.
     */
    private void cleanupExpiredEntries() {
        attempts.entrySet().removeIf(entry -> isExpired(entry.getValue()));
    }

    /**
     * Registro de intentos de login.
     */
    private static class AttemptRecord {
        final int count;
        final long firstAttemptTime;

        AttemptRecord(int count, long firstAttemptTime) {
            this.count = count;
            this.firstAttemptTime = firstAttemptTime;
        }
    }
}
