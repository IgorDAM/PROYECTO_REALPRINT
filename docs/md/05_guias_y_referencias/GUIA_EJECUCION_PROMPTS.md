# Guía de Ejecución de Prompts - RealPrint

**Objetivo:** Instrucciones específicas para implementar cada prompt de forma eficiente.

---

## 📌 ANTES DE EMPEZAR

### Prerequisitos verificados:
- [ ] Tengo acceso al repositorio backend (Spring Boot) o sé dónde crearlo
- [ ] Frontend React está en `/App-RealPrint` ✓
- [ ] Tengo Copilot o acceso a ChatGPT con contexto largo
- [ ] Node.js + npm instalados
- [ ] Git configurado para commits

### Instalaciones faltantes en frontend:
```bash
cd D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\App-RealPrint
npm install zod react-toastify axios
```

---

## 🔄 FASE 1: BACKEND CORE (Prompts 1-2)

### Requisito: Backend Spring Boot

**Si ya existe:**
1. Localiza el repositorio backend (ej: `PROYECTO_REALPRINT_BACKEND` o similar)
2. Abre en IntelliJ / VS Code
3. Procede a "Implementación"

**Si no existe:**
1. Crea proyecto Spring Boot nuevo (recomendado: Spring Initializr)
2. Dependencias recomendadas:
   - Spring Web
   - Spring Data JPA
   - PostgreSQL Driver
   - Lombok
   - Validation
   - Spring Security (opcional pero recomendado)

---

### Implementación - Prompt 1 (Modelo de Datos)

#### Paso 1: Obtener código del Prompt 1

**Copia el siguiente texto y pasa a Copilot:**

```
Necesito modelar las órdenes de RealPrint en Hibernate/JPA.

Requisitos:
1. Tabla ORDER con campos base (id, fecha, cliente, estado)
2. Tabla ORDER_ITEM (líneas de pedido)
3. Tabla LOCATION_PLACEMENT para posiciones de marcaje
4. Tabla PRODUCT_INVENTORY para prendas disponibles
5. Tabla FINAL_PRODUCT para productos finales configurados por admin

Relaciones:
- ORDER → ORDER_ITEM (one-to-many)
- ORDER_ITEM → LOCATION_PLACEMENT (many-to-one)
- ORDER_ITEM → PRODUCT_INVENTORY (many-to-one, nullable)
- ORDER_ITEM → FINAL_PRODUCT (many-to-one, nullable)

Campos adicionales en ORDER_ITEM:
- type: SCREENPRINTING o SCREENPRINTING_PRESSING
- clientProvidedClothing: boolean
- fileUrl: String (nullable)
- quantity: int
- measurementCm: int (nullable)
- locationPlacement: LocationPlacement
- inventory: ProductInventory (nullable)
- finalProduct: FinalProduct (nullable)
- price: BigDecimal

Genera las entidades con anotaciones Lombok, @Entity, @Table, relaciones.
```

#### Paso 2: Crear archivos generados

**Estructura esperada:**
```
src/main/java/com/realprint/
├── entities/
│   ├── Order.java
│   ├── OrderItem.java
│   ├── LocationPlacement.java
│   ├── ProductInventory.java
│   └── FinalProduct.java
├── enums/
│   ├── OrderType.java (SCREENPRINTING, SCREENPRINTING_PRESSING)
│   ├── OrderStatus.java (PENDING, CONFIRMED, COMPLETED, CANCELLED)
│   └── PlacementCategory.java (SUPERIOR, INFERIOR)
```

#### Paso 3: Verificar entidades

Checklist de validación:
- [ ] `@Entity` y `@Table` anotados correctamente
- [ ] `@Id` con `@GeneratedValue(strategy = GenerationType.UUID)`
- [ ] Relaciones con `@OneToMany`, `@ManyToOne` correctas
- [ ] `@Temporal` o `@CreationTimestamp` para fechas
- [ ] Getters/Setters (Lombok `@Data`)
- [ ] No-args constructor (`@NoArgsConstructor`)

---

### Implementación - Prompt 2 (Controllers + Services)

#### Paso 1: Obtener código del Prompt 2

**Copia el siguiente texto y pasa a Copilot:**

```
Necesito crear el endpoint POST /api/orders para crear órdenes en RealPrint.

El cliente enviará un JSON con esta estructura:

{
  "customerId": "uuid",
  "items": [
    {
      "type": "SCREENPRINTING" | "SCREENPRINTING_PRESSING",
      "clientProvidedClothing": true/false,
      "fileUrl": "s3://...",
      "quantity": 10,
      "measurementCm": 15,
      "locationPlacementId": "uuid",
      "inventoryProductId": "uuid",
      "finalProductId": "uuid"
    }
  ]
}

Crea:
1. OrderService con método createOrder(CreateOrderRequest) que:
   - Valide que SCREENPRINTING_PRESSING sin propia ropa → necesita inventoryProductId o finalProductId
   - Valide que SCREENPRINTING → necesita fileUrl
   - Valide que si hay locationPlacement → debe ser SCREENPRINTING_PRESSING
   - Calcule el precio según el tipo
   - Persista la orden

2. OrderController con:
   - POST /api/orders (crear)
   - GET /api/orders/{id} (detalle)
   - GET /api/orders (listar del cliente autenticado)

Usa DTO para request/response y mapeos con Hibernate.
```

#### Paso 2: Crear archivos generados

**Estructura esperada:**
```
src/main/java/com/realprint/
├── dto/
│   ├── CreateOrderRequest.java
│   ├── OrderDTO.java
│   └── OrderItemDTO.java
├── services/
│   └── OrderService.java
└── controllers/
    └── OrderController.java
```

#### Paso 3: Verificar endpoints

Checklist funcional:
- [ ] `POST /api/orders` con @PostMapping
- [ ] `GET /api/orders` con filtro por usuario autenticado
- [ ] `GET /api/orders/{id}` con @PathVariable
- [ ] Validaciones con `@Valid` y `@NotNull`
- [ ] Manejo de excepciones (BadRequest, NotFound)
- [ ] Respuestas con `ResponseEntity`

---

## 🎨 FASE 2: SISTEMA DE UBICACIONES

### Implementación - Prompt 4 (Backend)

#### Paso 1: Obtener código del Prompt 4 Backend

**Copia el siguiente texto y pasa a Copilot:**

```
[Copia la sección "PARTE 1: BACKEND" del archivo adjunto realprint_prompts_3_4_expandido.md]
```

#### Paso 2: Crear archivos

**Estructura esperada:**
```
src/main/java/com/realprint/
├── entities/
│   └── LocationPlacement.java
├── dto/
│   ├── LocationPlacementDTO.java
│   ├── CreateLocationPlacementRequest.java
│   └── UpdateLocationPlacementRequest.java
├── repositories/
│   └── LocationPlacementRepository.java
├── services/
│   └── LocationPlacementService.java
└── controllers/
    └── LocationPlacementController.java
```

#### Paso 3: Ejecutar migración SQL

```sql
INSERT INTO location_placement (id, name, category, base_price, active, created_at, updated_at) 
VALUES
('uuid-1', 'Pecho', 'SUPERIOR', 5.00, true, NOW(), NOW()),
('uuid-2', 'Espalda', 'SUPERIOR', 5.00, true, NOW(), NOW()),
('uuid-3', 'Manga Derecha', 'SUPERIOR', 5.00, true, NOW(), NOW()),
('uuid-4', 'Manga Izquierda', 'SUPERIOR', 5.00, true, NOW(), NOW()),
('uuid-5', 'Pernera Izquierda', 'INFERIOR', 5.00, true, NOW(), NOW()),
('uuid-6', 'Pernera Derecha', 'INFERIOR', 5.00, true, NOW(), NOW());
```

#### Paso 4: Verificar endpoints

Checklist de endpoints:
- [ ] `POST /api/placements` (crear, solo ADMIN)
- [ ] `GET /api/placements` (listar todas activas)
- [ ] `GET /api/placements/by-category/{category}`
- [ ] `GET /api/placements/{id}`
- [ ] `PUT /api/placements/{id}` (solo ADMIN)
- [ ] `DELETE /api/placements/{id}` (soft delete, solo ADMIN)

---

### Implementación - Prompt 4 (Frontend)

#### Paso 1: Crear servicios

**Ruta:** `App-RealPrint/src/services/placementService.ts`

**Copia el siguiente código:**
```typescript
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const placementService = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/placements`);
    if (!res.ok) throw new Error("Error fetching placements");
    return res.json();
  },

  getByCategory: async (category: string) => {
    const res = await fetch(`${API_BASE}/placements/by-category/${category}`);
    if (!res.ok) throw new Error(`Error fetching ${category} placements`);
    return res.json();
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_BASE}/placements/${id}`);
    if (!res.ok) throw new Error("Error fetching placement");
    return res.json();
  },

  create: async (data: any) => {
    const res = await fetch(`${API_BASE}/placements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error creating placement");
    return res.json();
  },

  update: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/placements/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error updating placement");
    return res.json();
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_BASE}/placements/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error deleting placement");
  },
};
```

#### Paso 2: Crear hook

**Ruta:** `App-RealPrint/src/hooks/usePlacements.ts`

```typescript
import { useState, useEffect } from "react";
import { placementService } from "../services/placementService";

export const usePlacements = (category: string | null = null) => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = category
          ? await placementService.getByCategory(category)
          : await placementService.getAll();
        setPlacements(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [category]);

  return { placements, loading, error };
};
```

#### Paso 3: Crear componente PlacementSelector

**Ruta:** `App-RealPrint/src/components/Placements/PlacementSelector.tsx`

**Copia del archivo adjunto la sección "PlacementSelector.jsx" de Prompt 4**

#### Paso 4: Crear página PlacementsAdmin

**Ruta:** `App-RealPrint/src/pages/admin/PlacementsAdmin.tsx`

**Copia del archivo adjunto la sección "PlacementsAdmin.jsx" de Prompt 4**

---

## 📋 FASE 3: FRONTEND MEJORADO

### Implementación - Prompt 3

#### Paso 1: Instalar Zod

```bash
npm install zod
npm install react-toastify --save
```

#### Paso 2: Crear validaciones

**Ruta:** `App-RealPrint/src/schemas/orderValidation.ts`

**Copia el contenido "VALIDACIONES (Zod Schema)" del archivo adjunto realprint_prompts_3_4_expandido.md**

#### Paso 3: Crear estructura de componentes

**Estructura a crear:**
```
src/components/CreateOrderForm/
├── CreateOrderForm.tsx (componente principal)
├── Step1TypeSelector.tsx
├── Step2Details.tsx
├── Step3Details.tsx
├── Step4Review.tsx
└── PricesSummary.tsx
```

#### Paso 4: Implementar componentes

**Copiar especificaciones del Prompt 3 y dejar que Copilot genere código**

#### Paso 5: Integrar en rutas

**Ruta:** `App-RealPrint/src/App.tsx`

```tsx
import CreateOrderForm from "./components/CreateOrderForm/CreateOrderForm";

// Dentro de <Routes>
<Route path="/cliente/nuevo-pedido" element={<CreateOrderForm />} />
```

---

## ✅ TESTING Y VALIDACIÓN

### Test 1: Backend básico
```bash
# En terminal backend
mvn test

# O ejecutar manualmente
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "user-uuid",
    "items": [{
      "type": "SCREENPRINTING",
      "fileUrl": "s3://...",
      "quantity": 10,
      "measurementCm": 15
    }]
  }'
```

### Test 2: Frontend - Placements
```bash
cd App-RealPrint
npm run dev

# Ir a: http://localhost:5173/admin/placements
# Verificar que carga lista de ubicaciones
```

### Test 3: Frontend - Crear orden
```bash
# En el mismo servidor dev
# Ir a: http://localhost:5173/cliente/nuevo-pedido
# Completar formulario multi-paso
# Verificar que POST /api/orders se envía correctamente
```

---

## 🐛 Solución de problemas comunes

### CORS Error
**Síntoma:** `Access to XMLHttpRequest blocked`

**Solución (Backend):**
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }
}
```

### API_URL no configurada
**Síntoma:** Requests a `http://undefined/api`

**Solución (Frontend):**
```bash
# Crear archivo .env.local
VITE_API_URL=http://localhost:8080/api
```

### UUID mismatch
**Síntoma:** Validation errors en IDs

**Solución:** Asegurar que backend y frontend usan mismo formato UUID (String)

---

## 📊 Checklist final

### Antes de considerar completado:

#### Fase 1 ✓
- [ ] Backend inicia sin errores
- [ ] Entidades creadas y migraciones ejecutadas
- [ ] POST /api/orders funciona
- [ ] GET /api/orders lista órdenes

#### Fase 2 ✓
- [ ] Entidad LocationPlacement existe
- [ ] Endpoints /api/placements funcionales
- [ ] Datos iniciales insertados (6 ubicaciones)

#### Fase 3 ✓
- [ ] Componentes PlacementSelector renderiza
- [ ] PlacementsAdmin lista/crea ubicaciones
- [ ] usePlacements hook funciona

#### Fase 4 ✓
- [ ] CreateOrderForm multi-paso funciona
- [ ] Validación Zod activa
- [ ] POST /api/orders envía datos correctos
- [ ] Toast notifications muestran feedback
- [ ] UI responsiva en móvil

---

## 📞 Soporte

Si encuentras problemas:

1. **Revisar logs:** Backend + Browser DevTools
2. **Network tab:** Inspeccionar requests/responses
3. **Database:** Verificar datos con `SELECT * FROM location_placement;`
4. **Git:** Hacer commit después de cada fase para poder revertir


