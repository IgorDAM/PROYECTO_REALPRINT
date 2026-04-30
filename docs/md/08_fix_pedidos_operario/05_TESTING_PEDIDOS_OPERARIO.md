# 🧪 Testing: Verificar que Operario Recibe Pedidos

## ✅ Checklist de Prueba

### 1️⃣ Preparación

- [ ] Aplicación corriendo en `npm run dev`
- [ ] LocalStorage limpio o verificado

### 2️⃣ Crear Pedido como Cliente

**Paso 1: Login Cliente**
- Usuario: `cliente`
- Contraseña: `cliente123`

**Paso 2: Ir a "Nuevo Pedido"**

**Paso 3: Crear pedido de SERIGRAFÍA**
```
- Servicio: Serigrafía
- Producto: CAMISETA 1ª EQUIPACIÓN 128 (niño)
- Cantidad: 3 cajas
- Fecha Entrega: (cualquier fecha futura)
- Descripción: "Prueba - 3 cajas"
- Click: "Agregar al Carrito"
- Click: "Enviar Carrito"
```

**Resultado esperado:**
- ✅ Pedido guardado
- ✅ Se crea 1 tarea por caja (3 tareas)
- ✅ Se asignan al operario de serigrafía

---

### 3️⃣ Verificar Pedido en Admin

**Paso 1: Login Admin**
- Usuario: `admin`
- Contraseña: `admin123`

**Paso 2: Ir a "Pedidos"**

**Paso 3: Verificar**
- [ ] Aparece el nuevo pedido
- [ ] Estado: "Pendiente"
- [ ] Servicio: "Serigrafía"
- [ ] Cliente: "Cliente Demo"
- [ ] 3 cajas (o 3 pedidos si se crearon separados)

---

### 4️⃣ Verificar Pedido en Dashboard Operario

**Paso 1: Logout y Login como Operario Serigrafía**
- Usuario: `operario_demo_serigrafia`
- Contraseña: `operario123`

**Paso 2: Ir a "Pedidos"**

**Resultado esperado: ✅ VER PEDIDOS REALES**

```
[ ] Pedido #XXXXX - Cliente Demo
    [BADGE: Pendiente]
    Cliente: Cliente Demo
    Producto: CAMISETA 1ª EQUIPACIÓN 128 (niño)
    Entrega: 2025-03-30
    
    Total: 50 unidades (3 cajas de 50)
    [============================] 0%
    
    [Caja 1] [Caja 2] [Caja 3]
```

---

### 5️⃣ Probar Interacción: Marcar Cajas

**Paso 1: Click en "Caja 1"**
- [ ] Caja 1 se marca con ✓ (color verde)
- [ ] Progreso: 33%
- [ ] Las demás cajas se mantienen disponibles

**Paso 2: Click en "Caja 2"**
- [ ] Caja 2 se marca con ✓ (color verde)
- [ ] Progreso: 66%

**Paso 3: Click en "Caja 3"**
- [ ] Caja 3 se marca con ✓ (color verde)
- [ ] Progreso: 100%
- [ ] Aparece: "✓ Pedido completado"

---

### 6️⃣ Probar Filtrado por Especialidad

**Paso 1: Login como Operario Rotulación**
- Usuario: `operario_demo_rotulacion`
- Contraseña: `operario123`

**Paso 2: Ir a "Pedidos"**

**Resultado esperado:**
- ✅ NO aparece el pedido de serigrafía creado
- ✅ Mensaje: "No hay pedidos asignados en este momento"

**Paso 3: Login como Operario Serigrafía nuevamente**

**Resultado esperado:**
- ✅ El pedido de serigrafía aparece nuevamente

---

## ❌ Problemas Comunes

### Problema 1: No aparecen pedidos en Operario

**Causas posibles:**
1. El pedido no se creó correctamente
2. El operario no tiene especialidad establecida
3. El servicio del pedido no coincide con especialidad

**Solución:**
- Verificar en Admin que el pedido existe
- Verificar que `operarioId` y `especialidad` coinciden
- Limpiar localStorage

### Problema 2: Operario ve pedidos de otro servicio

**Causa:** Lógica de filtrado no está funcionando

**Solución:**
- Verificar que `user?.especialidad` se obtiene correctamente
- Revisar que `pedido.servicio` tiene el formato correcto

---

## 📊 Datos de Prueba

### Usuarios:

```javascript
{
  username: "cliente",
  password: "cliente123",
  role: "cliente",
  name: "Cliente Demo"
}

{
  username: "operario_demo_serigrafia",
  password: "operario123",
  role: "operario",
  especialidad: "serigrafia",
  name: "Operario Demo Serigrafía"
}

{
  username: "operario_demo_rotulacion",
  password: "operario123",
  role: "operario",
  especialidad: "rotulacion",
  name: "Operario Demo Rotulación"
}
```

### Servicios:
- `serigrafia` → Operario de serigrafía
- `rotulacion` → Operario de rotulación

---

## 🔍 Debugging

### Verificar en Console:

```javascript
// Abrir DevTools > Console

// 1. Ver contexto global
window.realprint  // Si existe, ver datos

// 2. Ver localStorage
console.log(JSON.parse(localStorage.getItem('realprint_pedidos')))
console.log(JSON.parse(localStorage.getItem('realprint_usuarios')))

// 3. Ver usuario actual
// Verificar que tiene especialidad:
// user?.especialidad === "serigrafia"
```

---

## ✅ Criterios de Éxito

- [x] Admin ve todos los pedidos
- [x] Operario serigrafía ve SOLO pedidos de serigrafía
- [x] Operario rotulación ve SOLO pedidos de rotulación
- [x] Los pedidos muestran información real del cliente
- [x] Se puede marcar cajas como completadas
- [x] El progreso se actualiza correctamente
- [x] Cuando todas las cajas están completas, muestra "Pedido completado"

---

## 📝 Notas

- Los pedidos se guardan en localStorage (temporal)
- Cuando pase a Spring Boot + MySQL, será persistente
- Las tareas también se crean y se pueden ver en OperarioDashboard
- El filtrado es en cliente (React) - cuando migremos a servidor se hará en backend

