# 🔄 Instrucciones de Sincronización - Postman

## Importar colección actualizada

1. Abre Postman Desktop
2. **File → Import** (o Ctrl+O)
3. Selecciona: `docs/postman/RealPrint.postman_collection.json`
4. Si pregunta "Collection already exists":
   - ✅ Marca **"Replace"** (no "Copy")
   - Esto sobrescribirá la colección antigua

## Importar environment actualizado

1. Click en **Environments** (⚙️ arriba derecha)
2. **Import**
3. Selecciona: `docs/postman/RealPrint.postman_environment.json`
4. Si existe, reemplázalo

## Verificar cambio principal

**Antes (ANTIGUO):**
```
POST {{base_url}}/upload
```

**Ahora (CORRECTO):**
```
POST {{base_url}}/files
```

## Probar la colección

1. Selecciona environment: **"RealPrint Local"**
2. Ejecuta: `Autenticación → Login de Usuario`
   - Debe guardar automáticamente el token en `{{authToken}}`
3. Ejecuta: `Archivos → Subir archivo a una orden`
   - Debe usar `POST /files` (no `/upload`)

---

**Última actualización:** 2026-05-09
**Cambios:** Endpoint /upload → /files, correcciones de URL
