-- ================================================================
-- SCRIPT SQL PARA REALPRINT
-- Schema sincronizado con entidades Java (Pedido, Usuario, PedidoArchivo)
-- ================================================================

CREATE DATABASE IF NOT EXISTS realprint_db;
USE realprint_db;

-- ================================================================
-- TABLA: usuarios
-- Sincronizada con entity: Usuario.java
-- ================================================================
CREATE TABLE IF NOT EXISTS usuarios (
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
-- TABLA: pedidos
-- Sincronizada con entity: Pedido.java
-- NOTA: sin creado_por_id (eliminado del diseño), sin columnas legacy
-- ================================================================
CREATE TABLE IF NOT EXISTS pedidos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Propietario del pedido (relacion @ManyToOne → usuarios)
    cliente_id BIGINT NOT NULL,

    -- Datos del pedido
    servicio VARCHAR(255) NOT NULL,
    descripcion TEXT,
    cantidad INT,

    -- Fechas
    fecha DATE,
    fecha_entrega DATE,

    -- Medidas del diseno
    measurement_width_cm INT,
    measurement_height_cm INT,

    -- Estado con todos los valores del enum PedidoEstado.java
    estado ENUM('PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'ENVIADO', 'CANCELADO') NOT NULL DEFAULT 'PENDIENTE',

    -- Precio total
    total DECIMAL(10, 2),

    -- Auditoria
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Clave foranea
    CONSTRAINT fk_pedido_cliente FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE,

    -- Indices
    INDEX idx_cliente_id (cliente_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA: pedido_archivos
-- Sincronizada con entity: PedidoArchivo.java
-- ================================================================
CREATE TABLE IF NOT EXISTS pedido_archivos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Relacion con pedido
    pedido_id BIGINT NOT NULL,

    -- Datos del archivo
    nombre_archivo VARCHAR(255) NOT NULL,
    url_archivo TEXT NOT NULL,
    tipo_mime VARCHAR(100),
    tamano_bytes BIGINT,

    -- Auditoria
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Clave foranea
    CONSTRAINT fk_archivo_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE ON UPDATE CASCADE,

    -- Indices
    INDEX idx_pedido_id (pedido_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- DATOS DE PRUEBA
-- Contrasenas: admin123 y cliente123 (BCrypt cost=12)
-- ================================================================
INSERT INTO usuarios (username, password_hash, nombre, email, rol, activo) VALUES
('admin', '$2a$12$0E6u.UYLkV8qqGsikftDQOoQ4il.Fgodm80o54NCO9vxmZzFqZ5Li', 'Administrador Sistema', 'admin@realprint.local', 'ADMIN', TRUE),
('cliente1', '$2a$12$mUDx1LTwWIaPZ0I2swOwA.w5Jh1TGStWtB1uhwkj1XnWUVMsod5RG', 'Cliente Prueba', 'cliente1@example.com', 'CLIENTE', TRUE);

-- Pedidos de prueba (cliente1 es propietario)
INSERT INTO pedidos (cliente_id, servicio, estado, total, cantidad, fecha, created_at, updated_at) VALUES
(2, 'serigrafia', 'PENDIENTE', 150.00, 1, CURDATE(), NOW(), NOW()),
(2, 'serigrafia', 'EN_PROCESO', 75.50, 1, CURDATE(), NOW(), NOW());

-- Archivos de prueba
INSERT INTO pedido_archivos (pedido_id, nombre_archivo, url_archivo, tipo_mime, tamano_bytes) VALUES
(1, 'diseno1.png', '/uploads/diseno1.png', 'image/png', 102400),
(2, 'diseno2.pdf', '/uploads/diseno2.pdf', 'application/pdf', 204800);

-- ================================================================
-- VERIFICACION
-- ================================================================
SELECT 'USUARIOS' as Tabla, COUNT(*) as Total FROM usuarios
UNION ALL SELECT 'PEDIDOS', COUNT(*) FROM pedidos
UNION ALL SELECT 'ARCHIVOS', COUNT(*) FROM pedido_archivos;
