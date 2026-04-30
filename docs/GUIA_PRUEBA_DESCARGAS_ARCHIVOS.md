# 📥 Guía de Prueba: Descargas de Archivos

## 🎯 Objetivo
Verificar que los usuarios pueden subir archivos en pedidos y que los administradores pueden descargarlos.

---

## ⚠️ REQUISITOS PREVIOS (Hacer esto primero)

### 1️⃣ Backend compilado
```bash
cd realprint-backend
mvn clean package -q -DskipTests
```

### 2️⃣ Carpeta uploads existe
```
realprint-backend/uploads/
```

### 3️⃣ SecurityConfig permite /files/**
✅ **YA HECHO** (línea 46 en SecurityConfig.java)

### 4️⃣ FileController permite fallback sin JWT
✅ **YA HECHO** (líneas 61-67 en FileController.java)

---

## 🚀 CÓMO INICIAR

### OPCIÓN A - Rápido (recomendado)
```powershell
# PowerShell
cd "D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT"
.\START_REALPRINT_FAST.bat
```

Espera a que aparezcan 2 ventanas cmd:
- **Ventana 1:** Backend en puerto 8080
- **Ventana 2:** Frontend en puerto 5173

Abre navegador: **http://localhost:5173**

---

### OPCIÓN B - Manual (control total)

**Terminal 1 (Backend):**
```bash
cd "D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\realprint-backend"
java -jar target/realprint-backend-0.0.1-SNAPSHOT.jar
```

Espera a ver: `Tomcat started on port(s): 8080`

**Terminal 2 (Frontend):**
```bash
cd "D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\App-RealPrint"
npm run dev
```

Espera a ver: `Local: http://localhost:5173/`

---

## 📋 PASOS DE PRUEBA

### PASO 1️⃣ - Loguear como Cliente

**URL:** http://localhost:5173

```
Email: cliente@example.com
Password: Cliente123!
```

Si falla, intenta con:
```
Email: admin@realprint.com
Password: Admin123!
```

(Primero cambiar a cliente en la UI)

---

### PASO 2️⃣ - Crear Pedido con Archivo

1. Click en **"Nuevo Pedido"** o accede a `/cliente/crear`
2. Completa los campos:
   - **Cantidad:** 100
   - **Ancho (cm):** 25
   - **Alto (cm):** 25
   - **Espacio (cm):** 2

3. **Subir archivo:**
   - Click en área de carga
   - Selecciona archivo **PDF, JPG, o PNG**
   - Espera a que suba (debe ver: ✅ Archivo: nombre.pdf)

4. Click **"Crear Pedido"**
   - Debe ver: "¡Pedido creado exitosamente!"
   - Redirige a **/cliente** (Mis Pedidos)

---

### PASO 3️⃣ - Loguear como Admin

1. Click en **"Cerrar Sesión"** (si es necesario)
2. Loguear como admin:
   ```
   Email: admin@realprint.com
   Password: Admin123!
   ```

3. Navega a **Gestión de Pedidos**
   - URL: http://localhost:5173/admin/pedidos

---

### PASO 4️⃣ - Buscar el Pedido Creado

En **Gestión de Pedidos:**

1. Busca por:
   - **Cliente:** "Cliente Demo" (o el nombre del cliente)
   - **Estado:** "Pendiente"

2. Encontrarás el pedido con ID similar a: **#1777312378546**

---

### PASO 5️⃣ - Ver Archivos del Pedido

1. Click en **"Ver"** (en la fila del pedido)
   - Se abre un Modal detallado

2. **Desplázate hasta "Archivos del pedido"**

3. Debes ver:
   ```
   ✅ Descargar archivo 1
   (o el nombre del archivo)
   ```

**SI VES ESTO, LA PRUEBA PASÓ** ✅

---

### PASO 6️⃣ - Descargar el Archivo

1. Click en **"Descargar archivo 1"** (o el nombre del archivo)

2. Espera a que descargue:
   - **Status:** "Descargando..."
   - Después: cambio a "Descargar archivo 1"

3. **El archivo debería estar en:** `~/Descargas/`
   - Abre la carpeta Descargas en tu PC
   - Verifica que el archivo está ahí con el nombre correcto

---

## 🐛 DEBUGGING (Si algo falla)

### ❌ "No hay archivos asociados"

**Posibles causas:**
1. El archivo no se subió correctamente en PASO 2
2. El backend no guardó el archivo
3. El campo `fileUrlsJson` está vacío en la BD

**Solución:**
- Abre DevTools (F12)
- Ve a **Network**
- Crea un nuevo pedido y sube archivo
- Busca request POST a `/pedidos`
- Verifica que en el payload incluya: `"fileUrlsJson": ["..."]`

---

### ❌ "Se ve el nombre pero sin botón de descarga"

**Problema:** El archivo NO se está convirtiendo a URL válida

**Solución:**
- Abre DevTools → **Console**
- Ejecuta:
  ```javascript
  // Copia un archivo que ves como nombre
  const fileName = "llegal.pdf";  // ejemplo
  const url = `/api/files/${fileName}`;
  console.log("URL generada:", url);
  console.log("Es descargable:", url.startsWith("/"));
  ```

- Debería imprimir: `true`

---

### ❌ "El botón aparece pero al hacer click: Error 404"

**Problema:** El archivo no existe en servidor

**Soluciones:**

**A) Verificar que el backend está corriendo:**
```bash
# En terminal
curl http://localhost:8080/api/auth/health
# Debe responder algo (incluso 403 es OK, significa que responde)
```

**B) Verificar que la carpeta uploads existe:**
```bash
ls realprint-backend/uploads/
# Debe listar archivos subidos
```

**C) Verificar que el nombre es correcto:**
```bash
# En console del navegador:
fetch('/api/files/llegal.pdf')
  .then(r => console.log("Status:", r.status))
  .catch(e => console.log("Error:", e))
```

---

### ❌ "Descarga bloqueada por CORS"

**Problema:** El backend no acepta requests del frontend

**Verificar:**
- SecurityConfig.java debe tener: `.cors(Customizer.withDefaults())`
- ✅ YA EXISTE en línea 38

**Solución:**
```bash
# Reiniciar backend
java -jar target/realprint-backend-0.0.1-SNAPSHOT.jar
```

---

## ✅ CHECKLIST FINAL

- [ ] Backend está en puerto 8080
- [ ] Frontend está en puerto 5173
- [ ] Puedo loguear como cliente
- [ ] Puedo crear pedido con archivo
- [ ] Puedo loguear como admin
- [ ] Veo el pedido en Gestión
- [ ] Abro el pedido y veo "Archivos del pedido"
- [ ] Veo botón "Descargar archivo 1"
- [ ] Click descarga el archivo
- [ ] Archivo aparece en ~/Descargas/

---

## 📞 SOPORTE

Si algo sigue fallando:

1. **Lee los logs:**
   - Terminal Backend: Busca errores tipo `FileNotFound`, `401`, `403`
   - Terminal Frontend: Busca errores tipo `Failed to fetch`

2. **Verifica la BD:**
   - El `fileUrlsJson` debe tener: `["\/api\/files\/nombre.pdf"]`

3. **Reset completo:**
   ```bash
   # Limpia todo y reinicia
   cd realprint-backend
   mvn clean package -q -DskipTests
   java -jar target/realprint-backend-0.0.1-SNAPSHOT.jar
   
   # En otra terminal:
   cd App-RealPrint
   npm run dev
   ```

---

**Última actualización:** 2026-04-27  
**Commits relevantes:**
- `26c0139` - SecurityConfig permitir /files/**
- `2c14653` - Mapear fileUrls → fileUrlsJson
- `f280e3a` - Normalización robusta de URLs

