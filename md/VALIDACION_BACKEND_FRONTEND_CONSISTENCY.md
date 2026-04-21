# Validación de Consistencia Backend ↔ Frontend

**Fecha:** 2026-04-21  
**Propósito:** Matriz de validación entre entidades/payload del backend y estructura de datos del frontend.

---

## 0) Autenticación - Login Flow

### ✅ Backend Response (AuthService.java)
```java
LoginResponse {
  token: String,
  user: UserInfo {
    id: Long,
    username: String,
    name: String,
    role: String (minúsculas: "admin", "cliente")
  }
}
```

### ✅ Frontend Expected (authService.ts)
```typescript
AuthResponse {
  token: string,
  user: AuthUser {
    id?: number | string,
    username?: string,
    name?: string,
    role?: string,
    especialidad?: string
  }
}
```

### Mapping
| Backend | Frontend | Conversión | Status |
|---------|----------|-----------|--------|
| `token` | `token` | Directo | ✅ OK |
| `user.id` | `user.id` | Directo | ✅ OK |
| `user.username` | `user.username` | Directo | ✅ OK |
| `user.name` | `user.name` | Directo `nombre` → `name` | ✅ CORRECTED |
| `user.role` | `user.role` | Directo `rol` → `role` (minúsculas) | ✅ CORRECTED |

**Cambios realizados en auditoría (2026-04-21):**
- ✅ Backend: `LoginResponse.java` refactorizada con clase `UserInfo` anidada
- ✅ Backend: `AuthService.java` ahora construye respuesta con estructura anidada
- ✅ Frontend: `authService.ts` actualizado para parsear nueva estructura
- ✅ Frontend: `App.tsx` limpiado (removidas rutas de compatibilidad temporal)

---

## 1) Entidad `Pedido` (Backend) ↔ FormData (Frontend)

### Backend `Pedido.java`
```
id (Long, PK autogenerado)
clienteId (Long, FK)
clienteNombre (String)
servicio (String)
subservicio (String)
opcion (String)
productoFinalId (Long, nullable)
pedido (String)
descripcion (String)
cantidad (Integer)
cantidadUnidades (Integer)
fecha (LocalDate)
fechaEntrega (LocalDate)
measurementWidthCm (Integer)
measurementHeightCm (Integer)
fileUrlsJson (String, JSON)
estado (PedidoEstado enum)
total (BigDecimal)
boxTotal (Integer)
cajasCompletadas (Integer)
tamanoCaja (Integer)
createdAt (LocalDateTime)
updatedAt (LocalDateTime)
```

### Frontend FormData (CreateOrderForm.tsx)
```
fileUrls: string[]
filesWithDimensions: FileWithDimensions[] (NEW: con widthCm, heightCm por archivo)
quantity: number
linearMeters: number
spacingCm: number
unitWidthCm: number (NEW: ancho referencia)
unitHeightCm: number (NEW: alto referencia)
orderType: string
```

### Mapping Observado
| Backend | Frontend | Conversión | Estado |
|---------|----------|-----------|--------|
| `clienteId` | — | Se obtiene de `useAuth().user.id` | ✅ Correcto |
| `clienteNombre` | — | Se obtiene de `useAuth().user.name` | ✅ Correcto |
| `servicio` | `orderType` | Debe ser "serigrafia" | ✅ Correcto |
| `subservicio` | — | Fijo "solo_serigrafia" | ✅ Correcto |
| `opcion` | — | Fijo "cliente_ropa" | ✅ Correcto |
| `cantidad` | `quantity` | Directo | ✅ Correcto |
| `cantidadUnidades` | `quantity` | Duplicado intencional para compatibilidad | ✅ Correcto |
| `measurementWidthCm` | `unitWidthCm` | Directo (NEW field) | ✅ Correcto |
| `measurementHeightCm` | `unitHeightCm` | Directo (NEW field) | ✅ Correcto |
| `fileUrlsJson` | `fileUrls` + `filesWithDimensions` | Serialización a JSON | ✅ Correcto |
| `estado` | — | Fijo PENDIENTE al crear | ✅ Correcto |
| `total` | Calculado por `pricing.ts` | Se calcula en frontend, se envía al backend | ✅ Correcto |

---

## 2) Flujo de Cálculo: Frontend → Backend

### Frontend (`pricing.ts`)
1. **Input:** `quantity`, `unitWidthCm`, `unitHeightCm`, `spacingCm`
2. **Cálculo:** `calculateLayoutMetrics()` → `unitsPerRow`, `rows`, `totalLinearMetersRaw`, `billableLinearMeters`
3. **Pricing:** `calculateOrderPricing()` → `totalPrice` (€)
4. **Output:** Payload con `linearMeters`, `billableLinearMeters`, `total`

### Backend (`PedidoService.java`)
1. **Recibe:** Payload con campos `cantidad`, `linearMeters`, `total`
2. **Guarda:** En entidad `Pedido` tal cual se recibe
3. **Validación:** Rango de cantidad, precio mínimo

### Validación ✅
- Frontend calcula metraje correcto (tests unitarios en `pricing.test.ts` pasan)
- Backend recibe y almacena sin recalcular (responsabilidad correcta del frontend)
- Datos consistentes en persistencia

---

## 3) Estructura de Archivos: Frontend

### Archivos adjuntos con dimensiones (`FileWithDimensions`)
```typescript
interface FileWithDimensions {
  id: string;           // Único para tracking
  name: string;         // Nombre del archivo
  url?: string;         // URL o ruta remota
  widthCm?: number;     // Ancho desigual por archivo (NEW)
  heightCm?: number;    // Alto desigual por archivo (NEW)
}
```

### Uso en cálculos
- **Step2Details.tsx:** Permite subir archivos Y definir ancho/alto por cada archivo
- **pricing.ts:** Usa `Math.max()` de todas las dimensiones para evitar subestimar espacios
- **OrderLayoutPreview.tsx:** Visualiza distribución con mayor dimensión (conservador)

### Validación ✅
- Todos los archivos deben tener widthCm > 0 Y heightCm > 0 para validar
- Preview solo muestra archivos válidos
- Cálculo de precios se basa en máxima huella

---

## 4) Enumeraciones y Constantes

### Backend
```java
enum RolUsuario { ADMIN, CLIENTE }  // Operario todavía no está
enum PedidoEstado { PENDIENTE, EN_PROCESO, COMPLETADO }
```

### Frontend
```typescript
// No hay constants harcodeadas: se usan valores string.
// RECOMENDACIÓN: Extraer enums a archivo compartido con backend.
```

### Validación ⚠️ Nota
- Backend solo tiene `ADMIN` y `CLIENTE`, frontend no menciona `OPERARIO` en rutas
- Estados coinciden en nomenclatura (PENDIENTE ≠ pendiente) → verificar serialización

---

## 5) Archivos de Configuración del Proyecto

### Bien estructurado ✅
```
App-RealPrint/
├── src/
│   ├── components/ (UI + orden creación)
│   ├── pages/ (rutas por rol)
│   ├── context/ (estado global)
│   ├── hooks/ (lógica reutilizable)
│   ├── services/ (HTTP, auth)
│   ├── utils/ (helpers, pricing)
│   └── schemas/ (validación Zod)
├── public/ (assets estáticos)
├── e2e/ (Tests de usuario)
└── test/ (Configuración Vitest)
```

### Archivos Candidatos a Limpieza
- `src/vite-env.d.ts` — Solo comentario, mantener
- Archivos `.old` o marcados como obsoletos — Ya fueron deletea dos en commit anterior

---

## 6) Clean Code & Documentación

### Archivos con buenos comentarios ✅
- `pricing.ts` — Actualizado con didácticos en este ciclo
- `OrderLayoutPreview.tsx` — Actualizado con didácticos en este ciclo
- `pricing.test.ts` — Casos claros, bien nombrados

### Archivos a mejorar en siguiente ciclo
- `Step2Details.tsx` — Funcionalidad compleja, agregar comentarios
- `CreateOrderForm.tsx` — Orquestación, podría ser más clara
- `LinearPedidoEditor.tsx` — Lógica de edición, agregar contexto

---

## 7) Checklist de Validación Final

- ✅ Backend `Pedido` y Frontend formData tienen correspondencia clara
- ✅ Cálculos de precios/metraje correctos (tests unitarios pasan)
- ✅ Archivos con dimensiones por unidad funcionan
- ✅ Preview responsive y actualización en tiempo real
- ✅ Payload al backend contiene todos los campos necesarios
- ✅ Estructura carpetas sigue patrón React claro
- ✅ Principales archivos tienen comentarios didácticos
- ⚠️ Enums backend ↔ frontend no comparten definición (próxima mejora)
- ⚠️ Más archivos podrían tener comentarios contextuales

---

## 8) Próximas Acciones (No incluidas en este ciclo)

1. Extraer enums a archivo `.ts` compartido (backend ↔ frontend).
2. Agregar comentarios didácticos a más componentes.
3. Refactorizar Step2Details para reducir complejidad cognitiva.
4. Crear tipo DTO genérico para consistencia en payloads.
5. Documentar en backend el mapeado de campos (comentarios Java).

---

**Conclusión:** Arquitectura consistente, con buen nivel de acoplamiento. Frontend es responsable de cálculos, backend de persistencia y seguridad. ✅

