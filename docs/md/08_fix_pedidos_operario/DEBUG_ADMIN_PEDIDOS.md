# 🔍 DEBUG: Por qué Admin no ve pedidos

He agregado logs más agresivos. Necesito que hagas lo siguiente:

## 📋 Pasos para Debuggear

### 1. Abre DevTools (F12) y ve a Console

### 2. Ejecuta estos pasos EN ORDEN:

**PASO A: Limpia todo**
```javascript
// En la consola, copia y pega:
localStorage.clear();
location.reload();
```

**PASO B: Login como Cliente y crea un pedido**
```
- Usuario: cliente
- Contraseña: cliente123
- Nuevo Pedido
- Servicio: Serigrafía
- Crear pedido
- Enviar Carrito
```

**PASO C: Verifica console**
```
- Debería aparecer debug log de pedido creado
- Copia TODO lo que veas en console (Ctrl+A, Ctrl+C)
```

**PASO D: Login como Admin (sin recargar)**
```
- Click Cerrar Sesión
- Usuario: admin
- Contraseña: admin123
- Click en "Pedidos"
```

**PASO E: Verifica console nuevamente**
```
- Verás logs como:
  ==================================================
  ADMIN PEDIDOS - DATOS RECIBIDOS
  ==================================================
  typeof pedidos: ___
  Array.isArray(pedidos): ___
  pedidos.length: ___
  pedidos: [...]
  localStorage realprint_pedidos: [...]
  ==================================================
```

### 3. Copia y envía TODO lo de console

Especialmente:
- `typeof pedidos:`
- `Array.isArray(pedidos):`
- `pedidos.length:`
- El array completo de `pedidos:`
- El contenido de `localStorage realprint_pedidos:`

---

## ✅ Con esa información podré:

1. Ver si los pedidos llegan al contexto del admin
2. Ver si localStorage está compartido
3. Ver si hay un problema de sincronización
4. Identificar exactamente dónde falla

---

## ⚠️ Importante

- **NO** cierres pestaña
- **NO** recargues (salvo que te lo diga)
- **NO** abras nuevas ventanas
- Solo copia los logs de console

