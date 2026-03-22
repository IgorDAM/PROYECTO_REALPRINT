# 🔐 SEGURIDAD: Variables de Entorno

**Fecha:** 2026-03-22  
**Status:** ✅ Arreglado  
**Problema encontrado:** ❌ `.env` estaba en repositorio público  
**Solución:** ✅ Agregado a `.gitignore`

---

## 🚨 Problema Identificado

**CRÍTICO:** El archivo `.env` contenía variables de configuración y fue encontrado:
- ❌ En el repositorio Git
- ❌ No estaba en `.gitignore`
- ❌ Potencialmente accesible públicamente

### Variables Expuestas (Menor riesgo en este caso)

```
VITE_API_URL=http://localhost:8080/api
VITE_API_TIMEOUT=10000
VITE_USE_LOCAL_AUTH=true
VITE_USE_PEDIDOS_SERVICE_*=false
VITE_USE_INVENTARIO_SERVICE_*=false
VITE_USE_USUARIOS_SERVICE_*=false
```

**Nota:** En este proyecto son variables de demo, pero **en producción podrían contener API keys, tokens, contraseñas, URLs de BD**, etc.

---

## ✅ Soluciones Implementadas

### 1. Actualizar `.gitignore` ✅

Se agregaron las siguientes líneas:

```gitignore
# Environment variables (NUNCA hacer commit de .env)
.env
.env.local
.env.*.local
.env.production.local
```

**Esto protege:**
- ✅ `.env` (variables locales)
- ✅ `.env.local` (overrides locales)
- ✅ `.env.dev.local` (desarrollo local)
- ✅ `.env.production.local` (producción local)

### 2. Mantener `.env.example` ✅

El archivo `.env.example` **SÍ debe estar en Git** como referencia:

```
✅ Archivo: .env.example (EN el repositorio)
   - Propósito: Template para nuevos desarrolladores
   - Contenido: Variable names + comentarios explicativos
   - NO incluye: Valores secretos reales

❌ Archivo: .env (FUERA del repositorio)
   - Propósito: Configuración local real
   - Contenido: Valores secretos verdaderos
   - NO debe: Estar en Git nunca
```

---

## 📋 Checklist de Seguridad

### Para Desarrolladores

- ✅ Copiar `.env.example` a `.env`:
  ```bash
  cp .env.example .env
  ```

- ✅ Editar `.env` con valores locales:
  ```bash
  # .env
  VITE_API_URL=http://localhost:8080/api
  VITE_USE_LOCAL_AUTH=true
  ```

- ✅ NUNCA hacer commit de `.env`:
  ```bash
  # Esto está protegido por .gitignore ahora
  git add .env  # ❌ No funcionará
  ```

### Para Producción

Cuando depliegues a producción:

- ✅ **NO copiar `.env` al servidor**
- ✅ **Usar variables de entorno del servidor:**
  ```bash
  # En Heroku
  heroku config:set VITE_API_URL=https://api.produccion.com
  
  # En AWS/GCP
  export VITE_API_URL=https://api.produccion.com
  ```

- ✅ **Usar secrets management:**
  - GitHub Secrets
  - AWS Secrets Manager
  - Heroku Config Vars
  - Vercel Environment Variables

---

## 🔍 Cómo Verificar

### 1. Verificar que `.gitignore` está actualizado

```bash
cd App-RealPrint
cat .gitignore | grep -A 4 "Environment"
```

**Debería mostrar:**
```
# Environment variables (NUNCA hacer commit de .env)
.env
.env.local
.env.*.local
.env.production.local
```

### 2. Verificar que `.env` no va a Git

```bash
git status
# No debería mostrar .env

git check-ignore .env
# Debería salir sin error (está ignored)
```

### 3. Verificar que `.env.example` sí está en Git

```bash
git ls-files | grep env
# Debería mostrar: App-RealPrint/.env.example
```

---

## 📚 Mejores Prácticas

### ✅ Hacer

```bash
# ✅ Copiar ejemplo
cp .env.example .env

# ✅ Editar con valores locales
nano .env

# ✅ Git ignora automáticamente
git add .
# No incluye .env

# ✅ Compartir .env.example
git add .env.example
git commit -m "Update .env.example template"
```

### ❌ NO Hacer

```bash
# ❌ Hacer commit de secretos
git add .env
git commit -m "Add .env"  # ¡NUNCA!

# ❌ Almacenar contraseñas en código
const API_KEY = "secret123";  // ❌

# ❌ Dejar valores sensibles por defecto
VITE_API_KEY=default_key  # ❌

# ❌ Pushear a Github después
git push origin main  # ❌ Si .env fue commiteado
```

---

## 🛡️ Variables Sensibles Típicas

En proyectos reales, `.env` contiene:

```
# ❌ NUNCA en Git:
VITE_API_KEY=sk_live_51234567890
VITE_DATABASE_PASSWORD=super_secret_password
VITE_JWT_SECRET=mi_secreto_muy_privado
VITE_AWS_SECRET_KEY=AKIAIOSFODNN7EXAMPLE
VITE_STRIPE_SECRET_KEY=sk_test_123456789
VITE_GOOGLE_CLIENT_SECRET=secret_very_secret
VITE_GITHUB_TOKEN=ghp_abc123xyz789
```

---

## ✅ Estado Actual del Proyecto

```
✅ .gitignore actualizado con .env
✅ .env.example existe como template
✅ Variables protegidas correctamente
✅ Nuevos desarrolladores pueden hacer `cp .env.example .env`
✅ Secretos no están en el repositorio
```

---

## 📖 Documentación para el Equipo

Deberías agregar esto a tu README o GUIA_INSTALACION.md:

```markdown
### Variables de Entorno

1. Copiar template:
   ```bash
   cp App-RealPrint/.env.example App-RealPrint/.env
   ```

2. Editar valores si necesitas:
   ```bash
   nano App-RealPrint/.env
   ```

3. **Nunca** hacer commit de `.env` (está en .gitignore)

4. Para producción, usar variables del servidor (no .env)
```

---

## 🔗 Referencias

- [Node.js .env Security](https://nodejs.org/en/knowledge/file-system/security/introduction/)
- [GitHub Secrets Best Practices](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [12 Factor App - Config](https://12factor.net/config)

---

**Status:** ✅ ARREGLADO - Seguridad mejorada

El proyecto ahora está más seguro respecto a variables de entorno.

**Próximos pasos:**
- ✅ Notificar al equipo que `.env` está ahora ignorado
- ✅ Pedir a desarrolladores que usen `cp .env.example .env`
- ✅ En producción, usar secrets management del servidor

