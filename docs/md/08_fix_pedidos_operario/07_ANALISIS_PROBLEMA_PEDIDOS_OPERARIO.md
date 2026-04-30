# Análisis y Solución: Pedidos no recibidos por Operario

## 📋 Problema Identificado

**Síntoma:** El dashboard de operario de serigrafía no recibe los pedidos generados por el cliente. En su lugar, muestra datos hardcodeados:
```
Pedido #1 - Cliente X
Total: 200 camisetas (4 cajas de 50)
Caja 1 Caja 2 Caja 3 Caja 4

Pedido #2 - Cliente Y
Total: 120 camisetas (3 cajas de 50)
Caja 1 Caja 2 Caja 3
```

**Causa Raíz:** El componente `ListaPedidosOperario.tsx` estaba utilizando datos estáticos locales en lugar de:
1. Obtener los pedidos reales del contexto de datos (DataContext)
2. Filtrar pedidos según la especialidad del operario
3. Mostrar solo pedidos activos

---

## 🏗️ Arquitectura Actual (Correcta para Admin)

### Flujo de creación de pedidos:

```
Cliente crea pedido
    ↓
ClienteNuevoPedido → createPedidoSafe()
    ↓
DataContext.pedidos (array actualizado)
    ↓
Se llama a addTareaPorPedido()
    ↓
Se crea TAREA asignada al operario según especialidad
    ↓
tareasDomain.ts: Busca operario con especialidad = pedido.servicio
```

### Admin ve todos los pedidos:
```
AdminPedidos.tsx
    ↓
usePedidosData() → obtiene pedidos[]
    ↓
Muestra TODOS los pedidos sin filtrar
```

---

## ❌ Problema: Operario no filtrava pedidos

**Archivo afectado:** `ListaPedidosOperario.tsx`

**Código problemático:**
```typescript
const pedidosIniciales: PedidoOperarioItem[] = [
  {
    id: 1,
    cliente: "Cliente X",
    totalUnidades: 200,
    // ... datos HARDCODEADOS
  },
  // ...
];

const [pedidos, setPedidos] = useState(pedidosIniciales);
```

**Problema:**
- ❌ Datos locales, no conectados al contexto global
- ❌ No se actualizan cuando el cliente crea un pedido
- ❌ No se filtran por especialidad del operario
- ❌ Admin recibe los pedidos, pero operario no

---

## ✅ Solución Implementada

### 1. Refactorización de `ListaPedidosOperario.tsx`

**Cambios:**

#### Antes:
```typescript
import React, { useState } from "react";
// Datos hardcodeados
const pedidosIniciales = [{ id: 1, cliente: "Cliente X", ... }];
function ListaPedidosOperario() {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
```

#### Después:
```typescript
import { useAuth } from "../context/AuthContext";
import { usePedidosData } from "../hooks/usePedidosData";
import { useProductosData } from "../hooks/useProductosData";

function ListaPedidosOperario() {
  const { user } = useAuth();  // ← Obtener especialidad del operario
  const { pedidos, updatePedido } = usePedidosData();  // ← Datos reales
  const { productosFinales } = useProductosData();

  // Filtrar pedidos del operario actual
  const pedidosDelOperario = (pedidos || []).filter((p: any) => {
    const esDelServicio = p.servicio === user?.especialidad;
    const esActivo = p.estado === "pendiente" || p.estado === "en_proceso";
    return esDelServicio && esActivo;
  });
```

### 2. Mejora de `PedidoOperario.tsx`

**Mejoras visuales:**
- ✅ Mejor diseño con Tailwind CSS
- ✅ Barra de progreso visual
- ✅ Información del producto
- ✅ Estados con colores
- ✅ Fecha de entrega visible
- ✅ Mensaje de completado

---

## 🔄 Nuevo Flujo Funcional

```
Cliente crea pedido con servicio="serigrafia"
    ↓
Pedido se guarda en DataContext.pedidos
    ↓
Se crea tarea asignada a operario_serigrafia
    ↓
Operario ve dashboard
    ↓
OperarioPedidos.tsx → ListaPedidosOperario
    ↓
Filtra: pedido.servicio === "serigrafia" ✓
Filtra: estado es "pendiente" o "en_proceso" ✓
    ↓
Muestra SOLO pedidos de serigrafía activos
    ↓
Operario puede marcar cajas como completadas
```

---

## 🎯 Estructura de Datos

### Pedido (en DataContext):
```javascript
{
  id: "1709042400000_0",
  servicio: "serigrafia",           // ← Clave para filtrar
  subservicio: "serigrafia+planchado",
  productoFinalId: 1769000000000,
  cliente: "Cliente Demo",
  pedido: "Caja 1 de 4 - CAMISETA 1ª...",
  cantidad: 1,
  cantidadUnidades: 50,             // ← Unidades por caja
  tamanoCaja: 50,
  boxIndex: 1,
  boxTotal: 4,                      // ← Total de cajas
  estado: "pendiente",              // ← "pendiente", "en_proceso", "completado"
  fechaEntrega: "2025-03-30",
  total: 550,
  clienteId: 2,
  descripcion: "...",
}
```

### Usuario (Operario):
```javascript
{
  id: 3,
  username: "operario_demo_serigrafia",
  nombre: "Operario Demo Serigrafía",
  role: "operario",
  especialidad: "serigrafia",  // ← Se compara con pedido.servicio
  activo: true,
}
```

---

## 🧪 Prueba del Fix

### Pasos para verificar:

1. **Login como operario_demo_serigrafia:**
   - Usuario: `operario_demo_serigrafia`
   - Contraseña: `operario123`

2. **Ir a Cliente → Nuevo Pedido:**
   - Seleccionar servicio: "Serigrafía"
   - Seleccionar producto: Cualquier camiseta
   - Cantidad: 2 (para que genere 2 cajas)
   - Crear pedido

3. **Ir a Operario → Pedidos:**
   - ✅ Debe aparecer el nuevo pedido creado
   - ✅ Con información real del cliente
   - ✅ Con nombre del producto
   - ✅ Con 2 cajas (no 4 como antes)
   - ✅ Estado: "Pendiente"

4. **Marcar cajas como completadas:**
   - Click en Caja 1 → Se marca ✓
   - Click en Caja 2 → Se marca ✓
   - Cuando todas están completas → se muestra "Pedido completado"

---

## 📊 Comparativa: Admin vs Operario

| Feature | Admin | Operario |
|---------|-------|----------|
| Ve todos pedidos | ✅ Sí | ❌ No |
| Filtra por especialidad | ❌ No | ✅ Sí (serigrafia/rotulacion) |
| Ve pedidos completados | ✅ Sí | ❌ No (solo activos) |
| Puede cancelar | ✅ Sí | ❌ No |
| Fuente de datos | DataContext.pedidos | DataContext.pedidos (filtrado) |

---

## 🔧 Archivos Modificados

### 1. `ListaPedidosOperario.tsx`
- ✅ Conecta con hooks de contexto
- ✅ Filtra por especialidad del operario
- ✅ Obtiene datos reales del contexto
- ✅ Mapea a estructura del componente

### 2. `PedidoOperario.tsx`
- ✅ Mejor UI con Tailwind
- ✅ Muestra información real del pedido
- ✅ Barra de progreso
- ✅ Estados visuales

---

## ⚠️ Notas Importantes

### Por qué el Admin veía los pedidos pero el Operario no:

1. **Admin** usa `usePedidosData()` → obtiene array completo de pedidos
2. **Operario** estaba usando array local hardcodeado → nunca se actualizaba
3. **Las tareas** se creaban correctamente (OperarioDashboard las mostraba)
4. **Los pedidos** nunca llegaban a OperarioPedidos

### Diferencia entre Pedidos y Tareas:

- **Pedido**: Documento que crea el cliente (qué se hace)
- **Tarea**: Asignación de trabajo al operario (quién lo hace)

OperarioDashboard mostraba tareas ✅
OperarioPedidos mostraba datos hardcodeados ❌

---

## 🚀 Próximos Pasos (Opcional)

1. Sincronizar con base de datos MySQL cuando migre a Spring Boot
2. Agregar filtros adicionales (por fecha, por cliente, etc.)
3. Mejorar UX: permitir agregar notas por caja
4. Integrar con sistema de entregas

---

## 📝 Resumen

**Problema:** Operario no veía pedidos reales, solo datos hardcodeados.

**Causa:** `ListaPedidosOperario.tsx` no estaba conectado al contexto.

**Solución:** 
1. Conectar con hooks de contexto (`usePedidosData`, `useAuth`)
2. Filtrar por especialidad del operario
3. Mejorar visualización con componente actualizado

**Resultado:** Operario ahora ve sus pedidos reales filtrados por especialidad.

