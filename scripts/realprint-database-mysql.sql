-- ================================================================
-- SCRIPT SQL PARA REALPRINT - DISENO MEJORADO
-- ================================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS realprint_db;
USE realprint_db;

-- ================================================================
-- TABLA: usuarios
-- ================================================================
CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    rol ENUM('ADMIN', 'CLIENTE') NOT NULL DEFAULT 'CLIENTE',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_rol (rol),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA: pedidos (DISENO MEJORADO)
-- ================================================================
CREATE TABLE pedidos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Relaciones JPA explicitas
    cliente_id BIGINT NOT NULL,
    creado_por_id BIGINT NOT NULL,
    
    -- Datos del pedido
    servicio VARCHAR(255) NOT NULL,
    subservicio VARCHAR(255),
    opcion VARCHAR(255),
    producto_final_id BIGINT,
    descripcion TEXT,
    cantidad INT,
    cantidad_unidades INT,
    
    -- Fechas
    fecha DATE,
    fecha_entrega DATE,
    
    -- Medidas
    measurement_width_cm INT,
    measurement_height_cm INT,
    
    -- Archivos (deprecated, usar pedido_archivos)
    file_urls_json TEXT,
    
    -- Estado y precio
    estado ENUM('PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO') NOT NULL DEFAULT 'PENDIENTE',
    total DECIMAL(10, 2),
    
    -- Cajas (si aplica)
    box_total INT,
    cajas_completadas INT DEFAULT 0,
    tamano_caja INT,
    
    -- Auditoria
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relaciones
    CONSTRAINT fk_pedido_cliente FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_pedido_creado_por FOREIGN KEY (creado_por_id) REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Indices
    INDEX idx_cliente_id (cliente_id),
    INDEX idx_creado_por_id (creado_por_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA: pedido_archivos (NUEVA)
-- ================================================================
CREATE TABLE pedido_archivos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Relacion
    pedido_id BIGINT NOT NULL,
    
    -- Datos del archivo
    nombre_archivo VARCHAR(255) NOT NULL,
    url_archivo TEXT NOT NULL,
    tipo_mime VARCHAR(100),
    tamano_bytes BIGINT,
    
    -- Auditoria
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Relacion
    CONSTRAINT fk_archivo_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indices
    INDEX idx_pedido_id (pedido_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- DATOS DE PRUEBA
-- ================================================================

-- Insertar usuarios (hashes BCrypt para admin123 y cliente123)
INSERT INTO usuarios (username, password_hash, nombre, email, rol, activo) VALUES
('admin', '$2a$12$0E6u.UYLkV8qqGsikftDQOoQ4il.Fgodm80o54NCO9vxmZzFqZ5Li', 'Administrador Sistema', 'admin@realprint.local', 'ADMIN', TRUE),
('cliente1', '$2a$12$mUDx1LTwWIaPZ0I2swOwA.w5Jh1TGStWtB1uhwkj1XnWUVMsod5RG', 'Cliente Prueba', 'cliente1@example.com', 'CLIENTE', TRUE);

-- Insertar pedidos de prueba (ambos creados por admin, cliente1 es propietario)
INSERT INTO pedidos (cliente_id, creado_por_id, servicio, estado, total, cantidad, fecha, created_at, updated_at) VALUES
(2, 1, 'serigrafia', 'PENDIENTE', 150.00, 1, NOW(), NOW(), NOW()),
(2, 1, 'serigrafia', 'EN_PROCESO', 75.50, 1, NOW(), NOW(), NOW());

-- Insertar archivos de prueba
INSERT INTO pedido_archivos (pedido_id, nombre_archivo, url_archivo, tipo_mime, tamano_bytes) VALUES
(1, 'diseno1.png', '/uploads/pedido_1/diseno1.png', 'image/png', 102400),
(2, 'diseno2.pdf', '/uploads/pedido_2/diseno2.pdf', 'application/pdf', 204800);

-- ================================================================
-- ESTADISTICAS
-- ================================================================
SELECT 'USUARIOS CREADOS' as Info;
SELECT id, username, nombre, rol, activo FROM usuarios;

SELECT 'PEDIDOS CREADOS' as Info;
SELECT p.id, u.nombre as cliente_nombre, p.servicio, p.estado, p.total FROM pedidos p 
JOIN usuarios u ON p.cliente_id = u.id;

SELECT 'ARCHIVOS CREADOS' as Info;
SELECT id, nombre_archivo, url_archivo FROM pedido_archivos;

SELECT 'ESTADISTICAS' as Estadistica, COUNT(*) as Cantidad FROM usuarios UNION ALL
SELECT 'Total Pedidos', COUNT(*) FROM pedidos UNION ALL
SELECT 'Pedidos Pendientes', COUNT(*) FROM pedidos WHERE estado = 'PENDIENTE' UNION ALL
SELECT 'Total Archivos', COUNT(*) FROM pedido_archivos;
