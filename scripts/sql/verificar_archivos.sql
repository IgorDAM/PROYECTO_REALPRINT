-- Script para verificar el estado de pedidos y archivos
-- Ejecutar en la consola de PostgreSQL de Render

-- 1. Ver cuántos pedidos hay en total
SELECT COUNT(*) as total_pedidos FROM pedidos;

-- 2. Ver cuántos archivos hay en pedido_archivos
SELECT COUNT(*) as total_archivos FROM pedido_archivos;

-- 3. Ver pedidos con sus archivos asociados
SELECT
    p.id as pedido_id,
    p.servicio,
    p.descripcion,
    p.fecha,
    COUNT(pa.id) as cantidad_archivos
FROM pedidos p
LEFT JOIN pedido_archivos pa ON p.id = pa.pedido_id
GROUP BY p.id, p.servicio, p.descripcion, p.fecha
ORDER BY p.id DESC;

-- 4. Ver todos los archivos registrados con sus pedidos
SELECT
    pa.id,
    pa.pedido_id,
    pa.nombre_archivo,
    pa.url_archivo,
    pa.tipo_mime,
    pa.created_at,
    p.servicio as pedido_servicio
FROM pedido_archivos pa
JOIN pedidos p ON pa.pedido_id = p.id
ORDER BY pa.created_at DESC;

-- 5. Ver pedidos SIN archivos asociados
SELECT
    p.id,
    p.servicio,
    p.descripcion,
    p.fecha,
    p.estado
FROM pedidos p
LEFT JOIN pedido_archivos pa ON p.id = pa.pedido_id
WHERE pa.id IS NULL
ORDER BY p.fecha DESC;
