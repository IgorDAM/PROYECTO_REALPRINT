# 📁 FLUJO COMPLETO DE ARCHIVOS: Cliente → Backend → Admin

**Documento técnico que explica cómo los archivos viajan del cliente al almacenamiento y cómo el admin los descarga.**

---

## 🎯 Flujo General en 3 Pasos

```
1. CLIENTE SUBE ARCHIVOS
   ↓
   Cliente selecciona archivos PDF/JPG/PNG en formulario
   ↓
   Frontend calcula dimensiones (ancho x alto en cm)
   ↓
   POST /upload (FormData + JWT token)
   
2. BACKEND GUARDA ARCHIVOS
   ↓
   FileController recibe archivos
   ↓
   FileStorageService valida y guarda en disco
   ↓
   Devuelve URL de descarga al frontend
   
3. ADMIN DESCARGA ARCHIVOS
   ↓
   Admin visualiza pedido en AdminPedidos
   ↓
   Click en "Descargar archivo"
   ↓
   GET /files/{fileName} (con JWT token)
   ↓
   Backend valida permisos y devuelve archivo
```

---

## 1️⃣ CLIENTE SUBE ARCHIVOS

### 📱 Frontend: Flujo de Carga

#### Dónde ocurre:
- **Archivo:** `App-RealPrint/src/components/CreateOrderForm/Step2Details.tsx`
- **Función:** `handleFileUpload()`
- **Ruta:** Cuando cliente crea pedido → Paso 2 (Detalles del Diseño)

#### Componentes involucrados:

```
CreateOrderForm.tsx
  └─ Step2Details.tsx (Componente que maneja carga)
      └─ Input file multiple
         └─ onChange → handleFileUpload()
```

#### Código del frontend:

```typescript
// App-RealPrint/src/components/CreateOrderForm/Step2Details.tsx (línea ~100)

const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files ?? []);
  setIsUploading(true);
  
  // 1. Validación de archivos
  const validFiles = files.filter(file => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ['pdf', 'jpg', 'png', 'jpeg'].includes(ext || '');
  });

  // 2. Subir archivos al backend
  if (validFiles.length > 0 && onUploadFiles) {
    try {
      const uploadedUrls = await onUploadFiles(validFiles);
      
      // 3. Actualizar estado con URLs devueltas
      const newFiles: FileWithDimensions[] = uploadedUrls.map((url, index) => ({
        id: `file-${Date.now()}-${index}`,
        name: validFiles[index].name,
        url, // URL del backend para descargar/visualizar
        widthCm: undefined,  // El usuario debe ingresar dimensiones
        heightCm: undefined,
      }));
      
      setFilesWithDimensions(newFiles);
      syncFormWithFiles(newFiles);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }
  
  setIsUploading(false);
};
```

#### Llamadas HTTP del Cliente:

```typescript
// App-RealPrint/src/services/orderService.ts (línea 68)

uploadFile: async (file) => {
  try {
    // 1. Preparar FormData con el archivo
    const formData = new FormData();
    formData.append('file', file);
    
    // 2. Obtener token de autenticación
    const token = getToken();
    
    // 3. POST a /upload CON token JWT
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        // NO enviamos Content-Type manual en multipart
        // El navegador lo calcula automáticamente con boundary
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    
    if (!res.ok) throw new Error('Error uploading file');
    const data = await res.json();
    return data.url || data.fileUrl;  // Devuelve: "/files/uuid-filename.pdf"
  } catch (error) {
    console.error('Error en orderService.uploadFile:', error);
    throw error;
  }
};
```

### 📊 Diagrama de la Carga (Lado Cliente)

```
Cliente
  │
  ├─ 1. Selecciona archivos en input[type=file]
  │     (Event: onChange)
  │
  ├─ 2. CreateOrderForm.handleUploadFiles()
  │     │
  │     └─ Valida: ¿PDF/JPG/PNG? ¿< 10MB?
  │
  ├─ 3. orderService.uploadFile(file)
  │     │
  │     └─ POST /upload (FormData)
  │        Headers: { Authorization: Bearer JWT_TOKEN }
  │
  ├─ 4. Response del backend:
  │     {
  │       "url": "/files/uuid-filename.pdf",
  │       "fileUrl": "/files/uuid-filename.pdf",
  │       "fileName": "uuid-filename.pdf"
  │     }
  │
  └─ 5. Guardar URL en estado (filesWithDimensions)
       El usuario luego ingresa dimensiones (ancho x alto)
```

---

## 2️⃣ BACKEND ALMACENA ARCHIVOS

### 🖥️ Backend: Controlador y Servicio

#### Endpoint: `POST /upload`

**Archivo:** `realprint-backend/src/main/java/.../controller/FileController.java`

```java
@PostMapping("/upload")
public ResponseEntity<Map<String, String>> upload(
    @RequestParam("file") MultipartFile file
) {
    // 1. Validar y guardar el archivo en disco
    String storedName = fileStorageService.store(file);
    
    // 2. Generar URL de descarga
    String fileUrl = ServletUriComponentsBuilder
        .fromCurrentContextPath()
        .path("/files/")
        .path(storedName)
        .toUriString();
    // Resultado: "/files/uuid-filename.pdf"
    
    // 3. Devolver JSON con URL
    return ResponseEntity.ok(Map.of(
        "url", fileUrl,
        "fileUrl", fileUrl,
        "fileName", storedName
    ));
}
```

#### Validaciones en Backend: `FileStorageService.java`

```java
public String store(MultipartFile file) {
    // 1. VALIDACIÓN DE VACÍO
    if (file == null || file.isEmpty()) {
        throw new ResponseStatusException(BAD_REQUEST, "Debes adjuntar un archivo");
    }
    
    // 2. VALIDACIÓN DE TAMAÑO
    if (file.getSize() > MAX_FILE_SIZE_BYTES) {  // 10 MB máx
        throw new ResponseStatusException(BAD_REQUEST, 
            "El archivo supera el tamaño máximo permitido (10 MB)");
    }
    
    // 3. EXTRACCIÓN Y VALIDACIÓN DE FORMATO
    String originalName = StringUtils.cleanPath(
        file.getOriginalFilename() == null ? "archivo" : file.getOriginalFilename()
    );
    String extension = extractExtension(originalName);
    
    // Solo permitir: PDF, JPG, PNG
    if (!ALLOWED_EXTENSIONS.contains(extension)) {  
        // ALLOWED_EXTENSIONS = {"pdf", "jpg", "jpeg", "png"}
        throw new ResponseStatusException(BAD_REQUEST, 
            "Formato no permitido. Usa PDF, JPG o PNG");
    }
    
    // 4. SANITIZACIÓN DE NOMBRE
    String safeName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
    
    // 5. GENERAR NOMBRE ÚNICO (UUID + nombre original)
    String storedName = UUID.randomUUID() + "-" + safeName;
    // Ejemplo: "a1b2c3d4-e5f6-7890-Design_V2.pdf"
    
    // 6. VALIDACIÓN DE PATH TRAVERSAL (seguridad)
    Path target = rootPath.resolve(storedName).normalize();
    if (!target.startsWith(rootPath)) {
        throw new ResponseStatusException(BAD_REQUEST, "Nombre de archivo inválido");
    }
    
    // 7. GUARDAR EN DISCO
    try {
        Files.copy(
            file.getInputStream(),
            target,
            StandardCopyOption.REPLACE_EXISTING  // Permite reintentos
        );
        return storedName;
    } catch (IOException ex) {
        throw new ResponseStatusException(INTERNAL_SERVER_ERROR, 
            "No se pudo guardar el archivo", ex);
    }
}
```

### 📂 Dónde se Guardan los Archivos

**Configuración:** `realprint-backend/src/main/resources/application.properties`

```properties
app.upload.dir=uploads
```

**Ubicación en Disco:**
```
realprint-backend/
  └─ uploads/                     ← Directorio raíz
     ├─ a1b2c3d4-Design_V1.pdf
     ├─ e5f6g7h8-Photo_Final.jpg
     ├─ i9j0k1l2-Mockup_2026.png
     └─ ... (más archivos)
```

**Inicialización automática:**
```java
@PostConstruct
void init() {
    try {
        rootPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(rootPath);  // Crea carpeta si no existe
    } catch (IOException ex) {
        throw new ResponseStatusException(INTERNAL_SERVER_ERROR, 
            "No se pudo inicializar el directorio de archivos", ex);
    }
}
```

### 📊 Diagrama del Almacenamiento (Lado Backend)

```
Backend (/upload)
  │
  ├─ 1. FileController.upload() recibe MultipartFile
  │
  ├─ 2. FileStorageService.store() valida:
  │     ├─ ¿No vacío? ✓
  │     ├─ ¿< 10MB? ✓
  │     ├─ ¿Extensión permitida? ✓ (PDF, JPG, PNG)
  │     ├─ ¿Path traversal seguro? ✓
  │     └─ ¿Nombre sanitizado? ✓
  │
  ├─ 3. Genera nombre único
  │     UUID.randomUUID() + "-" + safeName
  │     Resultado: "a1b2c3d4-Design.pdf"
  │
  ├─ 4. Guarda en disco
  │     realprint-backend/uploads/a1b2c3d4-Design.pdf
  │
  └─ 5. Devuelve URL
       {
         "url": "/files/a1b2c3d4-Design.pdf",
         "fileUrl": "/files/a1b2c3d4-Design.pdf",
         "fileName": "a1b2c3d4-Design.pdf"
       }
```

---

## 3️⃣ ADMIN DESCARGA ARCHIVOS

### 👨‍💼 Admin: Vista AdminPedidos

#### Dónde ve los archivos:
- **Ruta:** `http://localhost:5173/admin/pedidos`
- **Paso:** Click en "Ver" → Abre modal con detalles del pedido
- **Sección:** "Archivos del pedido"

#### Código en AdminPedidos.tsx:

```typescript
// App-RealPrint/src/pages/admin/AdminPedidos.tsx (línea ~220-260)

<div>
  <p className="text-surface-500 text-sm mb-2">Archivos del pedido</p>
  {(() => {
    // 1. PARSEAR ARCHIVOS DEL PEDIDO
    const fileUrls = parseFileUrlsFromPedido(selectedPedido);
    
    if (fileUrls.length === 0) {
      return <p className="text-sm text-surface-500">No hay archivos asociados.</p>;
    }
    
    // 2. RENDERIZAR LISTA DE DESCARGAS
    return (
      <ul className="space-y-2">
        {fileUrls.map((fileUrl, index) => (
          <li key={`${fileUrl}-${index}`} className="...">
            {/* 3. BOTÓN DESCARGAR */}
            <button
              type="button"
              onClick={() => handleDownloadFile(fileUrl, index)}
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              {downloadingFile === fileUrl ? "Descargando..." : `Descargar archivo ${index + 1}`}
            </button>
          </li>
        ))}
      </ul>
    );
  })()}
</div>
```

#### Función de Descarga:

```typescript
const handleDownloadFile = async (fileUrl: string, index: number) => {
  if (!isDownloadableUrl(fileUrl)) return;
  
  const token = getToken();
  
  setDownloadingFile(fileUrl);
  try {
    // 1. FETCH CON TOKEN JWT
    const response = await fetch(fileUrl, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    
    // 2. VALIDAR RESPUESTA
    if (!response.ok) {
      // Fallback: abrir en pestaña nueva si falla
      window.open(fileUrl, "_blank", "noopener,noreferrer");
      return;
    }
    
    // 3. CONVERTIR A BLOB
    const blob = await response.blob();
    
    // 4. CREAR URL TEMPORAL
    const objectUrl = URL.createObjectURL(blob);
    
    // 5. CREAR LINK Y DESCARGAR
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = getFileNameFromUrl(fileUrl, index);  // "Design.pdf"
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // 6. LIMPIAR RECURSOS
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    // Fallback en caso de error
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  } finally {
    setDownloadingFile(null);
  }
};
```

### 🔐 Backend: Control de Acceso

#### Endpoint: `GET /files/{fileName}`

**Archivo:** `realprint-backend/src/main/java/.../controller/FileController.java`

```java
@GetMapping("/files/{fileName:.+}")
public ResponseEntity<?> download(
    @PathVariable String fileName,
    Authentication authentication  // JWT token verificado automáticamente
) {
    // 1. VALIDAR ACCESO
    validateDownloadAccess(fileName, authentication);
    
    // 2. CARGAR ARCHIVO DEL DISCO
    FileStorageService.StoredFile storedFile = fileStorageService.load(fileName);
    
    // 3. DEVOLVER ARCHIVO
    return ResponseEntity.ok()
        .contentType(storedFile.mediaType())
        .header(HttpHeaders.CONTENT_DISPOSITION, 
                "attachment; filename=\"" + storedFile.fileName() + "\"")
        .body(storedFile.resource());
}

private void validateDownloadAccess(String fileName, Authentication authentication) {
    // 1. ¿Usuario autenticado?
    if (authentication == null || !authentication.isAuthenticated()) {
        throw new ResponseStatusException(FORBIDDEN, 
            "No tienes permisos para descargar este archivo");
    }
    
    // 2. ¿Es administrador?
    boolean isAdmin = authentication.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .anyMatch("ROLE_ADMIN"::equals);
    
    // Admin puede descargar CUALQUIER archivo
    if (isAdmin) {
        return;  // Acceso permitido
    }
    
    // 3. ¿Es cliente propietario del pedido?
    Usuario usuario = usuarioRepository.findByUsername(authentication.getName())
        .orElseThrow(() -> new ResponseStatusException(FORBIDDEN, 
            "Usuario no válido"));
    
    boolean belongsToUser = pedidoRepository
        .existsByClienteIdAndFileUrlsJsonContaining(
            usuario.getId(), 
            fileName
        );
    
    // Cliente solo puede descargar sus propios archivos
    if (!belongsToUser) {
        throw new ResponseStatusException(FORBIDDEN, 
            "No tienes permisos para descargar este archivo");
    }
}
```

#### Método en Repository:

```java
// En PedidoRepository.java
@Query("SELECT COUNT(p) > 0 FROM Pedido p " +
       "WHERE p.clienteId = :clienteId " +
       "AND p.fileUrlsJson LIKE CONCAT('%', :fileName, '%')")
boolean existsByClienteIdAndFileUrlsJsonContaining(
    @Param("clienteId") String clienteId,
    @Param("fileName") String fileName
);
```

### 📊 Diagrama de Descarga (Admin)

```
Admin en AdminPedidos
  │
  ├─ 1. Click "Descargar archivo"
  │     handleDownloadFile(fileUrl)
  │
  ├─ 2. GET /files/{fileName}
  │     Headers: { Authorization: Bearer JWT_TOKEN }
  │
  ├─ 3. Backend valida:
  │     ├─ ¿JWT token válido?
  │     ├─ ¿Usuario autenticado?
  │     ├─ ¿Es ADMIN? → Permitido
  │     │  (Si no es admin verificaría permisos de cliente)
  │     └─ ¿Archivo existe?
  │
  ├─ 4. FileStorageService.load()
  │     ├─ Validar path (security)
  │     ├─ Verificar archivo existe
  │     ├─ Determinar MIME type
  │     └─ Devolver Resource
  │
  ├─ 5. Response HTTP
  │     Headers: {
  │       Content-Type: application/pdf,
  │       Content-Disposition: attachment; filename="Design.pdf"
  │     }
  │     Body: [contenido binario del archivo]
  │
  └─ 6. Frontend:
       ├─ Blob a URL temporal
       ├─ Crear <a> tag
       ├─ Trigger descarga
       └─ Limpiar recursos
```

---

## 🔒 Consideraciones de Seguridad

### ✅ Lo que ESTÁ protegido

| Aspecto | Protección | Dónde |
|---------|-----------|-------|
| **Autenticación** | JWT token requerido en upload | FileController.upload() |
| **Formatos** | Solo PDF, JPG, PNG | FileStorageService.store() |
| **Tamaño** | Máximo 10 MB | FileStorageService.store() |
| **Path Traversal** | Normalización de paths | FileStorageService.store() |
| **Acceso Admin** | Solo admins pueden descargar cualquier archivo | FileController.validateDownloadAccess() |
| **Acceso Cliente** | Solo pueden descargar sus propios archivos | PedidoRepository.existsByClienteIdAndFileUrlsJsonContaining() |
| **Nombre sanitizado** | UUID + nombre limpio | FileStorageService.store() |

### ⚠️ Posibles Mejoras Futuras

```java
// 1. Virus scanning
- Usar ClamAV o VirusTotal para escanear archivos

// 2. Compresión de imágenes
- Comprimir JPG/PNG automáticamente al recibir

// 3. Generación de thumbnails
- Crear preview de images para UI

// 4. Versionado de archivos
- Mantener histórico de cambios por pedido

// 5. Expiración de archivos
- Eliminar archivos después de N días

// 6. Auditoría
- Log de quién descargó qué y cuándo
```

---

## 📡 Flujo Completo: Cliente → Backend → Admin

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CLIENTE CREA PEDIDO                              │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
        1. Selecciona archivos (PDF/JPG/PNG < 10MB)
        2. Ingresa dimensiones (ancho x alto)
        3. System calcula metros lineales
        
┌─────────────────────────────────────────────────────────────────────┐
│                     FRONTEND SUBE ARCHIVOS                          │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
        POST /upload (FormData + JWT)
        orderService.uploadFile(file)
        
┌─────────────────────────────────────────────────────────────────────┐
│                   BACKEND VALIDA Y ALMACENA                         │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
        1. FileController recibe archivo
        2. FileStorageService valida:
           - Formato (PDF/JPG/PNG)
           - Tamaño (< 10 MB)
           - Path traversal security
        3. Genera UUID único: "a1b2c3d4-filename.pdf"
        4. Guarda en disk: realprint-backend/uploads/
        5. Devuelve URL: /files/a1b2c3d4-filename.pdf
        
┌─────────────────────────────────────────────────────────────────────┐
│              FRONTEND RECIBE Y ALMACENA URL EN PEDIDO               │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
        1. filesWithDimensions[] actualizado con URLs
        2. fileUrls[] actualizado para envío a BD
        3. Usuario confirma pedido
        4. POST /pedidos con fileUrls[] serializado
        
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND GUARDA PEDIDO EN BD                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
        1. Pedido guardado en tabla "pedidos"
        2. Campo fileUrlsJson contiene URLs (JSON string)
        3. Estado = PENDIENTE
        
┌─────────────────────────────────────────────────────────────────────┐
│                    ADMIN VE PEDIDO EN DASHBOARD                     │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
        1. AdminPedidos.tsx carga pedidos
        2. parseFileUrlsFromPedido() extrae URLs
        3. Muestra "Descargar archivo 1", "Descargar archivo 2"
        
┌─────────────────────────────────────────────────────────────────────┐
│                    ADMIN DESCARGA ARCHIVO                           │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
        1. Click en "Descargar archivo"
        2. GET /files/a1b2c3d4-filename.pdf + JWT token
        3. Backend valida:
           - ¿Admin? → Permitido
           - ¿Cliente? → Verificar si es de su pedido
        4. Devuelve archivo con headers MIME y attachment
        5. Frontend descarga a computadora del admin
```

---

## 🛠️ Endpoints Resumen

### Frontend → Backend

#### POST /upload
```
Método: POST
URL: {API_BASE}/upload
Headers: Authorization: Bearer {JWT}
Body: FormData { file: File }

Response 200:
{
  "url": "/files/uuid-filename.pdf",
  "fileUrl": "/files/uuid-filename.pdf",
  "fileName": "uuid-filename.pdf"
}

Response 400:
- Archivo vacío
- Formato no permitido
- Tamaño > 10MB

Response 401:
- JWT no válido o expirado
```

#### GET /files/{fileName}
```
Método: GET
URL: {API_BASE}/files/{fileName}
Example: /files/a1b2c3d4-filename.pdf
Headers: Authorization: Bearer {JWT}

Response 200:
[contenido binario del archivo]
Headers:
  Content-Type: application/pdf|image/jpeg|image/png
  Content-Disposition: attachment; filename="filename.pdf"

Response 403:
- No autenticado
- No es admin y no es dueño del archivo

Response 404:
- Archivo no existe
```

---

## 📚 Archivo Resumen: ¿Qué es Qué?

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| **Step2Details.tsx** | `src/components/CreateOrderForm/` | UI de carga de archivos para cliente |
| **orderService.ts** | `src/services/` | HTTP POST /upload desde frontend |
| **AdminPedidos.tsx** | `src/pages/admin/` | Muestra archivos del pedido en modal |
| **FileController.java** | Backend `.../controller/` | Endpoints /upload y /files/{file} |
| **FileStorageService.java** | Backend `.../service/` | Validación y almacenamiento en disco |
| **uploads/** | Backend raíz | Directorio donde se guardan archivos |
| **parseFileUrlsFromPedido()** | AdminPedidos.tsx | Extrae URLs desde fileUrlsJson del pedido |
| **handleDownloadFile()** | AdminPedidos.tsx | Descarga archivo en computadora del admin |

---

## 🚀 Próximos Pasos (Recomendados)

### Mejora: Validación de Dimensiones en Backend
```java
// Agregar en PedidoService:
- Validar que measurementWidthCm y measurementHeightCm sean coherentes
- Calcular metros lineales en backend también (no solo frontend)
```

### Mejora: Almacenamiento en Cloud
```java
// Considerar migración:
- AWS S3 en lugar de disco local
- Google Cloud Storage
- Azure Blob Storage
// Beneficios: escalabilidad, backup automático, CDN
```

### Mejora: Caché de Archivos
```java
// Agregar:
- Redis para cache de URLs descargadas frecuentemente
- Virusscanning en background
```

---

**Fecha:** 27 de Abril de 2026  
**Versión:** 1.0 - Explicación Completa del Flujo  
**Estado:** ✅ LISTO PARA REFERENCIA

