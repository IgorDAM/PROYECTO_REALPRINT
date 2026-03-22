# RealPrint - Sistema de Gestión de Impresión Personalizada

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Tests](https://img.shields.io/badge/tests-83/83-success)
![Coverage](https://img.shields.io/badge/coverage-65--70%25-yellowgreen)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

---

## 📋 Descripción

**RealPrint** es una aplicación web moderna para la **gestión integral de pedidos de impresión personalizada**, diseñada con:

- ✅ **Frontend moderno:** React 18 + Vite + Tailwind CSS
- ✅ **Testing completo:** Vitest con 83 tests (65-70% cobertura)
- ✅ **Seguridad:** JWT, validación, error boundaries
- ✅ **Performance:** Paginación, lazy loading, memoización
- ✅ **UX/DX:** Logging centralizado, validadores, componentes reutilizables

---

## 🚀 Inicio Rápido

```bash
# 1. Instalar
npm install

# 2. Desarrollar
npm run dev

# 3. Testear
npm test

# 4. Build
npm run build
```

Abre http://localhost:5173 y usa credenciales:
- Usuario: `admin` / Contraseña: `admin123`

---

## 📊 Métricas

```
Tests:              83/83 pasando ✅
Cobertura:          ~65-70%
Build Size:         42.67 KB CSS + 316.61 KB JS
Módulos:            119
Build Time:         ~5 segundos
Lint Errors:        0
```

---

## 🎯 Características Principales

### 👨‍💼 Administrador
- Dashboard con estadísticas
- Gestión de pedidos, inventario, usuarios
- Reportes y análisis
- Configuración del sistema

### 👥 Cliente
- Crear y ver pedidos
- Historial de órdenes
- Panel personalizado

### 🏭 Operario
- Visualizar tareas
- Marcar como completadas
- Detalles de pedidos

---

## 📚 Documentación

| Documento | Propósito |
|-----------|-----------|
| **../md/05_guias_y_referencias/GUIA_INSTALACION.md** | Setup y troubleshooting |
| **../md/05_guias_y_referencias/REFERENCIA_RAPIDA.md** | Comandos y shortcuts |
| **GUIA_FUNCIONAL_FRONTEND.md** | Features implementadas |
| **DESIGN_TOKENS.md** | Estilos y diseño |

---

## 🛠️ Scripts

```bash
npm run dev              # Desarrollo con HMR
npm run build            # Build producción (lint + vite)
npm run preview          # Previsualizar build
npm run lint             # Validar con ESLint
npm test                 # Tests modo watch
npm test -- --run        # Tests una sola vez
npm run test:coverage   # Reporte de cobertura
npm run test:ui         # UI interactiva (http://localhost:51204)
```

---

## 🏗️ Stack Tecnológico

| Aspecto | Tecnología |
|--------|-----------|
| **Framework** | React 18.2 + Hooks |
| **Router** | React Router 7.12 |
| **Bundler** | Vite 4.4.5 |
| **Styling** | Tailwind CSS 3.3.3 |
| **Testing** | Vitest 4.1 + @testing-library |
| **Linting** | ESLint 8.45 |
| **State** | Context API + Custom Hooks |

---

## 📁 Estructura

```
src/
├── components/          # Componentes React
│   ├── layout/         # Layouts (Sidebar, Dashboard)
│   ├── ui/             # Componentes UI reutilizables
│   └── ErrorBoundary.jsx
├── context/            # State (Auth, Data)
│   └── data/           # Dominios (Pedidos, Inventario, etc.)
├── hooks/              # Custom hooks
│   ├── usePagination.jsx
│   ├── usePerformance.js
│   └── use*Data.js
├── pages/              # Páginas por rol
├── services/           # HTTP, Auth, Logger
└── utils/              # Validadores, helpers
```

---

## 🧪 Testing

```bash
# Todos los tests
npm test -- --run

# Tests por área
npm test src/hooks/
npm test src/utils/validators
npm test src/context/data/

# Con cobertura
npm run test:coverage
```

Características:
- ✅ 83 tests unitarios
- ✅ 12 test suites
- ✅ 65-70% cobertura de código
- ✅ Tests de componentes, hooks, servicios, validadores

---

## 🧪 E2E (Playwright)

Flujos críticos cubiertos:
- Login por rol (`admin`, `cliente`, `operario`)
- Rutas protegidas por rol
- CRUD de inventario en admin

```bash
npm run test:e2e
npm run test:e2e:headed
npm run test:e2e:ui
```

Detalles: `e2e/README.md`

---

## 🔐 Seguridad

✅ **Auth:** JWT (producción) + Local (desarrollo)  
✅ **Routes:** Protegidas por rol  
✅ **Validation:** Cliente + servidor  
✅ **Errors:** Boundaries + Logging  
✅ **Audit:** Logger centralizado  

---

## 📈 Performance

✅ **Paginación:** 25 items por página  
✅ **Lazy Loading:** Code splitting automático  
✅ **Memoización:** Componentes optimizados  
✅ **Bundle:** 42.67 KB CSS, 316.61 KB JS  
✅ **Lighthouse:** Nota A  

---

## 📞 Soporte

Para problemas:
1. Revisa GUIA_INSTALACION.md
2. Consulta los tests como ejemplos vivos
3. Verifica logs en consola o `logger.getLogs()`
4. Ejecuta `npm test -- --run` para validar setup

---

**¡Listo para desarrollar! 🚀**
