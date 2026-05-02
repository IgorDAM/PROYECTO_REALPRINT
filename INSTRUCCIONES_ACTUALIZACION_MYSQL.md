# 📋 Script SQL para Actualizar Tabla PEDIDOS

## ⚠️ IMPORTANTE: HACER BACKUP ANTES

Antes de ejecutar cualquier script SQL, **haz un backup de tu base de datos**:

```bash
# En terminal (si tienes MySQL instalado)
mysqldump -u root -p realprint_db > backup_pedidos_$(date +%Y%m%d_%H%M%S).sql
```

O desde MySQL Workbench:
1. Click derecho en `realprint_db`
2. Selecciona "Data Export"
3. Guarda el backup

---

## 📝 Script SQL

El script está en: `./scripts/sql/cleanup_pedidos_table.sql`

### Columnas que serán ELIMINADAS:

| Columna (Java) | Columna (DB) | Razón |
|---|---|---|
| `subservicio` | `subservicio` | No se usa en frontend |
| `opcion` | `opcion` | No se usa en frontend |
| `productoFinalId` | `producto_final_id` | No se usa en frontend |
| `boxTotal` | `box_total` | Legacy |
| `cajasCompletadas` | `cajas_completadas` | Legacy |
| `tamanoCaja` | `tamano_caja` | Legacy |
| `fileUrlsJson` | `file_urls_json` | Deprecated (usar PedidoArchivo) |
| `cantidadUnidades` | `cantidad_unidades` | No se usa |

### Columnas que PERMANECEN:

```sql
id                      INT (PK)
cliente_id              INT (FK)
servicio                VARCHAR
descripcion             TEXT
cantidad                INT
fecha                   DATE
fecha_entrega           DATE
measurement_width_cm    INT
measurement_height_cm   INT
estado                  ENUM
total                   DECIMAL(10,2)
created_at              TIMESTAMP
updated_at              TIMESTAMP
```

---

## 🔄 Pasos de Ejecución

### **Opción 1: Desde MySQL Workbench**

1. Abre MySQL Workbench
2. Conecta a tu servidor MySQL
3. Abre una nueva pestaña de Query (`File → New Query Tab`)
4. Copia y pega el contenido de `cleanup_pedidos_table.sql`
5. Ejecuta el script completo (`Ctrl + Shift + Enter` o botón "Execute")
6. Verifica los resultados en la consola

### **Opción 2: Desde Terminal/CMD**

```bash
# Conectarse a MySQL y ejecutar el script
mysql -u root -p realprint_db < scripts/sql/cleanup_pedidos_table.sql

# O si MySQL está en PATH:
mysql -u tu_usuario -p tu_contraseña realprint_db < ./scripts/sql/cleanup_pedidos_table.sql
```

### **Opción 3: Ejecutar paso a paso (SEGURO)**

Si prefieres validar cada paso:

```sql
-- 1. Seleccionar BD
USE realprint_db;

-- 2. Ver estructura actual
DESCRIBE pedidos;

-- 3. Remover cada columna
ALTER TABLE pedidos DROP COLUMN IF EXISTS subservicio;
ALTER TABLE pedidos DROP COLUMN IF EXISTS opcion;
ALTER TABLE pedidos DROP COLUMN IF EXISTS producto_final_id;
-- ... etc (ver script completo)

-- 4. Verificar estructura final
DESCRIBE pedidos;
```

---

## ✅ Verificación Post-Ejecución

Después de ejecutar el script, verifica:

```sql
-- Ver estructura final
DESCRIBE pedidos;

-- Contar pedidos (no deben cambiar)
SELECT COUNT(*) FROM pedidos;

-- Ver datos de ejemplo
SELECT id, cliente_id, servicio, estado, total, created_at 
FROM pedidos 
LIMIT 5;
```

---

## 🔙 Si Necesitas Revertir

Si algo va mal, restaura desde el backup:

```bash
mysql -u root -p realprint_db < backup_pedidos_YYYYMMDD_HHMMSS.sql
```

---

## 📊 Relación con los Cambios en Backend

Este script SQL sincroniza con los cambios en:
- `Pedido.java` - Removidas propiedades
- `PedidoDTO.java` - DTO simplificado
- `PedidoMapper.java` - Mapeo actualizado

### Tras ejecutar este script:

✅ La BD estará alineada con el código Java
✅ El frontend recibe solo los datos que necesita
✅ Menos transferencia de datos en API responses
✅ Código más limpio y mantenible

---

## 📌 Notas Importantes

1. **No afecta archivos**: Los archivos se gestionan via tabla `pedido_archivos`, no `file_urls_json`
2. **Sin pérdida de pedidos**: Solo se eliminan columnas vacías/no usadas
3. **Compatible con migraciones**: Si usas Liquibase/Flyway, actualiza los changesets
4. **Backups**: Mantén backups regularmente

---

**Fecha**: 2024-12-19  
**Estado**: ✅ Listo para ejecutar
