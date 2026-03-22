# Design Tokens - RealPrint Frontend

Fecha: 2026-03-21
Propósito: Documentar tokens centralizados de color y sombra para garantizar consistencia de diseño.

---

## Índice

1. [Tokens de Color](#tokens-de-color)
2. [Sidebar (Hardened Single Source of Truth)](#sidebar-hardened-single-source-of-truth)
3. [Referencias en Código](#referencias-en-código)
4. [Checklist de Sincronización](#checklist-de-sincronización)

---

## Tokens de Color

Todos los tokens de color se definen en **`App-RealPrint/tailwind.config.js`** (source of truth) y se derivan a **`App-RealPrint/src/index.css`** mediante variables CSS.

### Paleta Primaria - Azul

| Nombre | Valor | Uso | Origen Tailwind |
|--------|-------|-----|-----------------|
| `--primary-blue` | `#2563eb` | Botones, links, elementos activos | `primary-600` |
| `--primary-blue-light` | `#3b82f6` | Variante clara de primary | `primary-500` |
| `--primary-blue-dark` | `#1d4ed8` | Variante oscura de primary | `primary-700` |

### Paleta Sidebar (HARDENED - Single Source of Truth)

El sidebar usa **gradiente lineal 180°** que DEBE mantenerse consistente en **todos** los dashboards (Admin, Cliente, Operario).

| Nombre | Valor | Posición | Uso |
|--------|-------|----------|-----|
| `--sidebar-start` | `#1e3a8a` | 0% (top) | Inicio del gradiente sidebar |
| `--sidebar-mid` | `#1d4ed8` | 50% (middle) | Punto medio del gradiente |
| `--sidebar-end` | `#2563eb` | 100% (bottom) | Final del gradiente sidebar |

**Gradiente CSS (aplicado en `.glass-sidebar`):**
```css
background: linear-gradient(
  180deg,
  var(--sidebar-start) 0%,   /* #1e3a8a */
  var(--sidebar-mid) 50%,     /* #1d4ed8 */
  var(--sidebar-end) 100%     /* #2563eb */
);
```

### Paleta Oro/Amber

| Nombre | Valor | Uso |
|--------|-------|-----|
| `--gold` | `#fbbf24` | Acentos, iconos RP, botones gold |
| `--gold-dark` | `#d97706` | Hover/estados activos |

### Paleta de Superficie (Neutral)

| Nombre | Valor | Uso |
|--------|-------|-----|
| `--surface-white` | `#ffffff` | Fondos primarios, cartas |
| `--surface-light` | `#f8fafc` | Fondos claros, body |
| `--surface-gray` | `#f1f5f9` | Fondos secundarios |
| `--text-primary` | `#0f172a` | Texto principal |
| `--text-secondary` | `#475569` | Texto secundario |
| `--text-muted` | `#94a3b8` | Texto deshabilitado |
| `--border-light` | `#e2e8f0` | Bordes |

---

## Sidebar (Hardened Single Source of Truth)

### Dónde se define:

1. **`App-RealPrint/tailwind.config.js`** (Primary)
   - Token `sidebar.light`, `sidebar.mid`, `sidebar.dark`
   - Sombra `shadow-sidebar`

2. **`App-RealPrint/src/index.css`** (Derived)
   - Variables CSS: `--sidebar-start`, `--sidebar-mid`, `--sidebar-end`
   - Clases: `.glass-sidebar`, `.bg-gradient-blue`

### Dónde se usa:

| Archivo | Componente | Clase/Propiedad | Estado |
|---------|-----------|-----------------|--------|
| `src/components/layout/Sidebar.jsx` | Sidebar | `class="glass-sidebar"` | ✅ Activo |
| `src/index.css` | `.glass-sidebar` | `background: linear-gradient(...)` | ✅ Variables |
| `src/index.css` | `.bg-gradient-blue` | Gradiente similar | ✅ Variables |
| `src/components/layout/DashboardLayout.jsx` | Header móvil | `from-primary-600 to-primary-700` | ✅ Tailwind |

### Cómo sincronizar si hay que cambiar el azul del sidebar:

**Escenario:** Cambiar gradiente de sidebar a otro azul (ej. más claro o más oscuro).

**Pasos (SIN romper nada):**

1. **Editar `tailwind.config.js`:**
   ```javascript
   sidebar: {
     light: "#NEW_HEX_1",     // Was #2563eb
     mid: "#NEW_HEX_2",       // Was #1d4ed8
     dark: "#NEW_HEX_3",      // Was #1e3a8a
   },
   ```

2. **Verificar que `index.css` uses variables (ya done):**
   ```css
   .glass-sidebar {
     background: linear-gradient(
       180deg,
       var(--sidebar-start) 0%,
       var(--sidebar-mid) 50%,
       var(--sidebar-end) 100%
     );
   }
   ```

3. **Compilar y testear en todos los dashboards:**
   ```powershell
   npm run build
   ```

4. **Validar visualmente:**
   - `/admin` (Admin Dashboard)
   - `/cliente` (Cliente Dashboard)
   - `/operario` (Operario Dashboard)

---

## Referencias en Código

### Archivos que contienen tokens hardcodeados (LEGACY - deben migrar a variables):

| Archivo | Línea aprox. | Problema | Acción |
|---------|------------|---------|--------|
| `src/index.css` | (ya refactorizado) | ✅ Usa variables | Mantener |
| `src/components/layout/Sidebar.jsx` | 80-160 | Usa clase `glass-sidebar` | ✅ Correcto |
| `src/index.css` | (var-based) | ✅ Centralizado | Verificado |

### Checklist de componentes que usan azul:

- [x] `.glass-sidebar` - variables CSS
- [x] `.bg-gradient-blue` - variables CSS
- [x] `.btn-primary` - variables CSS
- [x] `.stat-card.blue::before` - variables CSS
- [x] `.input-group label focus` - variables CSS
- [x] `DashboardLayout` header móvil - Tailwind `primary-600`/`primary-700`

---

## Checklist de Sincronización

Use este checklist cada vez que se modifique colores de sidebar:

### Pre-cambio:
- [ ] Editar `tailwind.config.js` → token `sidebar`
- [ ] Revisar que `index.css` uses `var(--sidebar-*)`
- [ ] Revisar que no haya hex hardcodeados en JS/JSX

### Post-cambio:
- [ ] `npm run build` - sin errores
- [ ] Testear en `/admin` - color consistente
- [ ] Testear en `/cliente` - color consistente
- [ ] Testear en `/operario` - color consistente
- [ ] Testear en móvil (< 1024px) - sidebar deslizable sin cambios de color
- [ ] Revisar que sombra sidebar sea consistente con color (usar `shadow-sidebar`)

---

## Notas de Arquitectura

1. **Por qué tokens centralizados:**
   - Evita inconsistencias visuales entre roles.
   - Facilita cambios globales sin buscar y reemplazar.
   - Reduce riesgos de regresión en refactors.

2. **Por qué variables CSS:**
   - Compatibles con Tailwind dinámico.
   - Legibles en CSS puro.
   - Fácil auditoria en DevTools.

3. **Por qué `tailwind.config.js` es source of truth:**
   - Tailwind compilación sincroniza colores automáticamente.
   - Un único lugar para mantener paleta.
   - Variables CSS se derivan de él.

---

## Historial de Cambios

| Fecha | Cambio | Responsable |
|-------|--------|-------------|
| 2026-03-21 | Hardening: centralizar tokens sidebar en Tailwind + variables CSS | Refactor Incremental |


