# 🚀 Guía de Instalación - RealPrint

**Última actualización:** 2026-03-22  
**Versión del proyecto:** 1.0.0

---

## 📋 Requisitos Previos

- **Node.js:** v16.x o superior
- **npm:** v8.x o superior
- **Git:** para clonar el repositorio

Verificar versiones:
```bash
node --version
npm --version
```

---

## 📥 Instalación Paso a Paso

### 1. Clonar el repositorio

```bash
git clone <URL-DEL-REPOSITORIO>
cd PROYECTO_REALPRINT/App-RealPrint
```

### 2. Instalar dependencias

```bash
npm install
```

Esto instalará:
- ✅ React 18.2.0
- ✅ React Router DOM 7.12.0
- ✅ Vite 4.4.5
- ✅ Tailwind CSS 3.3.3
- ✅ Vitest 4.1.0
- ✅ ESLint + complementos

### 3. Verificar instalación

```bash
npm test -- --run
```

Debería ver:
```
Test Files  12 passed (12)
Tests  83 passed (83)
```

---

## 🏃 Ejecutar la Aplicación

### Modo Desarrollo (con hot reload)

```bash
npm run dev
```

Abrirá en: **http://localhost:5173**

### Modo Producción (compilación optimizada)

```bash
npm run build
```

Genera la carpeta `dist/` con código optimizado.

### Previsualizar Build

```bash
npm run preview
```

---

## 🧪 Testing

### Ejecutar todos los tests

```bash
npm test
```

(Modo watch - se ejecutan al guardar archivos)

### Ejecutar tests una sola vez

```bash
npm test -- --run
```

### Ver tests en UI interactiva

```bash
npm run test:ui
```

Abre: **http://localhost:51204/__vitest__/**

### Generar reporte de cobertura

```bash
npm run test:coverage
```

---

## 🔍 Linting & Formateo

### Validar código

```bash
npm run lint
```

### Lint automático en build

El build falla si hay errores de lint:
```bash
npm run build
```

---

## 🔑 Credenciales Demo (Modo Local)

El proyecto viene configurado con usuarios demo para desarrollo:

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | admin123 | Administrador |
| cliente | cliente123 | Cliente |
| operario_demo_serigrafia | operario123 | Operario |
| operario_demo_rotulacion | operario123 | Operario |

**Nota:** Estos son solo para desarrollo local. En producción se conectará a API real.

---

## 📁 Estructura del Proyecto

```
App-RealPrint/
├── src/
│   ├── components/          # Componentes React
│   │   ├── layout/         # Layouts (Sidebar, DashboardLayout)
│   │   ├── ui/             # Componentes UI reutilizables
│   │   └── ErrorBoundary.jsx
│   ├── context/            # React Context (Auth, Data)
│   │   └── data/           # Dominios (Pedidos, Inventario, etc.)
│   ├── hooks/              # Custom hooks
│   │   ├── usePagination.jsx
│   │   ├── usePerformance.js
│   │   └── use*Data.js     # Hooks por dominio
│   ├── pages/              # Páginas por rol
│   │   ├── admin/
│   │   ├── cliente/
│   │   └── operario/
│   ├── services/           # Servicios API
│   │   ├── authService.js
│   │   ├── logger.js
│   │   └── validators.js
│   └── utils/              # Utilidades
├── public/                 # Assets estáticos
├── package.json
├── vite.config.js
├── vitest.config.js
└── tailwind.config.js
```

## 🌍 Variables de Entorno

Crear archivo `.env` en `App-RealPrint/` basado en `.env.example`:

```bash
# 1. Copiar el archivo de ejemplo
cp .env.example .env

# 2. Editar si necesitas cambiar valores
nano .env  # o tu editor favorito
```

**Contenido de `.env`:**
```env
VITE_API_URL=http://localhost:8080/api
VITE_API_TIMEOUT=10000
VITE_USE_LOCAL_AUTH=true
VITE_USE_PEDIDOS_SERVICE_CREATE=false
# ... más variables según necesites
```

⚠️ **IMPORTANTE:** El archivo `.env` está en `.gitignore` para proteger secretos.

**Nunca hacer:** `git add .env`

---

## 🔐 Seguridad

```env
# API Backend (si existe)
VITE_API_URL=http://localhost:3000/api

# Modo auth local
VITE_USE_LOCAL_AUTH=true

# Modo desarrollo
VITE_DEV_MODE=true
```

---

## 🐛 Troubleshooting

### Error: "Port 5173 is already in use"

```bash
# Cambiar puerto
npm run dev -- --port 5174
```

### Error: "Module not found"

```bash
# Limpiar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Tests fallando después de cambios

```bash
# Limpiar cache de vitest
npm test -- --clearCache
npm test -- --run
```

### Build lento

```bash
# Analizar bundle
npm run build -- --analyze
```

---

## 📚 Próximos Pasos

1. **Leer:** `REFERENCIA_RAPIDA.md` para comandos comunes
2. **Explorar:** `src/pages/` para entender la estructura de páginas
3. **Revisar:** `GUIA_FUNCIONAL_FRONTEND.md` para features
4. **Setup:** Backend API cuando esté listo

---

## 🆘 Soporte

Si encuentras problemas:

1. Revisa la sección "Troubleshooting" arriba
2. Verifica que todas las dependencias estén instaladas: `npm list`
3. Consulta los logs de la consola del navegador (F12)
4. Revisa los logs de vitest: `npm test -- --reporter=verbose`

---

**¡Listo para desarrollar! 🚀**

Para más detalles, lee los otros documentos en la carpeta raíz del proyecto.

