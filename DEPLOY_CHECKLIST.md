# Checklist de Deploy - RealPrint

## Resumen de Cambios Realizados

✅ **Backend configurado para PostgreSQL** en producción
✅ **Hibernate ddl-auto cambiado a `update`** (safe para producción)
✅ **CORS configurado** para variables de entorno
✅ **Frontend configurado** para apuntar a backend en Render
✅ **Documentación completa** de configuración
✅ **netlify.toml configurado** con redirects y headers

---

## 📋 Checklist de Deploy

### Parte 1: Deploy del Backend en Render

#### 1.1 Crear PostgreSQL Database
- [ ] Ir a Render Dashboard
- [ ] Crear nuevo PostgreSQL Database
- [ ] Anotar: nombre de la base de datos

#### 1.2 Crear Web Service
- [ ] Crear nuevo Web Service
- [ ] Conectar repositorio Git
- [ ] Configurar build:
  ```
  Build Command: cd backend && ./mvnw clean package -DskipTests
  Start Command: cd backend && java -jar target/*.jar
  ```

#### 1.3 Configurar Variables de Entorno
En Render, agregar estas variables (Settings > Environment):

**OBLIGATORIAS:**
- [ ] `DATABASE_URL` → Conectar la PostgreSQL Database creada
- [ ] `JWT_SECRET` → Generar con: `openssl rand -base64 32`
- [ ] `SPRING_PROFILE` → `production`

**IMPORTANTE:**
- [ ] `CORS_ALLOWED_ORIGINS` → `https://app-realprint.netlify.app`

**OPCIONALES (tienen valores por defecto):**
- [ ] `JWT_EXPIRATION_MS` → `86400000`
- [ ] `SERVER_CONTEXT_PATH` → `/api`
- [ ] `MAX_FILE_SIZE` → `10485760`
- [ ] `MAX_REQUEST_SIZE` → `12582912`
- [ ] `UPLOAD_DIR` → `/tmp/uploads`

#### 1.4 Deploy y Verificación
- [ ] Hacer deploy (automático al pushear a main)
- [ ] Esperar a que termine el build (~5-10 min)
- [ ] Anotar la URL: `https://tu-backend.onrender.com`
- [ ] Verificar salud: `https://tu-backend.onrender.com/api/actuator/health`
- [ ] Verificar setup: `https://tu-backend.onrender.com/api/setup/status`

#### 1.5 Crear Usuario Admin
Ejecutar en terminal:
```bash
curl -X POST https://proyecto-realprint.onrender.com/api/setup/admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "nombre": "Administrador",
    "password": "admin123"
  }'
```
- [ ] Admin creado exitosamente

---

### Parte 2: Deploy del Frontend en Netlify

#### 2.1 Actualizar Configuración Local
✅ **Ya configurado:**
- [x] `frontend/.env.production` → `VITE_API_URL=https://proyecto-realprint.onrender.com/api`

#### 2.2 Crear Sitio en Netlify
- [ ] Ir a Netlify Dashboard
- [ ] "Add new site" > "Import an existing project"
- [ ] Conectar repositorio Git
- [ ] Configurar build (debería autodetectar `netlify.toml`):
  ```
  Base directory: frontend
  Build command: npm ci && npm run build
  Publish directory: frontend/dist
  ```

#### 2.3 Configurar Variables de Entorno
En Netlify (Site settings > Environment variables):

**OBLIGATORIA:**
- [ ] `VITE_API_URL` → `https://proyecto-realprint.onrender.com/api`

**Verificar (ya están en .env.production):**
- [ ] `VITE_USE_LOCAL_AUTH` → `false`
- [ ] Todas las `VITE_USE_*_SERVICE_*` → `true`

#### 2.4 Deploy y Verificación
- [ ] Hacer deploy
- [ ] Esperar build (~2-5 min)
- [ ] Tu URL será: `https://app-realprint.netlify.app`
- [ ] Abrir la URL en el navegador
- [ ] Verificar que carga sin errores

---

### Parte 3: Conectar Frontend y Backend

#### 3.1 Actualizar CORS en Backend
- [ ] Ir a Render > tu-backend > Environment
- [ ] Configurar `CORS_ALLOWED_ORIGINS` → `https://app-realprint.netlify.app`
- [ ] Guardar cambios (redeploy automático del backend)

#### 3.2 Verificar Conectividad
- [ ] Abrir frontend en Netlify
- [ ] Abrir DevTools (F12) > Network
- [ ] Intentar login con usuario admin
- [ ] Verificar que las peticiones van a Render
- [ ] Verificar que NO hay errores CORS
- [ ] Login exitoso ✅

---

## 🚨 Troubleshooting Común

### Backend no levanta
1. Revisar logs en Render Dashboard
2. Verificar que DATABASE_URL está configurado
3. Verificar que JWT_SECRET tiene mínimo 32 caracteres

### CORS errors
1. Verificar URL en `CORS_ALLOWED_ORIGINS` (sin trailing slash)
2. Hacer redeploy del backend después de cambiar
3. Limpiar cache del navegador

### Frontend no conecta
1. Verificar `VITE_API_URL` en Netlify
2. Verificar que backend esté funcionando
3. Ver Network tab en DevTools

### Build falla en Netlify
1. Verificar que `package-lock.json` está commiteado
2. Limpiar cache: Deploys > Trigger deploy > Clear cache and deploy

### Primera request tarda mucho
- Normal en Render free tier (el servicio "duerme")
- Primera request despierta el servicio (~30 segundos)

---

## 📚 Documentación Adicional

- **Configuración de Render:** Ver `RENDER_CONFIG.md`
- **Configuración de Netlify:** Ver `NETLIFY_CONFIG.md`

---

## ✅ Deploy Completo

Si todos los checkboxes están marcados:
- ✅ Backend funcionando en Render
- ✅ Frontend funcionando en Netlify
- ✅ Ambos comunicándose correctamente
- ✅ Login funcional

**¡Felicidades! Tu aplicación está en producción** 🎉