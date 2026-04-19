# Guía de Pruebas - Formulario de Creación de Pedidos Estandarizado

## 🎯 Objetivo
Verificar que todos los 5 pasos del formulario funcionan correctamente y tienen una apariencia visual consistente.

---

## 📋 Checklist de Pruebas Visuales

### Paso 1: Tipo de Pedido
- [ ] El encabezado es "¿Qué tipo de pedido deseas?"
- [ ] Hay descripción debajo del encabezado
- [ ] Dos opciones con radio buttons:
  - [ ] Solo Serigrafía
  - [ ] Serigrafía + Planchado
- [ ] Al seleccionar una opción, se resalta con anillo naranja
- [ ] Botón "Siguiente" está habilitado solo al seleccionar una opción
- [ ] Espaciado visual consistente

### Paso 2a: Detalles - Serigrafía Simple
- [ ] El encabezado es "Detalles del Pedido"
- [ ] Hay descripción debajo del encabezado
- [ ] Campos de formulario:
  - [ ] Archivo de Diseño (input file)
  - [ ] Cantidad de unidades (input number)
  - [ ] Medida de impresión (input number)
- [ ] Botones "Atrás" y "Siguiente" están presentes
- [ ] Botones ocupan 50% ancho cada uno
- [ ] Hay línea separadora (border-top) antes de los botones
- [ ] Espaciado visual consistente

### Paso 2b: Opción de Suministro - Serigrafía + Planchado
- [ ] El encabezado es "Opción de Suministro"
- [ ] Hay descripción debajo del encabezado
- [ ] Dos opciones con radio buttons:
  - [ ] Yo proporciono la prenda
  - [ ] RealPrint proporciona la prenda
- [ ] Al seleccionar una opción, se resalta con anillo naranja
- [ ] Botones "Atrás" y "Siguiente" están presentes
- [ ] Botones ocupan 50% ancho cada uno
- [ ] Hay línea separadora (border-top) antes de los botones
- [ ] Espaciado visual consistente

### Paso 3: Detalles - Prenda Propia
- [ ] El encabezado es "Detalles - Prenda Propia"
- [ ] Hay descripción debajo del encabezado
- [ ] Campos de formulario:
  - [ ] Archivo de Diseño (input file)
  - [ ] Cantidad de unidades (input number)
  - [ ] Medida de impresión (input number)
  - [ ] Tipo de prenda (select dropdown)
- [ ] Resumen de precios se muestra
- [ ] Botones "Atrás" y "Siguiente" están presentes
- [ ] Botones ocupan 50% ancho cada uno
- [ ] Hay línea separadora (border-top) antes de los botones
- [ ] Espaciado visual consistente

### Paso 4: Detalles - Prenda RealPrint
- [ ] El encabezado es "Detalles - Prenda de RealPrint"
- [ ] Hay descripción debajo del encabezado
- [ ] Campos de formulario:
  - [ ] Selecciona prenda (select dropdown)
  - [ ] Talla (select dropdown, aparece tras seleccionar prenda)
  - [ ] Cantidad de unidades (input number)
- [ ] Tarjeta de información de prenda seleccionada se muestra
- [ ] Resumen de precios se muestra
- [ ] Botones "Atrás" y "Siguiente" están presentes
- [ ] Botones ocupan 50% ancho cada uno
- [ ] Hay línea separadora (border-top) antes de los botones
- [ ] Espaciado visual consistente

### Paso 5: Revisión y Confirmación
- [ ] El encabezado es "Revisión y Confirmación"
- [ ] Hay descripción debajo del encabezado
- [ ] Se muestra:
  - [ ] Resumen de Items
  - [ ] Resumen de Precios (Subtotal, IVA, Total)
  - [ ] Checkboxes de términos:
    - [ ] Confirmo que los datos son correctos
    - [ ] Acepto los términos de servicio y política de privacidad
- [ ] Botones "Atrás" y "Confirmar Pedido" están presentes
- [ ] Botones ocupan 50% ancho cada uno
- [ ] Hay línea separadora (border-top) antes de los botones
- [ ] Botón "Confirmar" está deshabilitado hasta aceptar términos
- [ ] Espaciado visual consistente

---

## 🔄 Checklist de Flujos de Navegación

### Flujo 1: Serigrafía Simple
```
1. Step 1: Seleccionar "Solo Serigrafía" → Click "Siguiente"
2. Step 2a: Completar datos → Click "Siguiente"
3. Step 5: Revisar → Click "Confirmar Pedido"
```

**Verificar:**
- [ ] Flujo completo funciona sin errores
- [ ] Datos se mantienen al navegar
- [ ] Botón "Atrás" vuelve al paso anterior
- [ ] Progreso visual (números en círculos) avanza correctamente

### Flujo 2: Serigrafía + Planchado + Prenda Propia
```
1. Step 1: Seleccionar "Serigrafía + Planchado" → Click "Siguiente"
2. Step 2b: Seleccionar "Yo proporciono la prenda" → Click "Siguiente"
3. Step 3: Completar datos → Click "Siguiente"
4. Step 5: Revisar → Click "Confirmar Pedido"
```

**Verificar:**
- [ ] Flujo completo funciona sin errores
- [ ] Datos se mantienen al navegar
- [ ] Botón "Atrás" vuelve al paso anterior
- [ ] Progreso visual avanza correctamente

### Flujo 3: Serigrafía + Planchado + Prenda RealPrint
```
1. Step 1: Seleccionar "Serigrafía + Planchado" → Click "Siguiente"
2. Step 2b: Seleccionar "RealPrint proporciona la prenda" → Click "Siguiente"
3. Step 4: Seleccionar prenda y talla → Click "Siguiente"
4. Step 5: Revisar → Click "Confirmar Pedido"
```

**Verificar:**
- [ ] Flujo completo funciona sin errores
- [ ] Datos se mantienen al navegar
- [ ] Botón "Atrás" vuelve al paso anterior
- [ ] Información de prenda se muestra correctamente
- [ ] Progreso visual avanza correctamente

---

## ⚙️ Checklist de Funcionalidad

### Validación de Campos

#### Step 1
- [ ] No se puede avanzar sin seleccionar tipo de pedido
- [ ] Error visual en botón "Siguiente" (deshabilitado)

#### Step 2a (Serigrafía Simple)
- [ ] Archivo es obligatorio
- [ ] Cantidad es obligatoria y > 0
- [ ] Medida es obligatoria y > 0
- [ ] Se muestra error en cada campo si falta

#### Step 2b (Opción Suministro)
- [ ] No se puede avanzar sin seleccionar opción
- [ ] Error visual en botón "Siguiente" (deshabilitado)

#### Step 3 (Prenda Propia)
- [ ] Archivo es obligatorio
- [ ] Cantidad es obligatoria y > 0
- [ ] Medida es obligatoria y > 0
- [ ] Tipo de prenda es obligatorio
- [ ] Se muestra error en cada campo si falta

#### Step 4 (Prenda RealPrint)
- [ ] Prenda es obligatoria
- [ ] Cantidad es obligatoria y > 0
- [ ] Talla aparece tras seleccionar prenda
- [ ] Se muestra error en cada campo si falta

#### Step 5 (Revisión)
- [ ] No se puede confirmar sin aceptar datos correctos
- [ ] No se puede confirmar sin aceptar términos
- [ ] Botón "Confirmar" está deshabilitado hasta cumplir condiciones

---

## 🎨 Checklist de Consistencia Visual

### Encabezados
- [ ] Todos tienen `text-2xl font-bold mb-2`
- [ ] Todos tienen descripción debajo en gris
- [ ] Descripción es coherente y clara

### Espaciado
- [ ] Todos los pasos usan `space-y-6`
- [ ] Todos los botones tienen `pt-4 border-t`
- [ ] Todos los botones son `flex-1` (ocupan espacio igual)

### Botones
- [ ] Todos los "Atrás" son `variant="secondary"`
- [ ] Todos los "Siguiente"/"Confirmar" son primarios (naranja)
- [ ] Todos los botones tienen el mismo tamaño horizontal

### Colores
- [ ] Naranja para elementos activos/seleccionados: `ring-orange-500 bg-orange-50`
- [ ] Consistencia en grises para deshabilitados
- [ ] Consistencia en rojos para errores

---

## 📊 Checklist de Responsividad

### Móvil (< 768px)
- [ ] Grid de formularios se apila en una columna
- [ ] Botones se distribuyen verticalmente (si es necesario)
- [ ] Texto es legible sin zoom
- [ ] Inputs son tocables (tamaño suficiente)

### Tablet (768px - 1024px)
- [ ] Layout es parcialmente adaptado
- [ ] Múltiples columnas funcionan correctamente
- [ ] Espaciado es proporcional

### Desktop (> 1024px)
- [ ] Layout de dos columnas se muestra correctamente
- [ ] Espaciado es óptimo
- [ ] Todos los elementos están visible sin scroll horizontal

---

## 🧪 Checklist de Errores

- [ ] No hay errores de compilación
- [ ] No hay warnings en la consola (excepto avisos esperados)
- [ ] No hay errores de TypeScript
- [ ] No hay errores de validación
- [ ] La aplicación no crashea en ningún paso

---

## ✅ Resultado Final

**Fecha de Pruebas:** _______________

**Tester:** _______________

**Estado General:**
- [ ] ✅ Todas las pruebas pasadas
- [ ] ⚠️ Algunas pruebas fallaron (detallar abajo)
- [ ] ❌ Problemas críticos (detallar abajo)

**Observaciones:**

_________________________________________________________________

_________________________________________________________________

**Firma:** _______________


