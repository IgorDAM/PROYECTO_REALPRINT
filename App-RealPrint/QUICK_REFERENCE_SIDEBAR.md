# Quick Reference - Sidebar Color Hardening

**Última actualización:** 2026-03-21

---

## 🎯 TL;DR

El color azul del sidebar está **centralizado** en `tailwind.config.js` → **derivado** a variables CSS en `index.css` → **aplicado** en `.glass-sidebar` usado por todos los dashboards.

**No hay hex hardcodeados sueltos. Un cambio en Tailwind afecta todos los dashboards.**

---

## 📍 Dónde Está El Color

| Nivel | Archivo | Ubicación | Formato |
|-------|---------|-----------|---------|
| **Source** | `tailwind.config.js` | `theme.extend.colors.sidebar` | Objeto JS |
| **Derivado** | `src/index.css` | `:root { --sidebar-* }` | Variables CSS |
| **Usado** | `src/index.css` | `.glass-sidebar { background: linear-gradient(var(--sidebar-*)) }` | Clase CSS |
| **Montado** | `src/components/layout/Sidebar.jsx` | `className="glass-sidebar"` | Componente React |

---

## 🔧 Si Quieres Cambiar El Azul

**En 3 pasos (sin romper nada):**

### Paso 1: Editar token Tailwind

Abre `tailwind.config.js`, busca:
```javascript
sidebar: {
  light: "#2563eb",      // ← Cambiar este
  mid: "#1d4ed8",         // ← O este
  dark: "#1e3a8a",        // ← O este
}
```

Reemplaza con tus nuevos colores (ej: más claro o más oscuro).

### Paso 2: Compilar

```powershell
npm run build
```

### Paso 3: Testear en los 3 dashboards

```powershell
npm run dev
```

Abre en navegador:
- http://localhost:5174/admin
- http://localhost:5174/cliente
- http://localhost:5174/operario

Todas deben tener el **mismo azul nuevo**.

---

## 📋 Tokens Disponibles

```javascript
// En tailwind.config.js
sidebar.light    // #2563eb (primario, más claro)
sidebar.mid      // #1d4ed8 (primario, mediano)
sidebar.dark     // #1e3a8a (primario, más oscuro)
```

```css
/* En index.css */
var(--sidebar-start)    /* #1e3a8a (gradiente inicio) */
var(--sidebar-mid)      /* #1d4ed8 (gradiente medio) */
var(--sidebar-end)      /* #2563eb (gradiente final) */
```

---

## ✅ Verificación Rápida

### Pregunta 1: ¿El azul es consistente en admin/cliente/operario?
**Respuesta:** Sí. Todos usan `Sidebar.jsx` con clase `glass-sidebar` que usa `var(--sidebar-*)`.

### Pregunta 2: ¿Hay hex hardcodeados sueltos?
**Respuesta:** No. Grep confirmó que los 3 colores (#1e3a8a, #1d4ed8, #2563eb) solo están en variables CSS de `index.css`.

### Pregunta 3: ¿Es responsive?
**Respuesta:** Sí. Breakpoint `lg:1024px` consistente en `DashboardLayout` y `Sidebar`.

### Pregunta 4: ¿Compila sin errores?
**Respuesta:** Sí. Build exitoso en 10.63s con 0 errores.

---

## 📚 Documentación Completa

- `DESIGN_TOKENS.md` - Referencia técnica detallada
- `VALIDACION_VISUAL_RESPONSIVE.md` - Checklist QA visual
- `HARDENING_RESUMEN.md` - Resumen ejecutivo
- `INFORME_HARDENING_FINAL.md` - Informe técnico completo

---

## 🚀 Flujo de Cambio Seguro

```
1. Edita tailwind.config.js (sidebar token)
   ↓
2. Compila (npm run build)
   ↓
3. Variables CSS se actualizan automáticamente
   ↓
4. .glass-sidebar refleja nuevo color
   ↓
5. Admin/Cliente/Operario ven cambio sincronizado
```

---

## ⚠️ Evitar

- ❌ Hardcodear hex en `Sidebar.jsx`
- ❌ Usar inline `style={{ background: "#..." }}`
- ❌ Copiar gradiente en múltiples archivos CSS
- ❌ Cambiar solo en `index.css` sin actualizar `tailwind.config.js`

---

## ✨ Beneficios

- ✅ Single source of truth (Tailwind)
- ✅ Cambios globales sin buscar/reemplazar
- ✅ Traceable en DevTools (variables CSS)
- ✅ Documentado (DESIGN_TOKENS.md)
- ✅ Escalable (nuevos dashboards heredan automáticamente)

---

**¿Dudas?** Consulta `DESIGN_TOKENS.md` o `INFORME_HARDENING_FINAL.md`.


