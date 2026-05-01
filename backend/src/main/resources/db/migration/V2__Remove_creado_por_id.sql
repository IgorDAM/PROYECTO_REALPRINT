-- =====================================================
-- MIGRACIÓN: Remover campo creado_por_id de pedidos
-- =====================================================
-- 
-- CONTEXTO:
-- El campo creado_por_id fue diseñado originalmente para soportar
-- que el admin pueda crear pedidos en nombre de clientes.
-- 
-- Cambio de requisito:
-- - Solo CLIENTE puede crear sus propios pedidos
-- - Admin solo GESTIONA (cambiar estado, asignar precio, descargar archivos)
-- - Por lo tanto, cliente_id siempre == creado_por_id
-- 
-- SOLUCIÓN:
-- Eliminar la columna creado_por_id y su FK.
-- Usar cliente_id como único propietario.
-- =====================================================

-- Paso 1: Verificar estado actual
-- SELECT COUNT(*) as pedidos_totales FROM pedidos;
-- SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
-- WHERE TABLE_NAME = 'pedidos' AND CONSTRAINT_NAME = 'fk_pedido_creado_por';

-- Paso 2: Remover restricción FK primero
ALTER TABLE pedidos DROP FOREIGN KEY fk_pedido_creado_por;

-- Paso 3: Remover columna
ALTER TABLE pedidos DROP COLUMN creado_por_id;

-- Paso 4: Verificación post-migración
-- SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_NAME = 'pedidos' AND COLUMN_NAME IN ('cliente_id', 'creado_por_id');
-- Este último SELECT debe retornar 0 filas para creado_por_id

-- Paso 5: Backup antes de aplicar (RECOMENDADO)
-- mysqldump -u realprint -p realprint_db pedidos > pedidos_backup_$(date +%s).sql

-- =====================================================
-- ROLLBACK (si es necesario):
-- ALTER TABLE pedidos ADD COLUMN creado_por_id BIGINT NOT NULL;
-- ALTER TABLE pedidos ADD CONSTRAINT fk_pedido_creado_por 
--   FOREIGN KEY (creado_por_id) REFERENCES usuarios(id);
-- =====================================================
