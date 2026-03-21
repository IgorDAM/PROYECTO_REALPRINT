# Validación Visual - Sidebar Responsive & Color Consistency

Fecha: 2026-03-21
Propósito: Checklist de QA visual para confirmar responsividad y consistencia de color azul del sidebar en admin/cliente/operario.

---

## Resumen Ejecutivo

- ✅ **Hardening implementado:** Tokens centralizados en `tailwind.config.js` + variables CSS en `index.css`.
- ✅ **Compilación:** Build exitoso sin errores.
- ✅ **Componentes sincronizados:** Todos los dashboards usan mismo `Sidebar.jsx` y `glass-sidebar`.
- 🔍 **Validación visual pendiente:** Requiere navegación manual en navegador.

---

## Checklist de Responsividad

### Desktop (≥ 1024px)

- [ ] `/admin` - Sidebar visible a la izquierda (w-72), contenido fluye a la derecha
- [ ] `/admin` - No hay overlay oscuro
- [ ] `/admin` - Tabla scrollable horizontalmente sin romper layout
- [ ] `/cliente` - Idem admin
- [ ] `/operario` - Idem admin
- [ ] Menu items (NavLink) activos con fondo blanco y texto primary-700
- [ ] Logo RP visible en header sidebar con gradiente gold
- [ ] Scroll interno en nav sin afectar layout principal

### Tablet (768px - 1024px)

- [ ] `/admin` - Sidebar aún visible (no oculto)
- [ ] `/admin` - Padding/spacing mantenido
- [ ] `/cliente` - Idem
- [ ] `/operario` - Idem
- [ ] Tabla con horizontal scroll visible en móvil
- [ ] StatCards: grid-cols-2 en lugar de grid-cols-3

### Móvil (< 768px)

- [ ] Sidebar **oculto** por defecto (translate-x-full lg:translate-x-0)
- [ ] Botón menú (hamburguesa) visible en header
- [ ] Al tocar menú: sidebar se desliza desde izquierda con animación
- [ ] Overlay oscuro (bg-black/50) cubre contenido detrás
- [ ] Al cerrar sidebar: se retrae y overlay desaparece
- [ ] NavLinks cierran sidebar al hacer click
- [ ] Tabla sigue siendo scrollable sin romper móvil

### Responsive Breakpoints (Validar visualmente)

| Ancho | Dispositivo Típico | Estado Sidebar | Header móvil |
|-------|-------------------|-----------------|--------------|
| 320px | iPhone SE | Oculto fijo | Visible + menú |
| 375px | iPhone 12 | Oculto fijo | Visible + menú |
| 430px | Pixel 7 | Oculto fijo | Visible + menú |
| 768px | iPad mini | Visible | No visible |
| 1024px | iPad Pro / Laptop | Visible | No visible |
| 1440px | Desktop 24" | Visible | No visible |

---

## Checklist de Color Consistencia

### Azul del Sidebar - Gradiente 180°

**Color esperado:** Gradiente de `#1e3a8a` (arriba) → `#1d4ed8` (medio) → `#2563eb` (abajo)

#### En Admin Dashboard
- [ ] Sidebar tiene gradiente azul (arriba oscuro, abajo claro)
- [ ] Borde derecho del sidebar es limpio (sin líneas visibles)
- [ ] Sombra derecha del sidebar visible (4px offset)
- [ ] Menu items inactivos son **blanco/80** (text-white/80)
- [ ] Menu item activo tiene fondo **blanco puro** y texto **primary-700** (azul oscuro)
- [ ] Logo RP en header sidebar tiene **gradiente gold** (no azul)
- [ ] Botón cerrar sesión tiene hover con **rojo/20** (no azul)

#### En Cliente Dashboard
- [ ] Idem Admin - mismo gradiente azul
- [ ] No hay variación de color entre Admin y Cliente
- [ ] Iconos y texto se leen bien contra fondo azul

#### En Operario Dashboard
- [ ] Idem Admin - mismo gradiente azul
- [ ] No hay variación de color entre Admin y Operario
- [ ] Tarjetas urgentes tienen fondo **amber-50** (no azul)
- [ ] En progreso usa **primary-50** (azul muy claro, legible)

### Colores Relacionados en Sidebar

| Elemento | Color Esperado | Referencia CSS |
|----------|----------------|----------------|
| Fondo degradado | #1e3a8a → #1d4ed8 → #2563eb | `var(--sidebar-start/mid/end)` |
| Bordes (línea) | rgba(255,255,255,0.1) | border-white/10 |
| Texto inactivo | rgba(255,255,255,0.8) | text-white/80 |
| Texto activo | #1d4ed8 | text-primary-700 |
| Fondo activo | #ffffff | bg-white |
| Sombra | rgba(30,58,138,0.2) | box-shadow |
| Logo fondo | #fbbf24 → #f59e0b | from-gold-400 to-gold-500 |

### Header móvil (DashboardLayout)

- [ ] Fondo blanco, no azul
- [ ] Logo RP interior tiene gradiente **primary-600 to primary-700** (azul)
- [ ] Butón menú (hamburguesa) clickeable
- [ ] Texto "RealPrint" visible

### Elementos que NO deben ser azules del sidebar:

- [ ] Botones primary (si, son azul, pero **primary-600 en gradiente**, no sidebar)
- [ ] Logo oro RP (debe ser **gold-400 to gold-500**)
- [ ] Botón cerrar sesión (rojo/hover)
- [ ] Inputs focus (azul, pero **primary-500** con borde)

---

## Cómo Hacer Validación Visual

### Opción 1: Desarrollo local

```powershell
cd "D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\App-RealPrint"
npm run dev
```

Luego abre en navegador: `http://localhost:5174`

Credenciales demo:
- Admin: `admin` / `admin123`
- Cliente: `cliente` / `cliente123`
- Operario: `operario_demo_serigrafia` / `operario123`

### Opción 2: Usar DevTools de navegador

1. Abre `/admin` en navegador
2. Haz clic en el sidebar con selector de elementos (F12)
3. Busca `.glass-sidebar` en HTML
4. Revisa propiedades computadas (Computed Styles)
5. Verifica que `background: linear-gradient(...)` usa colores esperados

### Opción 3: Responsive Design Mode

1. F12 → Responsive Design Mode (Ctrl+Shift+M)
2. Cambia viewport:
   - 320px (móvil pequeño)
   - 768px (tablet)
   - 1440px (desktop)
3. Valida cada checkpoint de la tabla arriba

---

## Hallazgos Esperados (Sin Problemas)

Si todo está correcto, deberías observar:

1. **Color sidebar idéntico en los 3 dashboards**
   - Mismo azul gradiente (no hay variaciones por rol)
   - Sombra consistente

2. **Responsividad fluida**
   - Desktop: sidebar visible + contenido
   - Tablet: sidebar visible + contenido ajustado
   - Móvil: sidebar oculto, menu button visible

3. **Transiciones suaves**
   - Sidebar slide en móvil (300ms ease-in-out)
   - Overlay aparece/desaparece
   - Menu items cambio de estado sin saltos

---

## Posibles Problemas & Soluciones

### Problema: Azul del sidebar varía entre roles

**Causa probable:** Componente override en dashboard específico.

**Solución:**
1. Revisar `src/pages/admin/AdminDashboard.jsx`
2. Revisar `src/pages/cliente/ClienteDashboard.jsx`
3. Revisar `src/pages/operario/OperarioDashboard.jsx`
4. Buscar inline `style={{ background: ... }}`
5. Buscar className con gradiente hardcodeado
6. Reemplazar con token centralizado

### Problema: Sidebar no responsive en móvil

**Causa probable:** Breakpoint inconsistente (`window.innerWidth < 1024` vs `lg:*`)

**Solución:**
1. Revisar `DashboardLayout.jsx` → `lg:hidden` matches `1024px`
2. Revisar `Sidebar.jsx` → `lg:static` matches `1024px`
3. Revisar `window.innerWidth < 1024` en handleNavClick

### Problema: Build falla con variables CSS

**Causa probable:** Tailwind no reconoce variable CSS nueva.

**Solución:**
1. Limpiar `node_modules` y `.cache`
2. Reinstalar: `npm install`
3. Recompilir: `npm run build`

---

## Checklist Final (Antes de Cerrar)

- [x] Tokens centralizados en `tailwind.config.js`
- [x] Variables CSS en `index.css` (derivadas)
- [x] Build exitoso sin errores
- [x] Documento de tokens creado (`DESIGN_TOKENS.md`)
- [x] Documento de validación visual creado (este archivo)
- [ ] **Validación visual en navegador (PENDIENTE - requiere hacer click)**
- [ ] Ningún hex hardcodeado en className/style de componentes
- [ ] Sidebar color consistente admin/cliente/operario (confirmado en código)
- [ ] Responsive funciona en 320/768/1440 (confirmado en clases Tailwind)


