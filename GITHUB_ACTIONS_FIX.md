# 🔧 Solución: Error en GitHub Actions - Build Frontend Docker

## Problema

Error en el build de Docker del frontend en GitHub Actions:

```
Cannot find module @rollup/rollup-linux-x64-musl
npm has a bug related to optional dependencies
```

## Causa Raíz

El contenedor Alpine (`node:20-alpine`) usa **musl** como libc, no glibc. Las dependencias nativas de Rollup no estaban siendo compiladas correctamente para el ambiente Alpine.

## Solución Implementada

### 1. **Frontend Dockerfile** (`./frontend/Dockerfile`)

```dockerfile
# ANTES: Problemas con npm ci --only=production + npm install
RUN npm ci --only=production
RUN npm install

# DESPUÉS: npm ci instala TODAS las dependencias + herramientas de build
RUN apk add --no-cache python3 make g++  # ← Instalar compiladores
RUN npm ci                                 # ← Una sola instalación limpia
```

**Cambios clave:**
- ✅ Instalar `python3`, `make`, `g++` para compilar dependencias nativas
- ✅ Un solo `npm ci` que instala todo (dev + production)
- ✅ Remover `FROM node:20-alpine as builder` → `FROM node:20-alpine AS builder` (casing correcto)

### 2. **Frontend package.json** (`./frontend/package.json`)

```json
// ANTES
"build": "npm run lint && vite build"

// DESPUÉS
"build": "vite build",
"build:ci": "npm run lint && vite build"  // ← Lint solo en CI/CD
```

**Cambios clave:**
- ✅ `build` sin lint para desarrollo local
- ✅ `build:ci` con lint para CI/CD (GitHub Actions puede fallar si hay lint errors)
- ✅ Remover `optionalDependencies` problemáticas (Rollup incluye todo lo necesario)

### 3. **GitHub Actions Workflow** (`./.github/workflows/ci-cd.yml`)

Ya estaba bien configurado:
```yaml
- name: Install dependencies (clean)
  run: |
    rm -rf node_modules package-lock.json
    npm install
```

✅ Limpia caché antes de instalar (previene binarios incompletos)

### 4. **.dockerignore** (Nuevo)

```
# ./frontend/.dockerignore
node_modules
npm-debug.log
dist
...

# ./backend/.dockerignore
target
.git
...
```

✅ Evita copiar archivos innecesarios en el contexto Docker

---

## Testing de la Solución

### Local (para verificar):

```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build:ci

# Verificar Dockerfile
docker build -t realprint-frontend:test .
```

### GitHub Actions:

El workflow debería pasar ahora:
1. `test-frontend` instalará dependencias limpias ✅
2. `build-docker` compilará con herramientas nativas disponibles ✅
3. Imagen resultante listará correctamente en `ghcr.io` ✅

---

## Matriz de Cambios

| Archivo | Cambio | Razón |
|---------|--------|-------|
| `frontend/Dockerfile` | Agregar `apk add python3 make g++` | Compilar deps nativas en Alpine |
| `frontend/Dockerfile` | Una sola `npm ci` | Evitar deps incompletas |
| `frontend/package.json` | Split `build` vs `build:ci` | Lint solo en CI/CD |
| `frontend/package.json` | Remover `optionalDependencies` | Rollup incluye todo automáticamente |
| `frontend/.dockerignore` | Crear nuevo | Optimizar contexto Docker |
| `backend/.dockerignore` | Crear nuevo | Optimizar contexto Docker |

---

## Monitoreo

Después de hacer push:
1. Verifica que el job `test-frontend` pase ✅
2. Verifica que el job `build-docker` complete ✅
3. Verifica que las imágenes aparezcan en `ghcr.io` ✅

Si sigue habiendo error de tamaño o compilación:
- Aumentar timeout del build
- Considerar usar `node:20-slim` (más ligero que Alpine pero soporta glibc)

---

**Versión**: v1.0  
**Fecha**: 2024-12-19  
**Status**: ✅ Ready for deployment
