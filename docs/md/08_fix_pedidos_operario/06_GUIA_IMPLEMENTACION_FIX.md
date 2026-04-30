# 📝 Guía de Implementación: Fix Pedidos Operario

## 🎯 Objetivo
Conectar el componente `ListaPedidosOperario` al contexto global para que reciba pedidos reales filtrados por especialidad del operario.

---

## 🏗️ Paso 1: Entender la Arquitectura Actual

### Flujo de Datos en la App

```
┌─────────────────────────────────────────────────────────┐
│                   DataContext (Global)                  │
│  - pedidos[] (todos los pedidos del sistema)           │
│  - usuarios[] (todos los usuarios)                      │
│  - tareas[] (asignaciones de trabajo)                   │
└─────────────────────────────────────────────────────────┘
         ↑                    ↑                    ↑
         │                    │                    │
         │                    │                    │
    AdminPedidos          OperarioDashboard   OperarioPedidos
    (consume todo)        (filtra por ID)     (ANTES: sin filtro)
```

### Conceptos Clave

1. **Pedido**: Documento creado por cliente
   ```javascript
   { id, servicio: "serigrafia", cliente, cantidad, estado, ... }
   ```

2. **Tarea**: Asignación de trabajo a operario
   ```javascript
   { id, pedidoId, operarioId, estado, ... }
   ```

3. **Especialidad**: Tipo de trabajo que puede hacer cada operario
   ```javascript
   { id: 3, username: "operario_demo_serigrafia", especialidad: "serigrafia" }
   ```

---

## 🔧 Paso 2: Identificar el Problema

### Código Problemático Original

**Archivo:** `src/components/ListaPedidosOperario.tsx`

```typescript
❌ PROBLEMA:
import React, { useState } from "react";

// Datos locales, no conectados al contexto
const pedidosIniciales = [
  {
    id: 1,
    cliente: "Cliente X",
    totalUnidades: 200,
    unidadesPorCaja: 50,
    cajasTotales: 4,
    cajasCompletadas: 0,
  },
  {
    id: 2,
    cliente: "Cliente Y",
    totalUnidades: 120,
    unidadesPorCaja: 50,
    cajasTotales: 3,
    cajasCompletadas: 1,
  },
];

function ListaPedidosOperario() {
  // ❌ Estado local, nunca se actualiza
  const [pedidos, setPedidos] = useState(pedidosIniciales);

  const actualizarCajas = (pedidoId, nuevasCajasCompletadas) => {
    setPedidos((prevPedidos) =>
      prevPedidos.map((p) =>
        p.id === pedidoId
          ? { ...p, cajasCompletadas: nuevasCajasCompletadas }
          : p
      )
    );
  };

  return (
    <div>
      <h2>Pedidos del Operario</h2>
      {pedidos.map(pedido => (
        <PedidoOperario
          key={pedido.id}
          pedido={pedido}
          onActualizarCajas={actualizarCajas}
        />
      ))}
    </div>
  );
}
```

**¿Por qué es un problema?**
- ❌ Datos están hardcodeados en el componente
- ❌ No se conecta a `DataContext`
- ❌ No se actualiza cuando se crea un pedido
- ❌ No filtra por especialidad del operario
- ❌ Admin funciona porque usa `usePedidosData()`

---

## ✅ Paso 3: Planificar la Solución

### Requisitos

1. **Conectar al contexto** → Usar hooks de datos
2. **Obtener especialidad** → Del usuario autenticado
3. **Filtrar pedidos** → Que coincidan con especialidad
4. **Actualizar en tiempo real** → Cuando se crean pedidos
5. **Mantener compatibilidad** → Con `PedidoOperario`

### Cambios Necesarios

```
Archivos a modificar:
1. src/components/ListaPedidosOperario.tsx (PRINCIPAL)
2. src/components/PedidoOperario.tsx (UI mejorada)
3. src/context/AuthContext.tsx (agregar type especialidad)
```

---

## 🔨 Paso 4: Implementación - ListaPedidosOperario.tsx

### Import de Hooks

```typescript
// ✅ AGREGAR ESTOS IMPORTS:
import { useAuth } from "../context/AuthContext";
import { usePedidosData } from "../hooks/usePedidosData";
import { useProductosData } from "../hooks/useProductosData";
import PedidoOperario from "./PedidoOperario";

// ❌ ELIMINAR:
// import React, { useState } from "react";
```

### Interfaz de Datos

```typescript
// ✅ ACTUALIZAR - Agregar campos nuevos
interface PedidoOperarioItem {
  id: string | number;           // ← Ahora puede ser string
  cliente: string;
  totalUnidades: number;
  unidadesPorCaja: number;
  cajasTotales: number;
  cajasCompletadas: number;
  estado: string;                 // ← NUEVO
  fechaEntrega: string;           // ← NUEVO
  productoNombre: string;         // ← NUEVO
}
```

### Lógica Principal

```typescript
function ListaPedidosOperario() {
  // 1️⃣ Obtener usuario autenticado
  const { user } = useAuth();

  // 2️⃣ Obtener datos del contexto
  const { pedidos, updatePedido } = usePedidosData();
  const { productosFinales } = useProductosData();

  // 3️⃣ FILTRAR pedidos del operario
  // Criterio 1: El servicio coincide con especialidad del operario
  // Criterio 2: El pedido está en estado activo
  const pedidosDelOperario = (pedidos || []).filter((p: any) => {
    const esDelServicio = p.servicio === user?.especialidad;
    const esActivo = p.estado === "pendiente" || p.estado === "en_proceso";
    return esDelServicio && esActivo;
  });

  // 4️⃣ MAPEAR a formato del componente
  // Transformar estructura del contexto a lo que espera PedidoOperario
  const pedidosFormateados: PedidoOperarioItem[] = pedidosDelOperario.map((p: any) => {
    const productoFinal = productosFinales.find((pf: any) => pf.id == p.productoFinalId);
    const unidadesPorCaja = p.tamanoCaja || productoFinal?.tamanoCaja || 50;
    const cantidadCajas = p.boxTotal || 1;

    return {
      id: p.id,
      cliente: p.cliente || "N/A",
      totalUnidades: p.cantidadUnidades || 50,
      unidadesPorCaja,
      cajasTotales: cantidadCajas,
      cajasCompletadas: p.estado === "completado" ? cantidadCajas : 0,
      estado: p.estado,
      fechaEntrega: p.fechaEntrega || "N/A",
      productoNombre: productoFinal?.nombre || "Producto desconocido",
    };
  });

  // 5️⃣ ACTUALIZAR cajas
  const actualizarCajas = (pedidoId: string | number, nuevasCajasCompletadas: number) => {
    const pedidoActual = pedidosDelOperario.find((p: any) => p.id === pedidoId);
    if (pedidoActual) {
      const totalCajas = pedidoActual.boxTotal || 1;
      let nuevoEstado = "en_proceso";
      if (nuevasCajasCompletadas >= totalCajas) {
        nuevoEstado = "completado";
      }
      updatePedido(pedidoId, { estado: nuevoEstado });
    }
  };

  // 6️⃣ RENDERIZAR
  if (pedidosFormateados.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-surface-500">No hay pedidos asignados en este momento</p>
      </div>
    );
  }

  return (
    <div>
      {pedidosFormateados.map(pedido => (
        <PedidoOperario
          key={pedido.id}
          pedido={pedido}
          onActualizarCajas={actualizarCajas}
        />
      ))}
    </div>
  );
}

export default ListaPedidosOperario;
```

---

## 🎨 Paso 5: Implementación - PedidoOperario.tsx

### Mejora de UI

```typescript
// ✅ Cambios principales:

// 1. Mostrar información real
<div className="flex items-center gap-3 mb-2">
  <h3 className="text-lg font-bold text-surface-900">Pedido #{pedido.id}</h3>
  <span className={`text-xs font-medium px-3 py-1 rounded-full ${...}`}>
    {getEstadoLabel(pedido.estado)}  {/* ← Estado visible */}
  </span>
</div>

// 2. Información del cliente y producto
<p className="text-sm text-surface-600 mb-1">
  <strong>Cliente:</strong> {pedido.cliente}
</p>
<p className="text-sm text-surface-600 mb-1">
  <strong>Producto:</strong> {pedido.productoNombre}
</p>

// 3. Barra de progreso visual
<div className="flex-1 bg-surface-200 rounded-full h-2">
  <div
    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
    style={{ width: `${porcentajeCompletado}%` }}
  />
</div>

// 4. Grid mejorado de cajas
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
  {Array.from({ length: pedido.cajasTotales }).map((_, idx) => {
    const isCompleted = idx < pedido.cajasCompletadas;
    const isDisabled = idx > pedido.cajasCompletadas;

    return (
      <label className={`
        p-3 rounded-lg border-2 cursor-pointer transition-all
        ${isCompleted ? "bg-green-50 border-green-300" : "bg-white"}
      `}>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onActualizarCajas(pedido.id, idx + 1)}
          disabled={isDisabled}
          className="sr-only"
        />
        <span>Caja {idx + 1}</span>
        {isCompleted && <div>✓</div>}
      </label>
    );
  })}
</div>
```

---

## 🔐 Paso 6: Actualizar Tipos - AuthContext.tsx

### Problema Original

```typescript
❌ ANTES:
interface AuthUser {
  id?: number | string;
  username?: string;
  name?: string;
  role?: Role;
  // ❌ Falta: especialidad
}
```

### Solución

```typescript
✅ DESPUÉS:
interface AuthUser {
  id?: number | string;
  username?: string;
  name?: string;
  role?: Role;
  especialidad?: string;  // ← AGREGAR ESTA LÍNEA
}
```

---

## 📋 Paso 7: Verificar la Solución

### Checklist de Verificación

```javascript
// 1. Abrir DevTools > Console

// Verificar que obtiene el usuario correctamente:
console.log('Usuario:', user);
// Debe tener: { id, username, role: "operario", especialidad: "serigrafia" }

// Verificar que obtiene pedidos del contexto:
console.log('Todos los pedidos:', pedidos);
// Debe tener array con pedidos reales

// Verificar filtrado:
console.log('Pedidos del operario:', pedidosDelOperario);
// Debe mostrar SOLO pedidos con servicio === "serigrafia"

// Verificar mapping:
console.log('Pedidos formateados:', pedidosFormateados);
// Debe tener estructura con { id, cliente, productoNombre, etc }
```

### Prueba Funcional

```
1. LOGIN cliente → crear pedido serigrafía (3 cajas)
2. LOGOUT
3. LOGIN operario_demo_serigrafia
4. Ir a OperarioPedidos
5. ✅ Debe aparecer el nuevo pedido
6. ✅ Con información real
7. Marcar caja 1 → Progreso 33%
8. Marcar caja 2 → Progreso 66%
9. Marcar caja 3 → Progreso 100% + "Completado"
```

---

## 🐛 Paso 8: Debugging Común

### Problema 1: No aparecen pedidos

**Causa posible:**
```typescript
const esDelServicio = p.servicio === user?.especialidad;
// Si esto es false, no se muestra
```

**Debugging:**
```javascript
console.log('servicio:', p.servicio);
console.log('especialidad:', user?.especialidad);
console.log('coincide:', p.servicio === user?.especialidad);
```

### Problema 2: user?.especialidad es undefined

**Causa posible:**
```typescript
// AuthUser no tiene la propiedad especialidad
// O el usuario fue creado sin especialidad
```

**Solución:**
1. Verificar que agregaste `especialidad?: string;` en `AuthContext.tsx`
2. Verificar que el usuario de prueba tiene especialidad en `initialData.ts`

### Problema 3: No se actualiza después de crear pedido

**Causa posible:**
```typescript
// El contexto no se actualizó
// O el archivo JSON de storage no se guardó
```

**Solución:**
1. Limpiar localStorage: `localStorage.clear()`
2. Recargar página
3. Verificar que el pedido se crea en Admin primero

---

## 📊 Paso 9: Monitoreo

### Logs Útiles para Debugging

```typescript
// En ListaPedidosOperario.tsx

console.log('=== ListaPedidosOperario Debug ===');
console.log('Usuario actual:', user);
console.log('Especialidad del operario:', user?.especialidad);
console.log('Total pedidos en contexto:', pedidos?.length);
console.log('Pedidos del operario (filtrados):', pedidosDelOperario);
console.log('Pedidos formateados:', pedidosFormateados);
console.log('====================================');
```

---

## 🎯 Paso 10: Validación Final

### Criterios de Éxito

- [ ] TypeScript compila sin errores
- [ ] El operario ve sus pedidos reales
- [ ] El operario NO ve pedidos de otro servicio
- [ ] Puede marcar cajas como completas
- [ ] El progreso se calcula correctamente
- [ ] Al completar todas las cajas, muestra "Completado"
- [ ] La información del cliente es correcta
- [ ] El nombre del producto es visible

### Estructura Final

```
ListaPedidosOperario (✅ Conectado a contexto)
    ├── useAuth() → { user: { especialidad } }
    ├── usePedidosData() → { pedidos }
    ├── useProductosData() → { productosFinales }
    ├── Filtra: servicio === especialidad
    ├── Filtra: estado activo
    ├── Mapea a estructura compatible
    └── Renderiza PedidoOperario (✅ UI mejorada)
```

---

## 📚 Documentación Relacionada

- `TESTING_PEDIDOS_OPERARIO.md` - Cómo probar la solución
- `ANALISIS_PROBLEMA_PEDIDOS_OPERARIO.md` - Análisis detallado
- `FIX_PEDIDOS_OPERARIO_RESUMEN.md` - Resumen ejecutivo

---

## 🎓 Conceptos Aprendidos

1. **Estado Global**: Usar contextos para compartir datos
2. **Hooks**: `useAuth`, `usePedidosData`, `useProductosData`
3. **Filtrado**: En cliente (React) mientras sea demo
4. **Mapeo de datos**: Transformar estructura del servidor a UI
5. **Tipos TypeScript**: Mantener sincronizados
6. **Actualización en tiempo real**: El contexto notifica cambios

---

## ✨ Conclusión

Este fix demuestra cómo:
- ✅ Conectar componentes al contexto central
- ✅ Implementar filtrado por rol/especialidad
- ✅ Mejorar significativamente la UX
- ✅ Preparar el código para migración a backend

La arquitectura ahora está lista para migrar a Spring Boot cuando llegue el momento.

