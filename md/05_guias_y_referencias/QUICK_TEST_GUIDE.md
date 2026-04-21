# 🧪 TESTING RÁPIDO - Frontend RealPrint

## ⚡ Quick Start (2 minutos)

```bash
# 1. Terminal 1 - Iniciar servidor de desarrollo
cd D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\App-RealPrint
npm run dev

# 2. Terminal 2 - Abrir navegador
# http://localhost:5173/cliente/crear-pedido
```

---

## ✅ Test 1: Formulario Multi-Paso (5 minutos)

### Paso 1: Seleccionar Tipo
```
☐ Click en "Solo Serigrafía"
☐ Botón "Siguiente" habilitado
☐ Click en "Siguiente"
```

### Paso 2: Detalles
```
☐ Ver campos: Archivo, Cantidad, Medida
☐ Llenar: cantidad=10, medida=15cm
☐ Ver desglose de precios
☐ Click "Siguiente"
```

### Paso 4: Revisión
```
☐ Ver resumen de item
☐ Ver total con IVA
☐ Aceptar términos (checkbox)
☐ Click "Confirmar Pedido"
☐ Ver toast: "¡Pedido creado exitosamente!"
```

**Tiempo esperado:** 2 minutos  
**Resultado:** PASS si no hay errores

---

## ✅ Test 2: Gestión de Ubicaciones (3 minutos)

### Abrir Admin
```
# URL: http://localhost:5173/admin/ubicaciones
```

### Crear Ubicación
```
☐ Click "+ Crear nueva ubicación"
☐ Modal se abre
☐ Llenar:
   - Nombre: "Cuello"
   - Categoría: "Superior"
   - Precio: "5.00"
☐ Click "Guardar"
☐ Ver toast: "Ubicación creada correctamente"
☐ Verla en la tabla
```

### Editar
```
☐ Click "Editar" en cualquier fila
☐ Modal se abre con datos
☐ Cambiar precio a "7.50"
☐ Click "Guardar"
☐ Ver precio actualizado
```

### Filtrar
```
☐ Selector "Categoría": elegir "Superior"
☐ Ver solo ubicaciones superiores
```

**Tiempo esperado:** 3 minutos  
**Resultado:** PASS si la tabla se actualiza

---

## ✅ Test 3: Validación de Campos (2 minutos)

### Abrir Formulario
```
http://localhost:5173/cliente/crear-pedido
```

### Intentar enviar vacío
```
☐ Click "Siguiente" en Step 1 sin seleccionar
☐ Ver mensaje de error (no hace nada si vacío)
```

### Llenar parcialmente Step 2
```
☐ Seleccionar SCREENPRINTING_PRESSING
☐ Hacer click "Siguiente"
☐ Ver Step 3a (Con prenda propia)
☐ Dejar campos vacíos
☐ Click "Siguiente"
☐ Ver mensajes de error en campos requeridos
```

**Tiempo esperado:** 2 minutos  
**Resultado:** PASS si validaciones funcionan

---

## 🔍 Checklist de Errores Comunes

### Si ves error: "Cannot find module"
```
Solución:
npm install zod react-toastify
npm run dev
```

### Si la ruta no existe
```
Verificar en App.tsx:
✓ <Route path="crear-pedido" element={<CreateOrderForm />} />
```

### Si no ve estilos Tailwind
```
Verificar package.json tiene tailwindcss
npm install
npm run dev
```

### Si toast notifications no aparecen
```
Verificar que ToastContainer esté en main layout
(ya debe estar en DashboardLayout o App)
```

---

## 📊 Resultados Esperados

### Terminal
```
✓ Sin errores de TypeScript
✓ npm run dev inicia sin warnings
✓ npm run lint retorna OK
✓ npm run typecheck sin errores
```

### Navegador
```
✓ Página carga sin errores en consola
✓ Estilos Tailwind aplicados
✓ Formulario multi-paso funciona
✓ Botones responden a clicks
✓ Toast notifications aparecen
✓ Validaciones funcionan
```

---

## 🎯 Next Steps Después de Testing

### Si TODO FUNCIONA (Expected)
```
✅ Código listo para backend
✅ Proceder con Prompts 1-2 (Backend)
✅ Conectar endpoints reales
✅ Testing E2E
```

### Si hay errores
```
1. Revisar error exacto en console
2. Verificar que npm run typecheck pase
3. Reportar en GitHub issues
```

---

## 📱 Responsive Testing (Bonus)

```
☐ F12 → Toggle Device Toolbar
☐ Probar en Mobile (375px)
☐ Probar en Tablet (768px)
☐ Probar en Desktop (1440px)
☐ Verificar que se adapta bien
```

---

## 🎬 Video Tutorial (Si algo no funciona)

**Pasos exactos:**
1. Abrir PowerShell en `App-RealPrint`
2. `npm run dev`
3. Esperar hasta ver "Local: http://localhost:5173"
4. Abrir navegador
5. Ir a `/cliente/crear-pedido`
6. Llenar formulario y hacer click en siguiente
7. Debería ver 5 pasos con progreso

---

## ✨ Pro Tips

### Limpiar cache
```bash
npm run dev
# Si ves código viejo:
CTRL+Shift+R (Force refresh)
```

### Debug en navegador
```
F12 → Console
Ver logs de componentes
Inspeccionar estado React
```

### Simular respuesta backend
```
En orderService.ts cambiar:
// return res.json();  ← comentar
return { id: 'mock-123', status: 'created' }; ← agregar
```

---

**Tiempo total de testing:** 10 minutos  
**Resultado esperado:** ✅ PASS sin errores

¡Listo para testear! 🚀


