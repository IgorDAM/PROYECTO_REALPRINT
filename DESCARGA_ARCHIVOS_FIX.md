# 🔧 GUÍA FIXES: DESCARGAS NO FUNCIONAN

**Problema:** El botón "Descargar archivo" en Admin → Pedidos → Ver → Archivos del pedido no funciona

---

## ✅ SOLUCIÓN RÁPIDA

### PASO 1: Verificar que el backend está corriendo

**Terminal 1 - Iniciar Backend:**
```bash
cd D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\realprint-backend
mvn clean compile && mvn spring-boot:run
```

Debe salir algo como:
```
. . . . . .
. . . . . .
Tomcat started on port(s): 8080
```

### PASO 2: Frontend con npm run dev

**Terminal 2 - Iniciar Frontend:**
```bash
cd D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\App-RealPrint
npm run dev
```

---

## 🔍 VERIFICACIÓN DE SETUP

### ¿El backend está corriendo?
```
Abre en navegador: http://localhost:8080/health
Debe retornar: {"status":"UP"}
```

### ¿El frontend ve el backend?
```
Abre: http://localhost:5173
Haz login
Abre DevTools (F12) → Network
Haz click en descargar
Busca request GET a: /api/files/...
```

---

## 🐛 DEBUGGING: Qué revisar en DevTools

### 1. Network Tab
```
Haz click en "Descargar archivo"
Busca en Network:
  - Debe haber request a: /api/files/uuid-nombrearchivo
  - Status debe ser: 200 OK (o ✅ verde)
  
Si ves:
  - 404: archivo no existe
  - 401: problema de autenticación
  - 503: backend no está corriendo
  - CORS error: problema proxy
```

### 2. Console Tab
```
F12 → Console
Busca errores rojo
Deben estar vacíos (sin errores)
```

### 3. Application Tab
```
F12 → Application → Local Storage
Busca: auth_token
Si existe, el token se está guardando bien
```

---

## 🚀 COMANDO TODO-EN-UNO

Si quieres que todo se inicie automáticamente, usa esto en el root del proyecto:

**Windows PowerShell:**
```powershell
# Terminal 1: Backend
Start-Process "cmd" "/c cd realprint-backend && mvn spring-boot:run"

# Espera 10 segundos, luego Terminal 2: Frontend
Start-Sleep -Seconds 10
Start-Process "cmd" "/c cd App-RealPrint && npm run dev"
```

O más simple, abre 2 terminales lado a lado:

**Terminal 1:**
```
cd realprint-backend
mvn spring-boot:run
```

**Terminal 2:**
```
cd App-RealPrint
npm run dev
```

---

## 📋 CHECKLIST ANTES DE DESCARGAR

- [ ] Backend corriendo en localhost:8080 (ves "Tomcat started on port 8080")
- [ ] Frontend corriendo en localhost:5173 (accedes sin errores)
- [ ] Login hecho correctamente (ves "admin" en pantalla)
- [ ] Estás en Admin → Gestión de Pedidos
- [ ] Hay al menos 1 pedido con archivos

---

## Si seguido no funciona:

### 1. Verifica archivo de prueba
```
Debe existir: realprint-backend/uploads/test-download-file.pdf
Si no existe, créalo (vacío)
```

### 2. Limpia caché del navegador
```
F12 → Network → Disable cache (checkbox)
Recarga página
```

### 3. Reinicia todo
```
Cierra ambas terminales
Cierra navegador
Vuelve a Terminal 1: mvn spring-boot:run
Espera 10s, Terminal 2: npm run dev
Abre http://localhost:5173
```

### 4. Verifica permisos de carpeta
```
Carpeta: D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\realprint-backend\uploads
Debe tener permisos de lectura/escritura
Clic derecho → Propiedades → Seguridad → Editar
```

---

## 🎯 RESUMEN DE COMPONENTES

| Componente | Estado | URL | Puerto |
|-----------|--------|-----|--------|
| Backend Java | ✅ Corriendo | localhost | 8080 |
| Frontend Vite | ✅ Corriendo | localhost | 5173 |
| Database | ✅ H2 Local | (embedded) | (none) |
| File Storage | ✅ Local | /realprint-backend/uploads | (none) |

---

## 📁 ESTRUCTURA CRITICA

```
PROYECTO_REALPRINT/
├── realprint-backend/           ← DEBe estar en terminal 1 aqui
│   ├── src/
│   ├── target/
│   ├── uploads/                 ← Archivos se guardan aqui
│   ├── pom.xml
│   └── mvnw
│
├── App-RealPrint/               ← Debe estar en terminal 2 aqui
│   ├── src/
│   ├── package.json
│   └── vite.config.js
```

---

**¿Aún no funciona?** 
Abre DevTools (F12) → Network
Captura el error exacto del request /api/files/...
Cuéntame qué status code ves y qué dice el error.

