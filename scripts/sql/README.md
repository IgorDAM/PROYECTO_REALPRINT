# 🗄️ Scripts SQL - RealPrint

Scripts de mantenimiento y utilidad para la base de datos.

---

## 📋 Scripts disponibles

### cleanup_pedidos_table.sql
Limpia y optimiza la tabla de pedidos.
- Elimina pedidos antiguos
- Resetea IDs
- Optimiza índices

### limpiar_usuarios_desarrollo.sql
Limpia usuarios de prueba en entorno de desarrollo.
- **⚠️ NO ejecutar en producción**
- Mantiene solo usuarios admin
- Útil para resetear ambiente de desarrollo

### verificar_archivos.sql
Verifica integridad de archivos asociados a pedidos.
- Lista archivos huérfanos
- Verifica rutas de archivos
- Detecta inconsistencias

---

## 🚀 Cómo usar

### En MySQL Workbench:
1. Abrir el script
2. Conectar a la BD adecuada
3. Ejecutar (Ctrl+Shift+Enter)

### En línea de comandos:
```powershell
mysql -u root -p realprint_db < scripts/sql/nombre_script.sql
```

---

## ⚠️ Precauciones

- **Hacer backup antes** de ejecutar scripts destructivos
- Verificar la BD activa con `SELECT DATABASE();`
- Los scripts de limpieza son irreversibles
- Usar solo en desarrollo a menos que se indique lo contrario

---

**Última actualización**: 2026-05-16
