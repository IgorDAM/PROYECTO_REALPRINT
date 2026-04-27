# 📚 ÍNDICE: FLUJO DE ARCHIVOS EN REALPRINT

**Guía rápida para entender cómo viajan los archivos del cliente al admin.**

---

## 🎯 Elige tu Nivel de Profundidad

### 5 MINUTOS - Overview Rápido
👉 **Este documento (lectura actual)**  
Responde: ¿A dónde van los archivos? ¿Cómo los descargo?

---

### 15 MINUTOS - Explicación Detallada
👉 **[FLUJO_ARCHIVOS_CLIENTE_ADMIN.md](FLUJO_ARCHIVOS_CLIENTE_ADMIN.md)**  
Incluye:
- ✅ Flujo general en 3 pasos
- ✅ Lado cliente: Cómo se suben
- ✅ Lado backend: Dónde se guardan
- ✅ Lado admin: Cómo se descargan
- ✅ Control de acceso y seguridad
- ✅ Endpoints completos con ejemplos
- ✅ Code snippets del proyecto real

**Ideal para:** Developers que quieren entender el punto-a-punto

---

### 25 MINUTOS - Diagramas y Visuales
👉 **[DIAGRAMAS_FLUJO_ARCHIVOS.md](DIAGRAMAS_FLUJO_ARCHIVOS.md)**  
Incluye:
- 📊 8 diagramas visuales ASCII
- 🎨 Arquitectura general (Cliente → Backend → Admin)
- 🔄 Flujo de carga (Cliente → Backend)
- 📥 Flujo de descarga (Admin → Backend → Admin)
- 🔐 Matriz de acceso/permisos
- ⚠️ Estados HTTP y sus significados
- 🧅 Capas de seguridad
- ⏱️ Ciclo de vida completo de un archivo

**Ideal para:** Visual learners, presentaciones, design reviews

---

## 📋 RESPUESTA RÁPIDA A TUS PREGUNTAS

### ❓ ¿A dónde van los archivos que envía el cliente?

**Respuesta Corta:**
1. Cliente sube PDF/JPG/PNG en `Step2Details.tsx`
2. Frontend hace `POST /upload` con el archivo
3. Backend valida (formato, tamaño, seguridad)
4. Backend guarda en disco: `realprint-backend/uploads/uuid-filename.pdf`
5. Backend devuelve URL: `/files/uuid-filename.pdf`
6. Frontend guarda URL en estado para enviar después con el pedido

**Carpeta de Almacenamiento:**
```
realprint-backend/
  └─ uploads/
     ├─ a1b2c3d4-Design_v1.pdf
     ├─ e5f6g7h8-Photo_final.jpg
     ├─ i9j0k1l2-Mockup_2026.png
     └─ ...
```

**Máximo permitido:** 10 MB por archivo  
**Formatos:** PDF, JPG, PNG  

---

### ❓ ¿Cómo se descargan por parte del administrador?

**Respuesta Corta:**
1. Admin entra a `http://localhost:5173/admin/pedidos`
2. Ve tabla de pedidos y hace click en "Ver"
3. Se abre modal con detalles del pedido
4. En sección "Archivos del pedido" ve lista: "Descargar archivo 1", "Descargar archivo 2"
5. Admin hace click en "Descargar archivo 1"
6. Frontend hace `GET /files/a1b2c3d4-Design_v1.pdf` con JWT token
7. Backend valida:
   - ¿JWT válido? ✓
   - ¿Es admin? ✓ (admin puede TODO)
   - ¿Archivo existe? ✓
8. Backend envía archivo en HTTP response
9. Browser descarga a: `~/Descargas/Design_v1.pdf`

**Componentes Involucrados:**
- Admin ve: `AdminPedidos.tsx` → Modal → Lista de archivos
- Admin descarga: `handleDownloadFile()` → `GET /files/{fileName}`
- Backend ejecuta: `FileController.download()` → valida acceso → `FileStorageService.load()`

---

## 🏗️ ARQUITECTURA EN 1 IMAGEN

```
CLIENTE APP                 BACKEND                    ADMIN APP
═══════════════════════════════════════════════════════════════════

Step2Details.tsx            FileController.java        AdminPedidos.tsx
     │                             │                          │
     ├─ Input[file] ──────────────→ POST /upload ──────────→ (recibe URL)
     │                    │
     │         FileStorageService.java
     │         - Valida formato/tamaño
     │         - Guarda en: /uploads/uuid-file
     │         - Devuelve: /files/uuid-file
     │                │
     ├─────────────────┘ (fileurlsJson en BD)
     │
     └──ConfirmOrder────→ POST /pedidos ──────────────→ Tabla: pedidos
                                                     fileUrlsJson: ["/files/..."]


ADMIN DESCARGA
═══════════════════════════════════════════════════════════════════

AdminPedidos.tsx
     │
     ├─ Ver Pedido (modal abierto)
     │
     ├─ parseFileUrlsFromPedido() extrae URLs
     │
     ├─ "Descargar archivo 1" Button
     │  handleDownloadFile()
     │
     └──────────────────────────→ GET /files/uuid-file + JWT
                                         │
                          FileController.download()
                          - Valida JWT
                          - Valida es Admin ✓
                          - FileStorageService.load()
                          - Lee del disco: /uploads/uuid-file
                          - Devuelve: Binary + Headers
                                │
     ←──────────────────────────┘
     │
     Blob → URL temporal → Link descarga → ~/Descargas/file
```

---

## 🔐 Niveles de Seguridad

### NIVEL 1: Autenticación
```
¿JWT Token válido?
├─ SÍ → Continuar
└─ NO → 401 Unauthorized
```

### NIVEL 2: Autorización
```
¿Es ADMIN?
├─ SÍ → Acceso a TODO
└─ NO (Cliente):
    ├─ ¿El archivo está en mis pedidos?
    ├─ SÍ → Acceso permitido
    └─ NO → 403 Forbidden
```

### NIVEL 3: Sanitización
```
¿Path está limpio (sin ../../../)?
├─ SÍ → Continuar
└─ NO → 400 Bad Request
```

### NIVEL 4: Validación
```
¿Archivo existe en disco?
├─ SÍ → Continuar
└─ NO → 404 Not Found
```

---

## 📊 FLUJO EN FORMATO SIMPLE

```
┌─────────────┐
│   CLIENTE   │
├─────────────┤
│             │
│ Selecciona  │
│ archivos    │
│             │
│ (PDF/JPG    │
│  < 10MB)    │
│             │
└──────┬──────┘
       │
       ↓ POST /upload (FormData)
       │
       ┌──────────────────┐
       │   BACKEND        │
       ├──────────────────┤
       │                  │
       │ FileController   │
       │ ↓                │
       │ Valida:          │
       │ • Formato        │
       │ • Tamaño         │
       │ • Seguridad      │
       │ ↓                │
       │ FileStorage      │
       │ ↓                │
       │ Guarda en:       │
       │ /uploads/...     │
       │ ↓                │
       │ Devuelve URL:    │
       │ /files/uuid-file │
       │                  │
       └──────┬───────────┘
              │
              ↓ URL guardada en BD (pedido)
              │
              ┌─────────────┐
              │   ADMIN     │
              ├─────────────┤
              │             │
              │ Ve Pedido   │
              │ Click Ver   │
              │             │
              │ Ve archivos │
              │ Click Descar│
              │             │
              ↓ GET /files/uuid-file + JWT
              │
              ┌──────────────────┐
              │   BACKEND        │
              ├──────────────────┤
              │ Valida JWT ✓    │
              │ Valida Admin ✓  │
              │ Lee archivo ✓   │
              │ Devuelve Blob   │
              └──────┬───────────┘
                     │
                     ↓
              📥 Archivo descargado
                 a ~/Descargas/
```

---

## 🎯 PUNTOS CLAVE

| Aspecto | Detalle |
|---------|---------|
| **Flujo 1: Carga** | Cliente → POST /upload → Backend → Disco → URL devuelta |
| **Flujo 2: Almacenamiento** | URL guarda en BBDD (pedidos.fileUrlsJson) |
| **Flujo 3: Descarga** | Admin → GET /files/{fileName} → Backend → Disco → Descarga |
| **Carpeta** | `realprint-backend/uploads/` |
| **Nombre archivo** | UUID generado por backend (ej: a1b2c3d4-Design.pdf) |
| **Max size** | 10 MB |
| **Formatos** | PDF, JPG (JPEG), PNG |
| **Auth** | JWT token (ambos endpoints requieren) |
| **Admin acceso** | TODOS los archivos |
| **Cliente acceso** | SOLO sus archivos |

---

## 🚀 ACCIONES POSIBLES

### Ver Código Frontend
- Carga: `App-RealPrint/src/components/CreateOrderForm/Step2Details.tsx`
- Descarga: `App-RealPrint/src/pages/admin/AdminPedidos.tsx` (línea ~250+)
- Servicio: `App-RealPrint/src/services/orderService.ts` (uploadFile método)

### Ver Código Backend
- Endpoint Upload: `realprint-backend/.../controller/FileController.java` (POST /upload)
- Endpoint Download: `realprint-backend/.../controller/FileController.java` (GET /files/{fileName})
- Lógica: `realprint-backend/.../service/FileStorageService.java`

### Probar en Local
1. Cliente sube archivo: `/cliente` → "Crear pedido" → Paso 2 → Upload
2. Admin descarga: `/admin/pedidos` → Ver → Modal → "Descargar archivo"

---

## 📖 DOCUMENTOS RELACIONADOS

- [FLUJO_ARCHIVOS_CLIENTE_ADMIN.md](FLUJO_ARCHIVOS_CLIENTE_ADMIN.md) - Explicación técnica completa
- [DIAGRAMAS_FLUJO_ARCHIVOS.md](DIAGRAMAS_FLUJO_ARCHIVOS.md) - Diagramas visuales
- [STATUS_AUDITORIA_FINAL.md](STATUS_AUDITORIA_FINAL.md) - Auditoría general del proyecto

---

## ❓ PREGUNTAS FRECUENTES

**P: ¿Qué pasa si el archivo supera 10 MB?**  
R: Backend rechaza con 400 Bad Request: "El archivo supera el tamaño máximo permitido (10 MB)"

**P: ¿Qué formatos son permitidos?**  
R: Solo PDF, JPG, PNG (esotros formatos rechazan)

**P: ¿Dónde se guardan los archivos exactamente?**  
R: En `realprint-backend/uploads/` como archivo con nombre: `{uuid}-{nombreOriginal}`  
Ejemplo: `a1b2c3d4-e5f6-7890-Design_v1.pdf`

**P: ¿Puedo descargar archivos de otros clientes como admin?**  
R: Sí, los admins pueden descargar CUALQUIER archivo

**P: ¿Puedo descargar archivos de otros clientes como cliente?**  
R: No, solo tus archivos. El backend valida en BD que el archivo pertenezca a tus pedidos

**P: ¿Qué pasa si elimino un pedido?**  
R: El archivo dentro del servidor (/uploads) sigue ahí, pero la referencia en BD se elimina

**P: ¿Cuánto espacio necesito para archivos?**  
R: Depende de cuántos clientes suban. Sin límite automático (considerar 1GB aprox por 1000 archivos)

**P: ¿Se comprimen los archivos?**  
R: No actualmente. El archivo se guarda tal cual lo sube el usuario

---

**Documento índice creado:** 27 de Abril de 2026  
**Última actualización:** 27 de Abril de 2026  
**Estado:** ✅ LISTO PARA CONSULTA

