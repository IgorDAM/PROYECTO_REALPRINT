# 🔒 Guía de Seguridad - RealPrint

Este documento describe las mejores prácticas de seguridad para trabajar con este repositorio.

---

## ⚠️ INFORMACIÓN SENSIBLE - NO COMMITEAR

### ❌ **NUNCA** subas a GitHub:

1. **Credenciales de bases de datos**
   - URLs con credenciales: `postgresql://user:password@host/db`
   - Usuarios y contraseñas reales
   - Cadenas de conexión completas

2. **Tokens y secrets**
   - JWT_SECRET real
   - API keys de servicios externos
   - Tokens de acceso personal
   - OAuth client secrets

3. **URLs de producción con datos sensibles**
   - URLs de bases de datos públicas
   - Endpoints privados
   - URLs con tokens embebidos

4. **Información personal**
   - Emails personales
   - Números de teléfono
   - Direcciones físicas
   - Información de tarjetas de crédito

---

## ✅ Archivos ya protegidos en `.gitignore`

```gitignore
# Variables de entorno
.env
.env.local
.env.*.local

# Archivos con credenciales reales
**/RENDER_ENV_VARS.local.md
**/INFORME_SESION*.local.md
**/credenciales*.md
**/secrets*.md

# Notas personales sensibles
docs/notas/*.local.*
docs/notas/credenciales*
docs/notas/passwords*

# Uploads y archivos temporales
uploads/*
*.log
```

---

## 🛡️ Buenas prácticas

### 1. Usar placeholders en documentación

✅ **CORRECTO:**
```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://<TU_HOST>:<PUERTO>/<NOMBRE_BD>
SPRING_DATASOURCE_USERNAME=<TU_USUARIO>
SPRING_DATASOURCE_PASSWORD=<TU_PASSWORD>
JWT_SECRET=<GENERA_UNO_CON: openssl rand -base64 32>
```

❌ **INCORRECTO:**
```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://dpg-xyz123.render.com:5432/realprint
SPRING_DATASOURCE_USERNAME=realprint_user
SPRING_DATASOURCE_PASSWORD=MiPasswordReal123
JWT_SECRET=clave-secreta-real-del-proyecto
```

### 2. Crear versiones locales para desarrollo

Si necesitas archivos con datos reales para desarrollo local:

```bash
# Copia el template
cp docs/md/RENDER_ENV_VARS.md docs/md/RENDER_ENV_VARS.local.md

# Edita la versión .local con datos reales
# Este archivo NO se subirá a GitHub (está en .gitignore)
```

### 3. Generar secrets únicos por ambiente

```bash
# Desarrollo
openssl rand -base64 32

# Producción (diferente)
openssl rand -base64 32

# Staging (diferente)
openssl rand -base64 32
```

### 4. Usar variables de entorno

En lugar de hardcodear valores sensibles:

✅ **CORRECTO:**
```java
String jwtSecret = System.getenv("JWT_SECRET");
```

❌ **INCORRECTO:**
```java
String jwtSecret = "clave-secreta-hardcodeada";
```

---

## 🔍 Antes de hacer commit

### Checklist de seguridad:

- [ ] ¿El commit contiene archivos `.env` con valores reales?
- [ ] ¿Hay contraseñas en texto plano?
- [ ] ¿Hay URLs de bases de datos con credenciales?
- [ ] ¿Los archivos `.md` tienen información sensible?
- [ ] ¿Los comentarios del código exponen información privada?

### Comandos útiles:

```bash
# Buscar posibles contraseñas en archivos staged
git diff --cached | grep -i "password\|secret\|token\|api[_-]key"

# Ver qué archivos se van a commitear
git status

# Revisar cambios antes de commitear
git diff --cached
```

---

## 🚨 Si ya commiteaste información sensible

### 1. NO HAGAS PUSH aún

Si no has hecho push, puedes revertir:

```bash
# Deshacer el último commit (mantiene cambios)
git reset --soft HEAD~1

# Editar archivos para remover información sensible
# Luego hacer commit de nuevo
```

### 2. Si ya hiciste PUSH

**Contacta al administrador del repositorio inmediatamente** para:
- Rotar todas las credenciales comprometidas
- Limpiar el historial de Git (git filter-branch o BFG Repo-Cleaner)
- Actualizar las credenciales en los servicios (Render, Netlify, etc.)

---

## 📚 Archivos revisados y sanitizados

Los siguientes archivos han sido revisados y limpiados de información sensible:

- ✅ `docs/md/RENDER_ENV_VARS.md` - Credenciales reemplazadas por placeholders
- ✅ `docs/md/INFORME_SESION_12_05_2026.md` - URLs y credenciales ofuscadas
- ✅ `docs/md/DEPLOY_CHECKLIST.md` - Solo contiene ejemplos genéricos
- ✅ `docs/md/RENDER_CONFIG.md` - Placeholders correctos
- ✅ `docs/md/NETLIFY_CONFIG.md` - Placeholders correctos
- ✅ `README.md` - Solo información pública

### Archivos con datos de ejemplo (no sensibles):

- ✅ `docs/postman/README.md` - Usuarios de prueba (admin/admin123, cliente1/cliente123)
- ✅ `docs/md/Memoria_Final.md` - Usuarios de demo

---

## 🔐 Rotación de credenciales

Si sospechas que alguna credencial fue comprometida:

### Base de datos (Render):
1. Dashboard de Render → PostgreSQL → Connections
2. "Reset Password"
3. Actualizar `SPRING_DATASOURCE_PASSWORD` en variables de entorno

### JWT Secret:
```bash
# Generar nuevo secret
openssl rand -base64 32

# Actualizar en Render
RENDER_ENV: JWT_SECRET=<nuevo_valor>
```

### API Keys externas:
- Revocar la key en el servicio correspondiente
- Generar nueva key
- Actualizar en variables de entorno

---

## 📞 Contacto

Si encuentras información sensible en el repositorio o tienes dudas de seguridad:

1. **NO la reportes en issues públicos**
2. Contacta directamente al administrador del proyecto
3. Si es urgente, revoca las credenciales primero y reporta después

---

**Última actualización**: 2026-05-16  
**Versión**: 1.0
