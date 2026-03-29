# 🔍 DEBUG: Problemas con Pedidos de Cliente

## 📋 Problema Reportado

```
- Operario NO recibe pedidos de "cliente" (Cliente Demo)
- Operario SÍ recibe pedidos de "clienteDemo2"
- Admin NO recibe pedidos de ninguno de los 2
```

## 🔧 Solución: Verificar Console Logs

He agregado console.logs detallados para debuggear. Ahora necesitas:

### 1. Abre el navegador y presiona F12 (DevTools)

### 2. Ve a la pestaña "Console"

### 3. Ejecuta estos pasos:

**Paso A: Login como Cliente Demo**
```
- Usuario: cliente
- Contraseña: cliente123
- Click en "Nuevo Pedido"
- Crear un pedido de serigrafía
- Click "Enviar Carrito"
```

**Paso B: Revisa la Console en DevTools**
```
- Verás logs como:
  ==========DEBUG PEDIDO CREADO==========
  - Verifica: cliente: "Cliente Demo"
  - Verifica: servicio: "serigrafia"
  - Verifica: id del pedido
```

**Paso C: Login como Operario de Serigrafía**
```
- Usuario: operario_demo_serigrafia
- Contraseña: operario123
- Ve a "Pedidos"
- Revisa Console DevTools
```

**Paso D: Busca estos logs:**
```
=== DEBUG ListaPedidosOperario ===
Usuario: { id, name, role, especialidad }
Especialidad del usuario: "serigrafia"
Total de pedidos en contexto: X
Todos los pedidos: [...]
Servicios de pedidos: [...]
```

### 4. Captura de pantalla o copia el output de:

```
Usuarios: "cliente" vs "clienteDemo2"
├─ ¿Tienen nombre diferente?
├─ ¿ID diferente?
└─ ¿Especialidad del operario es correcta?

Pedidos:
├─ ¿Aparecen en el array?
├─ ¿Qué servicio tienen?
├─ ¿Qué cliente tienen?
└─ ¿Qué estado tienen?
```

---

## 📊 Información que Necesito

Cuando abras la consola, pégame:

1. **Logs cuando el operario accede a sus pedidos:**
```
=== DEBUG ListaPedidosOperario ===
[Copia completa]
```

2. **Logs cuando el admin accede a pedidos:**
```
=== DEBUG AdminPedidos ===
[Copia completa]
```

3. **Información del usuario que logueas:**
```
nombre: ?
username: ?
especialidad: ?
```

---

## ✅ Con esa información puedo:

- ✅ Ver exactamente qué pedidos existen
- ✅ Ver si el nombre del cliente es correcto
- ✅ Ver si la especialidad del operario es correcta
- ✅ Ver si el servicio del pedido coincide
- ✅ Identificar y arreglar el problema

---

## 📝 Pasos Resumidos

1. **F12** → Console
2. **Login cliente** → Crear pedido
3. **Copiar logs** de Console
4. **Login operario** → Ver Pedidos
5. **Copiar logs** de Console
6. **Enviarme los logs**

Eso me dirá exactamente dónde está el problema.

