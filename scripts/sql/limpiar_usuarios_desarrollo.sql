-- Script para limpiar usuarios de desarrollo en producción
-- Ejecutar en la consola de PostgreSQL de Render

-- 1. Ver todos los usuarios actuales con sus roles
SELECT
    id,
    username,
    nombre,
    email,
    rol,
    created_at
FROM usuarios
ORDER BY created_at DESC;

-- 2. Ver cuántos usuarios hay por rol
SELECT
    rol,
    COUNT(*) as cantidad
FROM usuarios
GROUP BY rol;

-- 3. Ver pedidos asociados a usuarios OPERARIO (para verificar antes de eliminar)
SELECT
    u.username,
    u.rol,
    COUNT(p.id) as cantidad_pedidos
FROM usuarios u
LEFT JOIN pedidos p ON u.id = p.cliente_id
WHERE u.rol = 'OPERARIO'
GROUP BY u.id, u.username, u.rol;

-- 4. ELIMINAR usuarios OPERARIO que no tienen pedidos asociados
-- ADVERTENCIA: Esto eliminará permanentemente los usuarios operarios
-- Descomenta la siguiente línea solo si estás seguro:
-- DELETE FROM usuarios WHERE rol = 'OPERARIO' AND id NOT IN (SELECT DISTINCT cliente_id FROM pedidos WHERE cliente_id IS NOT NULL);

-- 5. ALTERNATIVA: Cambiar rol de OPERARIO a CLIENTE (si tienen pedidos)
-- Descomenta la siguiente línea si prefieres convertirlos en clientes:
-- UPDATE usuarios SET rol = 'CLIENTE' WHERE rol = 'OPERARIO';
