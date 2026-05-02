-- ============================================================================
-- Script para limpiar tabla PEDIDOS en MySQL
-- Remover columnas legacy no usadas en el frontend
-- ============================================================================

-- IMPORTANTE: Hacer backup antes de ejecutar este script
-- Fecha: 2024-12-19
-- Descripción: Eliminar columnas que no se usan en el frontend actual

USE realprint_db;

-- Verificar estructura actual de la tabla
DESCRIBE pedidos;

-- ============================================================================
-- PASO 1: Remover columnas innecesarias
-- ============================================================================

-- Remover columna: subservicio
ALTER TABLE pedidos DROP COLUMN IF EXISTS subservicio;

-- Remover columna: opcion
ALTER TABLE pedidos DROP COLUMN IF EXISTS opcion;

-- Remover columna: productoFinalId
ALTER TABLE pedidos DROP COLUMN IF EXISTS producto_final_id;

-- Remover columna: boxTotal
ALTER TABLE pedidos DROP COLUMN IF EXISTS box_total;

-- Remover columna: cajasCompletadas
ALTER TABLE pedidos DROP COLUMN IF EXISTS cajas_completadas;

-- Remover columna: tamanoCaja
ALTER TABLE pedidos DROP COLUMN IF EXISTS tamano_caja;

-- Remover columna: fileUrlsJson (deprecated, usar PedidoArchivo en su lugar)
ALTER TABLE pedidos DROP COLUMN IF EXISTS file_urls_json;

-- Remover columna: cantidadUnidades (no usada)
ALTER TABLE pedidos DROP COLUMN IF EXISTS cantidad_unidades;

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

-- Los archivos ahora se gestiona mediante la tabla: pedido_archivos

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
