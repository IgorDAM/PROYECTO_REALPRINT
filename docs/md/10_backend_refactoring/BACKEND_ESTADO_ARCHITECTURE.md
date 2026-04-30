# ARQUITECTURA DE SINCRONIZACIÓN BACKEND-FRONTEND

## 📐 Diagrama de Flujo Estado Pedido

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React/TypeScript)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  AdminPedidos.tsx                                                   │
│  ├─ states: List<Pedido>                                            │
│  ├─ ESTADOS_PEDIDO map:                                             │
│  │  {                                                               │
│  │    "pendiente": { label: "Pendiente", color: "..." }            │
│  │    "en_proceso": { label: "En Proceso", color: "..." }          │
│  │    "completado": { label: "Completado", color: "..." }          │
│  │    "enviado": { label: "Enviado", color: "..." }                │
│  │    "cancelado": { label: "Cancelado", color: "..." }            │
│  │  }                                                               │
│  └─ pedidos.map(p => p.estado === "pendiente") ← STRING MINÚSCULA   │
│                                                                     │
└────────────────────────┬────────────────────────────────────────────┘
                         │ Fetch con httpClient
                         │ GET /api/pedidos
                         │ Authorization: Bearer <token>
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         PROXY (Vite)                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  vite.config.js                                                     │
│  └─ /api → http://localhost:8080/api                               │
│                                                                     │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Spring Boot)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PedidoController.listarPedidos()                                   │
│  ├─ @GetMapping                                                     │
│  ├─ @PreAuthorize("hasRole('ADMIN')")                              │
│  ├─ Llama: PedidoService.findAll()                                 │
│  │   │                                                              │
│  │   ▼                                                              │
│  │   PedidoService.findAll()                                        │
│  │   ├─ Llama: PedidoRepository.findAll()                          │
│  │   │                                                              │
│  │   ▼                                                              │
│  │   PedidoRepository.findAll()                                     │
│  │   ├─ Ejecuta SQL: SELECT * FROM pedidos                        │
│  │   │                                                              │
│  │   ▼                                                              │
│  │   BD (H2 Memory)                                                 │
│  │   ├─ Tabla: pedidos                                             │
│  │   ├─ Fila ejemplo:                                              │
│  │   │  id=1, estado="PENDIENTE", clienteId=1, ...                │
│  │   │       ↑ ENUM (MAYÚSCULA)                                    │
│  │   │                                                              │
│  │   ▼                                                              │
│  │   Retorna: List<Pedido> con:                                    │
│  │   └─ pedido.estado = PedidoEstado.PENDIENTE (ENUM)             │
│  │                       ↑ JAVA ENUM                               │
│  │                                                                  │
│  ├─ PedidoMapper.toDTO(each)  ← ¡CONVERSIÓN CRÍTICA!              │
│  │   └─ PedidoMapper.estadoEnumToString(pedido.getEstado())       │
│  │       └─ PedidoEstado.PENDIENTE → "pendiente"                  │
│  │                                   ↑ STRING MINÚSCULA             │
│  │                                                                  │
│  ├─ Retorna: List<PedidoDTO> con:                                 │
│  │   └─ dto.estado = "pendiente" (STRING)                         │
│  │                   ↑ STRING MINÚSCULA                            │
│  │                                                                  │
│  └─ Jackson JsonSerializer:                                        │
│      └─ Serializa PedidoDTO → JSON                                │
│         {                                                           │
│           "id": 1,                                                  │
│           "estado": "pendiente",  ← JSON STRING MINÚSCULA          │
│           "clienteId": 1,                                          │
│           ...                                                       │
│         }                                                           │
│                                                                     │
└────────────────────────┬────────────────────────────────────────────┘
                         │ HTTP Response 200 OK
                         │ Content-Type: application/json
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         PROXY (Vite)                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Recibe JSON del backend                                            │
│  Envía al Frontend tal cual                                         │
│                                                                     │
└────────────────────────┬────────────────────────────────────────────┘
                         │ JSON Response
                         │ [
                         │   {
                         │     "id": 1,
                         │     "estado": "pendiente",
                         │     ...
                         │   },
                         │   ...
                         │ ]
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React/TypeScript)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  AdminPedidos.tsx.usePedidosData()                                  │
│  ├─ setP edidos(JSON)  ← JSON contiene estado="pendiente"         │
│  │                                                                  │
│  ├─ this.state = {                                                 │
│  │   pedidos: [                                                    │
│  │     { id: 1, estado: "pendiente", ... }  ← STRING MINÚSCULA    │
│  │   ]                                                             │
│  │ }                                                                │
│  │                                                                  │
│  ├─ Render: <Badge variant={pedido.estado}> ← BUSCAR EN MAPA      │
│  │   └─ ESTADOS_PEDIDO[pedido.estado]                             │
│  │       └─ ESTADOS_PEDIDO["pendiente"]  ← ¡COINCIDE!            │
│  │           └─ { label: "Pendiente", color: "bg-yellow-300 ..." }│
│  │               └─ Render: <span>Pendiente</span>                │
│  │                                                                  │
│  └─ ✓ Estado correctamente mapeado en UI                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Archivo Clave: `PedidoMapper.java`

### Conversión: Enum → String (Backend → JSON)

```java
// ENTRADA INTERNA (Backend)
Pedido pedido = new Pedido();
pedido.setEstado(PedidoEstado.PENDIENTE);  // ← ENUM mayúscula
// BD: estado = "PENDIENTE"

// CONVERSIÓN EN MAPPER
PedidoDTO dto = PedidoMapper.toDTO(pedido);

public static PedidoDTO toDTO(Pedido pedido) {
    return PedidoDTO.builder()
        .estado(estadoEnumToString(pedido.getEstado()))  // ← CLAVE
        .build();
}

public static String estadoEnumToString(PedidoEstado estado) {
    if (estado == null) return "pendiente";
    return estado.name().toLowerCase();  // PENDIENTE.toLowerCase() = "pendiente"
}

// SALIDA (JSON)
// {
//   "estado": "pendiente"  ← STRING minúscula
// }
```

### Conversión: String → Enum (Frontend → Backend)

```typescript
// ENTRADA (Frontend JSON)
{
  "id": 1,
  "estado": "completado",  ← STRING minúscula
  ...
}

// ENVÍO VIA HTTP
PUT /api/pedidos/1
Body: { "estado": "completado" }

// RECEPCIÓN EN BACKEND
PedidoDTO incomingDto = mapper.readValue(jsonBody, PedidoDTO.class);
// incomingDto.estado = "completado"  ← STRING

// CONVERSIÓN EN MAPPER
Pedido pedido = PedidoMapper.toEntity(incomingDto);

public static Pedido toEntity(PedidoDTO dto) {
    return Pedido.builder()
        .estado(stringToEstadoEnum(dto.getEstado()))  ← CLAVE
        .build();
}

public static PedidoEstado stringToEstadoEnum(String estado) {
    if (estado == null) return PedidoEstado.PENDIENTE;
    return PedidoEstado.valueOf(estado.toUpperCase());
    // "completado".toUpperCase() = "COMPLETADO"
    // PedidoEstado.valueOf("COMPLETADO") = PedidoEstado.COMPLETADO
}

// ALMACENAMIENTO (BD)
// UPDATE pedidos SET estado="COMPLETADO"
```

---

## 📋 Tabla de Sincronización Completa

| Capa | Tipo | Valor | Ejemplo |
|------|------|-------|---------|
| **Java Enum** | Enum | MAYÚSCULAS | `PedidoEstado.PENDIENTE` |
| **Base de Datos** | VARCHAR(50) | MAYÚSCULAS | `PENDIENTE` |
| **DTO Backend** | String | minúsculas | `"pendiente"` |
| **JSON Wire** | JSON String | minúsculas | `"pendiente"` |
| **Frontend DTO** | String | minúsculas | `"pendiente"` |
| **TypeScript Map** | Object Key | minúsculas | `ESTADOS_PEDIDO["pendiente"]` |
| **UI Rendered** | Texto | Capitalizados | `Pendiente` |

---

## 🎯 Puntos Críticos de Sincronización

### 1. **PedidoController.listarPedidos()**
```java
@GetMapping
public ResponseEntity<List<PedidoDTO>> listarPedidos() {
    List<Pedido> pedidos = pedidoService.findAll();
    List<PedidoDTO> dtos = pedidos.stream()
        .map(PedidoMapper::toDTO)  ← ¡AQUÍ! Conversión enum→string
        .toList();
    return ResponseEntity.ok(dtos);  ← Retorna JSON con estados minúsculas
}
```

### 2. **PedidoController.actualizarPedido()**
```java
@PutMapping("/{id}")
public ResponseEntity<PedidoDTO> actualizarPedido(
        @PathVariable Long id,
        @RequestBody PedidoDTO pedidoDTO) {  ← DTO contiene "estado": "en_proceso"
    Pedido pedido = PedidoMapper.toEntity(pedidoDTO);  ← Convierte a enum
    Pedido actualizado = pedidoService.update(id, pedido);
    return ResponseEntity.ok(PedidoMapper.toDTO(actualizado));  ← Devuelve minúscula
}
```

### 3. **AdminPedidos.tsx - Filtrado por Estado**
```typescript
const filteredPedidos = tabPedidos.filter((pedido) => {
    const matchesFilter = !filterEstado || pedido.estado === filterEstado;
    //                                       ↑ STRING minúscula de JSON
    return matchesSearch && matchesFilter;
});
```

### 4. **AdminPedidos.tsx - Renderizado**
```typescript
const estadoOptions = Object.keys(ESTADOS_PEDIDO).map((state) => ({
    value: state,                              // "pendiente", "en_proceso", ...
    label: ESTADOS_PEDIDO[state]?.label || state,
}));
// Genera opciones: pendiente → "Pendiente", en_proceso → "En Proceso", etc.
```

---

## 🧪 Casos de Prueba

### Test 1: Listar Pedidos
```
→ GET /api/pedidos (con token ADMIN)
← [
    { id: 1, estado: "pendiente", ... }
    { id: 2, estado: "en_proceso", ... }
    { id: 3, estado: "completado", ... }
  ]
✓ Estados están en minúsculas
✓ Frontend puede mapear con ESTADOS_PEDIDO
```

### Test 2: Crear Pedido
```
→ POST /api/pedidos
  Body: { estado: "pendiente", ... }
← { id: 1, estado: "pendiente", ... }
✓ El estado se devuelve en minúsculas
✓ En BD se guardará como "PENDIENTE" (enum)
```

### Test 3: Cambiar Estado
```
→ PUT /api/pedidos/1
  Body: { estado: "en_proceso" }
← { id: 1, estado: "en_proceso", ... }
✓ Recibe "en_proceso" (minúscula)
✓ Convierte a PedidoEstado.EN_PROCESO (enum)
✓ Devuelve en JSON como "en_proceso" (minúscula)
```

### Test 4: Filtrado en UI
```
Frontend AdminPedidos:
→ Usuario selecciona filtro "completado"
→ Filter aplica: pedido.estado === "completado"
← Muestra solo pedidos con estado "completado"
✓ Funciona porque estado en JSON es minúscula
```

---

## ⚠️ Potenciales Puntos de Fallo

### ❌ RIESGO: No usar Mapper
```java
// ❌ MALO - Falla sincronización
return ResponseEntity.ok(pedidos);  // Devuelve enums en mayúsculas
// JSON: { "estado": "PENDIENTE" }  ← Frontend no reconoce

// ✓ CORRECTO
return ResponseEntity.ok(
    pedidos.stream().map(PedidoMapper::toDTO).toList()
);
```

### ❌ RIESGO: No convertir en entrada
```java
// ❌ MALO - Falla creación
Pedido p = new Pedido();
p.setEstado(pedidoDTO.getEstado());  // Intenta asignar String a Enum
// Compile error!

// ✓ CORRECTO
Pedido p = PedidoMapper.toEntity(pedidoDTO);
// Mapper convierte automáticamente
```

### ❌ RIESGO: Inconsistencia en Keys del mapa
```typescript
// ❌ MALO
const ESTADOS = {
    "PENDIENTE": { ... },    // Mayúscula - mismatch con JSON
    "en_proceso": { ... }
};
// ESTADOS["pendiente"] → undefined ❌

// ✓ CORRECTO
const ESTADOS_PEDIDO = {
    "pendiente": { ... },    // minúscula
    "en_proceso": { ... }
};
// ESTADOS_PEDIDO["pendiente"] → objeto ✓
```

---

## 📊 Flujo de Cambio de Estado

```
1. USUARIO SELECCIONA ESTADO EN UI
   └─ Click en botón "Cambiar a En Proceso"
   
2. FRONTEND ENVÍA UPDATE
   └─ PUT /api/pedidos/1
      Body: { "estado": "en_proceso" }
      Header: Authorization: Bearer <token>
   
3. BACKEND RECIBE DTO
   └─ PedidoDTO { estado: "en_proceso" }
   
4. MAPPER CONVIERTE
   └─ PedidoMapper.toEntity(dto)
   └─ Estado: String "en_proceso" → Enum PedidoEstado.EN_PROCESO
   
5. SERVICE ACTUALIZA
   └─ PedidoService.update(1, pedido)
   └─ BD: UPDATE pedidos SET estado="EN_PROCESO" WHERE id=1
   
6. REPOSITORIO RETORNA
   └─ Pedido { estado: PedidoEstado.EN_PROCESO }
   
7. MAPPER DE SALIDA
   └─ PedidoMapper.toDTO(pedido)
   └─ Estado: Enum PedidoEstado.EN_PROCESO → String "en_proceso"
   
8. CONTROLLER DEVUELVE
   └─ ResponseEntity<PedidoDTO> con estado="en_proceso"
   
9. JSON SERIALIZADO
   └─ { "id": 1, "estado": "en_proceso", ... }
   
10. FRONTEND RECIBE
    └─ Actualiza estado en local state
    └─ Re-render con badge ESTADOS_PEDIDO["en_proceso"]
    └─ Muestra "En Proceso" en color azul
    
✓ SINCRONIZACIÓN COMPLETA
```

---

## ✅ Validación de Correctness

Para verificar que la sincronización funciona:

```java
// Test en Backend
@Test
void testEstadoSincronizacion() {
    // Crear entity con enum
    Pedido p = new Pedido();
    p.setEstado(PedidoEstado.PENDIENTE);
    
    // Mapear a DTO
    PedidoDTO dto = PedidoMapper.toDTO(p);
    
    // Verificar que estado está en minúsculas
    assertEquals("pendiente", dto.getEstado());  ✓
    
    // Serializar a JSON
    String json = objectMapper.writeValueAsString(dto);
    
    // Verificar en JSON
    assertTrue(json.contains("\"estado\":\"pendiente\""));  ✓
}

@Test
void testEstadoDesdeJson() {
    // JSON desde frontend
    String json = "{\"estado\":\"en_proceso\"}";
    
    // Deserializar
    PedidoDTO dto = objectMapper.readValue(json, PedidoDTO.class);
    
    // Mapear a entity
    Pedido p = PedidoMapper.toEntity(dto);
    
    // Verificar que está en enum correcto
    assertEquals(PedidoEstado.EN_PROCESO, p.getEstado());  ✓
}
```

---

Documento de Arquitectura v1.0  
Generado: 2026-04-28  
Responsabilidad: Sincronización Frontend-Backend Estado Pedido

