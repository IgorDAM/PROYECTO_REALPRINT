# ✅ CÓMO HACER QUE FUNCIONE LA DESCARGA

## 📍 El Problema

Cuando intentas descargar archivos haciendo click en "Descargar archivo 1", "Descargar archivo 2", **no funciona**.

### Razones:
1. ✅ **CORREGIDO**: Endpoint requería JWT obligatorio (ya arreglado)
2. ⚠️ **Backend no está corriendo** 
3. ⚠️ **No hay archivos reales en la carpeta `uploads/`**
4. ⚠️ **Frontend no tiene URLs correctas de archivos guardadas**

---

## 🚀 SOLUCIÓN EN 4 PASOS

### PASO 1: Asegúrate que el Backend está corriendo

```bash
# Abre una terminal en:
D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\realprint-backend

# Ejecuta:
mvn spring-boot:run
```

**Espera hasta ver:**
```
Started RealprintBackendApplication in X.XXX seconds
... 8080 ...
```

✅ **Si ves esto**, el backend está listo en `http://localhost:8080`

---

### PASO 2: Verifica que existen archivos en `uploads/`

**Ubicación:** 
```
realprint-backend/uploads/
```

✅ Debe haber al menos un archivo como:
```
realprint-backend/
  uploads/
    └─ test-download-file.pdf   ← Archivo de prueba ya creado
```

Si la carpeta está vacía:
```bash
# En PowerShell, desde realprint-backend/:
echo "contenido de prueba" | Out-File -Encoding UTF8 "uploads/test-file.pdf"
```

---

### PASO 3: Frontend corriendo

```bash
# Abre otra terminal en:
D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\App-RealPrint

# Ejecuta si no está corriendo:
npm run dev
```

✅ Debería ver: `http://localhost:5173`

---

### PASO 4: Crear un Pedido con Archivo y Descargar

#### Opción A: Subir Archivo Real (Recomendado)

```
1. Ve a: http://localhost:5173
2. Loguéate como CLIENTE (cualquier usuario)
3. Click: "Crear Pedido"
4. Paso 2 (Detalles): "Seleccionar archivos"
5. Sube un PDF, JPG ó PNG
   → Frontend devuelve URL como: /api/files/uuid-filename.pdf
6. Completa el resto del formulario
7. Click "Crear Pedido"
8. Ahora el pedido tiene la URL guardada
```

#### Opción B: Crear Pedido Manualmente (Si quieres probar rápido)

En DevTools (F12), Console:

```javascript
// Script para crear pedido con archivo de prueba en localStorage
const pedido = {
  id: "manual-test-" + Date.now(),
  cliente: "Cliente Prueba",
  pedido: "PED-TEST-001",
  servicio: "Serigrafía",
  cantidad: 1,
  estado: "pendiente",
  fecha: new Date().toISOString().split("T")[0],
  fechaEntrega: "2026-05-15",
  descripcion: "Pedido de prueba descarga",
  fileUrls: ["/api/files/test-download-file.pdf"],  // ← URL del archivo creado
  total: 100
};

// Guardar en localStorage
const current = JSON.parse(localStorage.getItem("PEDIDOS") || "[]");
localStorage.setItem("PEDIDOS", JSON.stringify([pedido, ...current]));

// Recargar la página
location.reload();
```

**Después, el pedido debe aparecer en el listado de cliente.**

---

### PASO 5: Descargar como Admin

```
1. Ve a: http://localhost:5173/admin
2. Loguéate como ADMIN (usuario admin/admin)
3. Click en "Pedidos" (en menú lateral)
4. Busca el pedido que creaste
5. Click en "Ver" (ícono de ojo)
6. Se abre modal con detalles
7. Sección "Archivos del pedido":
   ✅ Debería ver: "Descargar archivo 1"
8. Click en "Descargar archivo 1"
9. ✅ Archivo descarga a ~/Descargas/

¡FUNCIONA! 🎉
```

---

## 🔍 VERIFICAR QUE FUNCIONA (DevTools)

### Método 1: Network Tab

```
1. F12 → Network
2. Click en "Descargar archivo 1"
3. Buscas GET request a /api/files/...
4. Status debe ser: ✅ 200 OK
5. Response Headers debe tener:
   - Content-Type: application/pdf
   - Content-Disposition: attachment
```

### Método 2: Consola

```
1. F12 → Console
2. Pega este código:

fetch('/api/files/test-download-file.pdf')
  .then(r => r.text())
  .then(text => console.log('✅ Archivo existe:', text.substring(0,50)));
```

**Resultado esperado:**
```
✅ Archivo existe: contenido de prueba
```

---

## ⚠️ ERRORES COMUNES Y SOLUCIONES

| Error | Causa | Solución |
|-------|-------|----------|
| "Failed to fetch" | Backend no corriendo | `mvn spring-boot:run` |
| "404 Not Found" | Archivo no existe | Crear archivo en `uploads/` |
| "No se descarga nada" | Frontend no tiene URL correcta | Subir archivo real desde la app |
| Abre pestaña blanca | URL incorrecta o archivo no existe | Verificar Network en DevTools |
| Descarga interrumpida | Timeout o backend detuvo | Revisar backend logs |

---

## 🎯 CHECKLIST FINAL

- [ ] Backend corriendo (`mvn spring-boot:run`)
- [ ] Frontend corriendo (`npm run dev`)
- [ ] Carpeta `uploads/` existe en `realprint-backend/`
- [ ] Al menos 1 archivo en `uploads/`
- [ ] Loguea como ADMIN en frontend
- [ ] Va a `/admin/pedidos`
- [ ] Busca un pedido con archivos
- [ ] Click "Ver"
- [ ] Ve "Archivos del pedido"
- [ ] Click "Descargar archivo 1"
- [ ] DevTools Network muestra 200 OK
- [ ] Archivo aparece en ~/Descargas/

**Si toda esta lista está ✅, ¡funciona perfectamente!**

---

## 🔴 ÚLTIMO RECURSO: REINICIA TODO

```bash
# 1. Mata todos los procesos:
# - Cierra navegador
# - Ctrl+C en ambas terminales

# 2. Limpia:
rm -r App-RealPrint/node_modules/.vite
rm -r realprint-backend/target

# 3. Reinicia:
# Terminal 1:
cd realprint-backend
mvn spring-boot:run

# Terminal 2:
cd App-RealPrint
npm run dev

# 4. Prueba nuevamente en navegador
```

---

## 📞 SOPORTE

Si aún no funciona después de estos pasos, proporciona:
1. **Error exacto que ves**
2. **Screenshot del DevTools → Network**
3. **Logs del backend (última línea)**
4. **¿Qué archivo intentas descargar?**

---

**Guía creada:** 27 de Abril de 2026  
**Última actualización:** Después del FIX en FileController.java  
**Estado:** ✅ LISTO PARA USAR

