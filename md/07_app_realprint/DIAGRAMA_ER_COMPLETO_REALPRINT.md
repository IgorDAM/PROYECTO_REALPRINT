# Diagrama ER completo - RealPrint

Fecha: 2026-03-29  
Alcance: modelo ER objetivo para Spring Boot + Hibernate + MySQL, con entidades, atributos, PK/FK y cardinalidades.

```mermaid
erDiagram
    USUARIOS {
        BIGINT id PK
        VARCHAR username UK
        VARCHAR password_hash
        VARCHAR nombre
        VARCHAR email UK
        VARCHAR role
        BOOLEAN activo
        DATETIME created_at
        DATETIME updated_at
    }

    INVENTARIO_ITEMS {
        BIGINT id PK
        VARCHAR nombre
        VARCHAR categoria
        INT stock
        INT stock_minimo
        DECIMAL precio
        BOOLEAN disponible_para_pedidos
        INT usados
        DATETIME created_at
        DATETIME updated_at
    }

    INVENTARIO_ITEM_SERVICIOS {
        BIGINT inventario_item_id FK
        VARCHAR servicio
    }

    PRODUCTOS_FINALES {
        BIGINT id PK
        VARCHAR nombre
        VARCHAR servicio
        VARCHAR subservicio
        VARCHAR quien_ropa
        VARCHAR prenda
        VARCHAR modelo
        VARCHAR talla
        DECIMAL precio
        BOOLEAN en_caja
        INT tamano_caja
        DATETIME created_at
        DATETIME updated_at
    }

    PRODUCTO_FINAL_MATERIALES {
        BIGINT producto_final_id FK
        BIGINT inventario_item_id FK
        DECIMAL cantidad
    }

    PRODUCTO_FINAL_CLIENTES {
        BIGINT producto_final_id FK
        BIGINT cliente_id FK
    }

    PEDIDOS {
        BIGINT id PK
        BIGINT cliente_id FK
        BIGINT producto_final_id FK
        INT cantidad
        VARCHAR estado
        DATE fecha_entrega
        TEXT observaciones
        DATETIME created_at
        DATETIME updated_at
    }

    TAREAS {
        BIGINT id PK
        BIGINT pedido_id FK
        BIGINT operario_id FK
        VARCHAR estado
        TEXT descripcion
        DATETIME created_at
        DATETIME updated_at
    }

    INVENTARIO_ITEMS ||--o{ INVENTARIO_ITEM_SERVICIOS : tiene_servicios

    PRODUCTOS_FINALES ||--o{ PRODUCTO_FINAL_MATERIALES : usa_materiales
    INVENTARIO_ITEMS ||--o{ PRODUCTO_FINAL_MATERIALES : se_usa_en

    PRODUCTOS_FINALES ||--o{ PRODUCTO_FINAL_CLIENTES : habilita_para
    USUARIOS ||--o{ PRODUCTO_FINAL_CLIENTES : cliente_habilitado

    USUARIOS ||--o{ PEDIDOS : realiza
    PRODUCTOS_FINALES ||--o{ PEDIDOS : se_pide

    PEDIDOS ||--o{ TAREAS : genera
    USUARIOS ||--o{ TAREAS : asignada_a
```

## Reglas funcionales asociadas

- `USUARIOS.role` controla actor funcional (`ADMIN`, `CLIENTE`, `OPERARIO`).
- `PEDIDOS.cliente_id` debe referenciar un usuario con rol `CLIENTE`.
- `TAREAS.operario_id` debe referenciar un usuario con rol `OPERARIO`.
- Las tablas puente `PRODUCTO_FINAL_MATERIALES` y `PRODUCTO_FINAL_CLIENTES` implementan relaciones N:M.

## Referencias

- Vista solo entidades: `md/07_app_realprint/DIAGRAMA_ER_SOLO_ENTIDADES.md`
- Mapa de arquitectura objetivo: `md/07_app_realprint/MAPA_ARQUITECTURA_OBJETIVO_MYSQL_SPRINGBOOT.md`

