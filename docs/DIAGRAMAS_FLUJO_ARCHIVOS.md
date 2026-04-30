# 🎨 DIAGRAMAS VISUALES - Flujo de Archivos

---

## 1️⃣ Arquitectura General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            🌐 CLIENTE (Browser)                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─ Paso 1: Crear Orden ──────────────────────────────────┐                 │
│  │                                                          │                 │
│  │  Step2Details.tsx                                       │                 │
│  │  ┌──────────────────────────────────────────────────┐  │                 │
│  │  │   Input[type=file] (PDF, JPG, PNG)              │  │                 │
│  │  │   - Selecciona: Design_v1.pdf                   │  │                 │
│  │  │   - Selecciona: Photo_final.jpg                 │  │                 │
│  │  │                                                  │  │                 │
│  │  │   [SUBIR ARCHIVOS]                              │  │                 │
│  │  └──────────────────────────────────────────────────┘  │                 │
│  │                                                          │                 │
│  └──────────────────────────────────────────────────────────┘                │
│                              ↓                                                │
│  ┌─ Paso 2: Ingresar Dimensiones ──────────────────────────┐                │
│  │                                                           │                │
│  │  filesWithDimensions[] = [                               │                │
│  │    {                                                     │                │
│  │      id: "file-123",                                    │                │
│  │      name: "Design_v1.pdf",                             │                │
│  │      url: "/files/a1b2c3d4-Design_v1.pdf",  ← Del BE  │                │
│  │      widthCm: 30,  ← Usuario ingresa                   │                │
│  │      heightCm: 40  ← Usuario ingresa                   │                │
│  │    },                                                   │                │
│  │    {                                                   │                │
│  │      id: "file-124",                                  │                │
│  │      name: "Photo_final.jpg",                         │                │
│  │      url: "/files/e5f6g7h8-Photo_final.jpg",          │                │
│  │      widthCm: 25,                                     │                │
│  │      heightCm: 35                                     │                │
│  │    }                                                   │                │
│  │  ]                                                     │                │
│  │                                                         │                │
│  │  ✅ Calcula metros lineales automáticamente            │                │
│  │  ✅ Muestra preview de layout                          │                │
│  │  ✅ Calcula cantidad de filas                          │                │
│  │                                                         │                │
│  └──────────────────────────────────────────────────────────┘                │
│                              ↓                                                │
│  ┌─ Paso 3: Confirmar Orden ──────────────────────────────┐                │
│  │                                                         │                │
│  │  Payload final:                                        │                │
│  │  {                                                    │                │
│  │    fileUrls: [                                       │                │
│  │      "/files/a1b2c3d4-Design_v1.pdf",               │                │
│  │      "/files/e5f6g7h8-Photo_final.jpg"              │                │
│  │    ],                                                │                │
│  │    filesWithDimensions: [...],                       │                │
│  │    quantity: 50,                                     │                │
│  │    linearMeters: 2.5,                                │                │
│  │    ...                                              │                │
│  │  }                                                  │                │
│  │                                                     │                │
│  │  [CONFIRMAR PEDIDO]                                 │                │
│  │                                                     │                │
│  └─────────────────────────────────────────────────────┘                │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
                                  ↓
                    POST /pedidos (CreateOrderForm)
                                  ↓
┌──────────────────────────────────────────────────────────────────────────────┐
│                          🖥️  BACKEND (Spring Boot)                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Base de Datos                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Tabla: pedidos                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ id  │ cliente      │ fileUrlsJson                │ estado   │   │    │
│  │  ├─────────────────────────────────────────────────────────────┤   │    │
│  │  │ 1   │ Cliente Inc  │ "["/files/a1b2...",          │ PENDIENTE│  │    │
│  │  │     │              │   "/files/e5f6..."]"         │          │   │    │
│  │  │ 2   │ Acme Corp    │ "["/files/i9j0..."]"         │ EN_PROC  │   │    │
│  │  │     │              │                              │          │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│  Almacenamiento de Archivos en Disco                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  realprint-backend/uploads/                                         │    │
│  │  ├─ a1b2c3d4-Design_v1.pdf              (1.2 MB)                  │    │
│  │  ├─ e5f6g7h8-Photo_final.jpg            (3.5 MB)                  │    │
│  │  ├─ i9j0k1l2-Artwork_v2.png             (2.1 MB)                  │    │
│  │  └─ ... (más archivos)                                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
                                  ↓
            Admin accede a /admin/pedidos (GET /pedidos)
                                  ↓
┌──────────────────────────────────────────────────────────────────────────────┐
│                     🎯 ADMIN DASHBOARD (AdminPedidos)                        │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Tabla de Pedidos                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐      │
│  │ ID │ Cliente      │ Estado       │ Total │ [Ver]                  │      │
│  ├────────────────────────────────────────────────────────────────────┤      │
│  │ 1  │ Cliente Inc  │ PENDIENTE    │ €45   │ [Ver] ← Click          │      │
│  │ 2  │ Acme Corp    │ EN_PROCESO   │ €120  │ [Ver]                  │      │
│  └────────────────────────────────────────────────────────────────────┘      │
│                                                                               │
│  Modal: Detalles del Pedido                                                  │
│  ┌────────────────────────────────────────────────────────────────────┐      │
│  │ Pedido #1                                                      [x] │      │
│  ├────────────────────────────────────────────────────────────────────┤      │
│  │                                                                    │      │
│  │ Cliente: Cliente Inc                                             │      │
│  │ Fecha: 27/04/2026                                                │      │
│  │ Total: €45.00                                                    │      │
│  │                                                                    │      │
│  │ Archivos del pedido:                                             │      │
│  │ ┌─────────────────────────────────────────────────────────────┐ │      │
│  │ │ • [Descargar archivo 1] ← Design_v1.pdf                   │ │      │
│  │ │   (a1b2c3d4-Design_v1.pdf)                                │ │      │
│  │ │                                                             │ │      │
│  │ │ • [Descargar archivo 2] ← Photo_final.jpg                 │ │      │
│  │ │   (e5f6g7h8-Photo_final.jpg)                              │ │      │
│  │ └─────────────────────────────────────────────────────────────┘ │      │
│  │                                                                    │      │
│  │ [Cambiar Estado] [Eliminar Pedido] [Cerrar]                    │      │
│  │                                                                    │      │
│  └────────────────────────────────────────────────────────────────────┘      │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
                      ↓ Click "Descargar archivo 1"
            GET /files/a1b2c3d4-Design_v1.pdf + JWT
                                  ↓
        Backend valida, valida seguridad, devuelve archivo
                                  ↓
              Browser descarga: Design_v1.pdf
                    (guardado en Descargas/)
```

---

## 2️⃣ Flujo de Carga: Cliente → Backend

```
┌────────────────────────────────────────────┐
│  Cliente selecciona archivo en formulario  │
│  Design_v1.pdf (50 MB)... Error: >10MB ✗  │
│  Design_v1.pdf (1.2 MB) ✓                 │
└────────────────────────────────────────────┘
                    ↓
        ┌─────────────────────────────┐
        │  Frontend valida:           │
        │  ✅ Formato PDF/JPG/PNG?   │
        │  ✅ Archivo != vacío?      │
        │  ✅ Extensión válida?      │
        └─────────────────────────────┘
                    ↓
    ┌──────────────────────────────────┐
    │  orderService.uploadFile(file)  │
    │                                  │
    │  POST /upload                    │
    │  Headers:                        │
    │    Authorization: Bearer JWT     │
    │  Body: FormData {                │
    │    file: Design_v1.pdf          │
    │  }                               │
    └──────────────────────────────────┘
                    ↓
    ┌──────────────────────────────────┐
    │    Backend: FileController       │
    │                                  │
    │  1. Recibe MultipartFile         │
    │  2. Llama FileStorageService     │
    │     .store(file)                 │
    └──────────────────────────────────┘
                    ↓
    ┌──────────────────────────────────┐
    │  Backend: FileStorageService     │
    │                                  │
    │  Validaciones:                   │
    │  ✅ No vacío?                   │
    │  ✅ < 10 MB?                    │
    │  ✅ Formato PDF/JPG/PNG?        │
    │  ✅ Path traversal safe?        │
    │  ✅ Nombre sanitizado?          │
    │                                  │
    │  Genera nombre único:            │
    │  UUID = "a1b2c3d4-12ab"          │
    │  fileName = "a1b2c3d4-Design_v1.pdf" │
    │                                  │
    │  Guarda en disco:                │
    │  /uploads/a1b2c3d4-Design_v1.pdf │
    └──────────────────────────────────┘
                    ↓
    ┌──────────────────────────────────┐
    │  Backend devuelve:               │
    │  {                               │
    │    "url": "/files/a1b2c3d4...",  │
    │    "fileUrl": "/files/a1b2...",  │
    │    "fileName": "a1b2c3d4-..."    │
    │  }                               │
    └──────────────────────────────────┘
                    ↓
    ┌──────────────────────────────────┐
    │  Frontend recibe URL             │
    │  filesWithDimensions[0].url =    │
    │    "/files/a1b2c3d4-Design_v1.pdf"     │
    │                                  │
    │  Step2Details forma:             │
    │  - Input ancho (cm): [  30  ]   │
    │  - Input alto (cm): [  40  ]    │
    │  - Preview: Texto sin BG        │
    │  - Metros calculados: 0.4 m     │
    └──────────────────────────────────┘
                    ↓
    ┌──────────────────────────────────┐
    │  [SIGUIENTE] → Paso 3: Confirmar │
    └──────────────────────────────────┘
```

---

## 3️⃣ Flujo de Descarga: Admin → Backend → Admin

```
┌─────────────────────────────────────────────┐
│  Admin en /admin/pedidos                    │
│  Tabla muestra: [Pedido #1] [Ver]           │
│  ↓ Click [Ver]                              │
└─────────────────────────────────────────────┘
                    ↓
    ┌──────────────────────────────────┐
    │  Modal abierto: Pedido #1        │
    │                                  │
    │  "Archivos del pedido"           │
    │  • Descargar archivo 1           │
    │  • Descargar archivo 2           │
    │                                  │
    │  ↓ Click "Descargar archivo 1"   │
    └──────────────────────────────────┘
                    ↓
    ┌──────────────────────────────────┐
    │  Frontend:                       │
    │  handleDownloadFile()            │
    │                                  │
    │  GET /files/a1b2c3d4-Design_v1.pdf │
    │  Headers: {                      │
    │    Authorization: Bearer JWT     │
    │  }                               │
    └──────────────────────────────────┘
                    ↓
    ┌──────────────────────────────────┐
    │  Backend: FileController         │
    │  download() method               │
    │                                  │
    │  1. Extraer fileName del path    │
    │  2. Validar acceso:              │
    │     validateDownloadAccess()     │
    └──────────────────────────────────┘
                    ↓
    ┌──────────────────────────────────┐
    │  Validaciones de Seguridad:      │
    │                                  │
    │  ¿JWT válido?                    │
    │  └─ Sí ✓  → continuar            │
    │  └─ No ✗ → 401 Unauthorized      │
    │                                  │
    │  ¿Usuario autenticado?           │
    │  └─ Sí ✓  → continuar            │
    │  └─ No ✗ → 403 Forbidden         │
    │                                  │
    │  ¿Es ADMIN?                      │
    │  └─ Sí ✓  → Permitido (salir)   │
    │  └─ No ✗ → Verificar propiedad  │
    │                                  │
    │  ¿Cliente propietario?           │
    │  └─ Sí ✓  → Permitido            │
    │  └─ No ✗ → 403 Forbidden         │
    └──────────────────────────────────┘
                    ↓
    ┌──────────────────────────────────┐
    │  Backend: FileStorageService     │
    │  load(fileName)                  │
    │                                  │
    │  1. Normalizar path              │
    │  2. Validar que no haya escapes  │
    │  3. Verificar si archivo existe  │
    │  4. Determinar tipo MIME:        │
    │     - PDF → application/pdf      │
    │     - JPG → image/jpeg           │
    │     - PNG → image/png            │
    │  5. Leer archivo del disco       │
    │  6. Devolver como Resource       │
    └──────────────────────────────────┘
                    ↓
    ┌──────────────────────────────────┐
    │  Backend devuelve HTTP 200:      │
    │                                  │
    │  Headers: {                      │
    │    Content-Type: application/pdf │
    │    Content-Disposition:          │
    │      attachment;                 │
    │      filename="Design_v1.pdf"   │
    │  }                               │
    │  Body: [contenido binario]       │
    └──────────────────────────────────┘
                    ↓
    ┌──────────────────────────────────┐
    │  Frontend (Browser):             │
    │                                  │
    │  1. Recibe Blob                  │
    │  2. Crea URL temporal            │
    │  3. Crea <a> tag                 │
    │  4. Simula click (descarga)      │
    │  5. Limpia recursos              │
    │                                  │
    │  💾 Archivo guardado en:         │
    │     Descargas/Design_v1.pdf      │
    └──────────────────────────────────┘
```

---

## 4️⃣ Matriz de Acceso a Archivos

```
╔════════════════════════════════════════════════════════════════════╗
║                   CONTROL DE ACCESO AT DESCARGAS                  ║
╠═════════════════════════════╦════════════════════════════════════╣
║  Usuario                    ║  Puede Descargar                   ║
╠═════════════════════════════╬════════════════════════════════════╣
║  No autenticado             ║  ❌ NO - Error 401 Unauthorized    ║
║                             ║                                    ║
║  Cliente autenticado        ║  ✅ SÍ - Solo sus archivos         ║
║  (propietario del pedido)   ║  Validación: existsByClienteId()   ║
║                             ║                                    ║
║  Operario autenticado       ║  ❓ NO - Sin permisos              ║
║  (futuro rol)               ║                                    ║
║                             ║                                    ║
║  Admin autenticado          ║  ✅ SÍ - TODOS los archivos        ║
║                             ║  Sin restricción (validamos rol)   ║
╚═════════════════════════════╩════════════════════════════════════╝
```

---

## 5️⃣ Estados de Carga y Sus Significados

```
┌──────────────────────────────────────────────────────────────┐
│                   ENDPOINT: POST /upload                     │
│                 Frontend → Backend                            │
└──────────────────────────────────────────────────────────────┘

┌─ Casos de Éxito ────────────────────────────────────────────┐
│                                                              │
│ 200 OK                                                      │
│ {                                                           │
│   "url": "/files/a1b2c3d4-Design.pdf",                     │
│   "fileUrl": "/files/a1b2c3d4-Design.pdf",                │
│   "fileName": "a1b2c3d4-Design.pdf"                        │
│ }                                                           │
│ ✅ Archivo guardado exitosamente en disco                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─ Errores de Cliente ────────────────────────────────────────┐
│                                                              │
│ 400 BAD REQUEST                                             │
│ "Debes adjuntar un archivo"                                │
│ ❌ Archivo vacío o null                                    │
│                                                              │
│ "El archivo supera el tamaño máximo permitido (10 MB)"  │
│ ❌ File size > 10 MB                                       │
│                                                              │
│ "Formato no permitido. Usa PDF, JPG o PNG"                │
│ ❌ Extensión no soportada (.doc, .xlsx, .mp4, etc.)       │
│                                                              │
│ "Nombre de archivo inválido"                               │
│ ❌ Path traversal detectado (../../../etc/passwd)         │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─ Errores de Autenticación ──────────────────────────────────┐
│                                                              │
│ 401 UNAUTHORIZED                                            │
│ ❌ JWT token expirado o inválido                            │
│    (Usuario no autenticado)                                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─ Errores del Servidor ──────────────────────────────────────┐
│                                                              │
│ 500 INTERNAL SERVER ERROR                                  │
│ "No se pudo guardar el archivo"                            │
│ ❌ Problema escribiendo en disco (permisos, espacio, etc.) │
│                                                              │
│ "No se pudo inicializar el directorio de archivos"        │
│ ❌ Directorio /uploads no se puede crear                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                 ENDPOINT: GET /files/{fileName}             │
│                 Backend → Frontend (Admin)                   │
└──────────────────────────────────────────────────────────────┘

┌─ Casos de Éxito ────────────────────────────────────────────┐
│                                                              │
│ 200 OK + Binary Data                                        │
│ Headers: {                                                  │
│   Content-Type: application/pdf | image/jpeg | image/png  │
│   Content-Disposition: attachment; filename="Design.pdf"   │
│ }                                                           │
│ ✅ Archivo listo para descargar                             │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─ Errores de Permisos ───────────────────────────────────────┐
│                                                              │
│ 401 UNAUTHORIZED                                            │
│ "No tienes permisos para descargar este archivo"          │
│ ❌ JWT no enviado o inválido                                │
│                                                              │
│ 403 FORBIDDEN                                               │
│ "No tienes permisos para descargar este archivo"          │
│ ❌ Cliente intenta descargar archivo que no es suyo       │
│    (no está en sus pedidos)                               │
│                                                              │
│ "Usuario no válido"                                         │
│ ❌ Usuario no existe en BD (JWT corrompido)                │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─ Archivo No Encontrado ─────────────────────────────────────┐
│                                                              │
│ 404 NOT FOUND                                               │
│ "Archivo no encontrado"                                     │
│ ❌ Archivo deletido o nunca existió en disco                │
│                                                              │
│ "Archivo no disponible"                                     │
│ ❌ Path existe pero no es legible (permisos del SO)        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 6️⃣ Validaciones de Seguridad

```
┌─────────────────────────────────────────────────────────┐
│              SECURITY LAYERS - CEBOLLA 🧅               │
└─────────────────────────────────────────────────────────┘

CAPA 1: AUTENTICACIÓN JWT
├─ ¿Token presente en headers?
├─ ¿Token válido (firma, expiración)?
├─ ¿Usuario existe en BD?
└─ Si cualquiera falla → 401 Unauthorized

CAPA 2: AUTORIZACIÓN
├─ ¿Es ADMIN?
│   └─ Sí → Acceso total a todos los archivos
├─ ¿Es CLIENTE?
│   └─ Verificar: ¿Archivo pertenece a mis pedidos?
│       └─ Query: SELECT * FROM pedidos 
│            WHERE clienteId = ? AND fileUrlsJson LIKE ?
└─ Si no autorizado → 403 Forbidden

CAPA 3: SANITIZACIÓN DE ENTRADA
├─ Normalizar path: "../../../etc/passwd" → "etc/passwd"
├─ Validar que normPath.startsWith(rootPath)
└─ Si intento de traversal → 400 Bad Request

CAPA 4: VALIDACIÓN DE ARCHIVO
├─ Extensión en whitelist (PDF, JPG, PNG)
├─ Tamaño < 10 MB
├─ Content-Type válido
└─ Si no válido → 400 Bad Request

CAPA 5: EXISTENCIA EN DISCO
├─ ¿Archivo existe en FileSystem?
├─ ¿Path apunta dentro de rootPath?
└─ Si no → 404 Not Found

CAPA 6: LECTURA DEL SO
├─ ¿Puedo leer el archivo (R permissions)?
├─ ¿El archivo está corrupto?
└─ Si error → 500 Internal Server Error
```

---

## 7️⃣ Ciclo de Vida de un Archivo

```
Timeline: Archivo Design.pdf
═══════════════════════════════════════════════════════════

T0: 10:30 AM - Cliente sube archivo
   ├─ browserFile = File { name: "Design.pdf", size: 1.2MB }
   ├─ POST /upload (FormData + JWT)
   └─ Backend recibe en MultipartFile

T1: 10:30:05 AM - Backend procesa carga
   ├─ FileStorageService.store() ejecuta validaciones
   ├─ Genera UUID: "a1b2c3d4-e5f6-7890"
   ├─ Nombre final: "a1b2c3d4-Design.pdf"
   ├─ Guarda en: /uploads/a1b2c3d4-Design.pdf
   ├─ 200 OK Response: { url: "/files/a1b2c3d4-Design.pdf" }
   └─ Frontend recibe URL

T2: 10:30:10 AM - Cliente ingresa dimensiones
   ├─ filesWithDimensions[0] = {
   │    url: "/files/a1b2c3d4-Design.pdf",
   │    widthCm: 30,
   │    heightCm: 40
   │  }
   └─ Sistema calcula: metros = 0.4

T3: 10:31 AM - Cliente confirma pedido
   ├─ POST /pedidos (con fileUrls)
   ├─ Backend guarda Pedido en BD:
   │  INSERT INTO pedidos VALUES (
   │    ...,
   │    fileUrlsJson = '["​/files/a1b2c3d4-Design.pdf"]',
   │    ...
   │  )
   └─ Estado = PENDIENTE

T4: 10:40 AM - Admin visualiza pedido
   ├─ GET /pedidos (lista todos)
   ├─ AdminPedidos.tsx renderiza tabla
   ├─ Admin hace click en "Ver"
   └─ Modal abierto, ve "Descargar archivo 1"

T5: 10:45 AM - Admin descarga archivo
   ├─ GET /files/a1b2c3d4-Design.pdf + JWT
   ├─ FileController.validateDownloadAccess()
   │  └─ ¿Admin? SÍ ✓ → Permitido
   ├─ FileStorageService.load()
   │  └─ Lee desde disco: /uploads/a1b2c3d4-Design.pdf
   ├─ 200 OK + Binary + Headers (Content-Disposition: attachment)
   ├─ Frontend descarga blob a computadora
   └─ Archivo guardado en: ~/Descargas/Design.pdf

T6: 10:46 AM - Admin abre archivo
   ├─ Adobe Reader abre: ~/Descargas/Design.pdf
   └─ ✅ Proceso completado

═══════════════════════════════════════════════════════════

Notas:
- Archivo MÁS DE UNA VEZ: Backend NO limita descargas
- Archivo en DISCO: Permanece mientras servidor corra
- Archivo en BD: URL persistente en fileUrlsJson
- Futuro: Considerar Expiración (ej: 30 días)
```

---

## 8️⃣ Comparativa: Frontend vs Backend

```
┌────────────────────────────────────────────────────────────┐
│                     FRONTEND WORK                         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Responsabilidades:                                        │
│ ✅ UI: Input file, thumbnails, progress bars             │
│ ✅ Validación básica: extensión, vista previa             │
│ ✅ Ingreso de dimensiones por usuario                     │
│ ✅ Cálculos: metros lineales, layouts                     │
│ ✅ HTTP Request: POST /upload (multipart)                 │
│ ✅ Recibir URL: /files/uuid-filename                      │
│ ✅ Descargas: GET /files/{fileName} + JWT                 │
│ ✅ UX: Loading states, error messages                     │
│                                                            │
│ No hace:                                                  │
│ ❌ Almacenar en disco (eso es backend)                    │
│ ❌ Virus scanning (eso es backend)                        │
│ ❌ Validación segura de paths                             │
│ ❌ Gestión de permisos complejos                          │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                     BACKEND WORK                          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Responsabilidades:                                        │
│ ✅ Recibir MultipartFile (multipart/form-data)            │
│ ✅ Validación de seguridad: tamaño, extensión, path       │
│ ✅ Sanitización: UUID + nombre limpio                     │
│ ✅ Almacenamiento: Files.copy() al disco                  │
│ ✅ Verificación acceso: JWT, roles, propiedad pedido      │
│ ✅ Lectura segura: path traversal check                   │
│ ✅ Metadata: MIME type, headers Content-Disposition       │
│ ✅ Streaming: Enviar binary a través HTTP                 │
│                                                            │
│ No hace:                                                  │
│ ❌ Decidir qué archivo subir (usuario elige)              │
│ ❌ Diseñar UI (eso es frontend)                           │
│ ❌ Cálculos de layout (eso es frontend)                   │
│ ❌ Préview de imágenes (eso es frontend)                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🎬 Resumen Ejecutivo

| Aspecto | Detalles |
|---------|----------|
| **Dónde sube cliente** | Step2Details.tsx → Input file → POST /upload |
| **Dónde se guardan** | `realprint-backend/uploads/uuid-filename.ext` |
| **Cómo descarga admin** | AdminPedidos.tsx Modal → GET /files/{fileName} |
| **Validaciones** | Formato (PDF/JPG/PNG), Tamaño (<10MB), Seguridad (path traversal) |
| **Autenticación** | JWT token en headers (ambos endpoints) |
| **Autorización** | Admin: todos los archivos, Cliente: solo suyos |
| **Almacenamiento** | Disco local (no BD) |
| **Metadata** | Guardada en BD table `pedidos.fileUrlsJson` (JSON string) |
| **Expiración** | Sin set (futuro: considerar 30-60 días) |

---

**Generado:** 27 de Abril de 2026  
**Versión:** 1.0 - Diagramas Visuales  
**Estado:** ✅ REFERENCIA COMPLETA

