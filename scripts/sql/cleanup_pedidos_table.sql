-- ============================================================================
-- Script para limpiar tabla PEDIDOS en MySQL (Compatible con MySQL 5.7+)
-- Remover columnas legacy no usadas en el frontend
-- ============================================================================

-- IMPORTANTE: Hacer backup antes de ejecutar este script
-- Fecha: 2024-12-19
-- Descripción: Eliminar columnas que no se usan en el frontend actual
-- Compatibilidad: MySQL 5.7, 5.6, MariaDB, etc.

USE realprint_db;

-- Verificar estructura actual de la tabla
DESCRIBE pedidos;

-- ============================================================================
-- PASO 1: Remover columnas innecesarias
-- Compatible con MySQL 5.7 y anteriores (sin IF EXISTS)
-- ============================================================================

-- Remover columna: subservicio
ALTER TABLE pedidos DROP COLUMN subservicio;

-- Remover columna: opcion
ALTER TABLE pedidos DROP COLUMN opcion;

-- Remover columna: productoFinalId (nombre en BD: producto_final_id)
ALTER TABLE pedidos DROP COLUMN producto_final_id;

-- Remover columna: boxTotal (nombre en BD: box_total)
ALTER TABLE pedidos DROP COLUMN box_total;

-- Remover columna: cajasCompletadas (nombre en BD: cajas_completadas)
ALTER TABLE pedidos DROP COLUMN cajas_completadas;

-- Remover columna: tamanoCaja (nombre en BD: tamano_caja)
ALTER TABLE pedidos DROP COLUMN tamano_caja;

-- Remover columna: fileUrlsJson (nombre en BD: file_urls_json)
-- Deprecated, usar PedidoArchivo en su lugar
ALTER TABLE pedidos DROP COLUMN file_urls_json;

-- Remover columna: cantidadUnidades (nombre en BD: cantidad_unidades)
ALTER TABLE pedidos DROP COLUMN cantidad_unidades;

-- ============================================================================
-- PASO 2: Verificar estructura final
-- ============================================================================

DESCRIBE pedidos;

-- ============================================================================
-- PASO 3: Resumen de cambios
-- ============================================================================

-- La tabla PEDIDOS ahora contiene SOLO estas columnas:
-- - id (PK)
-- - cliente_id (FK)
-- - servicio (VARCHAR)
-- - descripcion (TEXT)
-- - cantidad (INT)
-- - fecha (DATE)
-- - fecha_entrega (DATE)
-- - measurement_width_cm (INT)
-- - measurement_height_cm (INT)
-- - estado (ENUM: PENDIENTE, EN_PROCESO, COMPLETADO, ENVIADO, CANCELADO)
-- - total (DECIMAL)
-- - created_at (TIMESTAMP)
-- - updated_at (TIMESTAMP)

-- Los archivos ahora se gestionan mediante la tabla: pedido_archivos

-- ============================================================================
-- PASO 4: Verificar integridad de datos (OPCIONAL)
-- ============================================================================

-- Contar pedidos
SELECT COUNT(*) as total_pedidos FROM pedidos;

-- Ver primeros 5 pedidos
SELECT id, cliente_id, servicio, estado, total, created_at 
FROM pedidos 
LIMIT 5;

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
