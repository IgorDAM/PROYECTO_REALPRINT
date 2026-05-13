# Configuración de Deploy en Netlify

## Variables de Entorno Requeridas

Configura estas variables en Netlify (Site settings > Environment variables):

### API Backend (REQUERIDO)
```
VITE_API_URL=https://tu-backend.onrender.com/api
```
**IMPORTANTE:** Después de desplegar en Render, agrega aquí la URL exacta de tu backend.

### Otras Variables
```
VITE_API_TIMEOUT=10000
VITE_USE_LOCAL_AUTH=false
VITE_USE_PEDIDOS_SERVICE_CREATE=true
VITE_USE_PEDIDOS_SERVICE_UPDATE=true
VITE_USE_PEDIDOS_SERVICE_DELETE=true
VITE_USE_INVENTARIO_SERVICE_CREATE=true
VITE_USE_INVENTARIO_SERVICE_UPDATE=true
VITE_USE_INVENTARIO_SERVICE_DELETE=true
VITE_USE_USUARIOS_SERVICE_CREATE=true
VITE_USE_USUARIOS_SERVICE_UPDATE=true
VITE_USE_USUARIOS_SERVICE_DELETE=true
```
**Nota:** Estas variables ya están definidas en `.env.production`, pero puedes sobrescribirlas aquí si necesitas valores diferentes.

## Configuración del Sitio en Netlify

### Build Settings
- **Base directory:** `frontend`
- **Build command:** `npm ci && npm run build`
- **Publish directory:** `frontend/dist`
- **Branch:** `main`

### Deploy Settings
- **Auto-Deploy:** Activado para rama `main`
- **Build hooks:** Opcional (para triggers desde otros servicios)

## Pasos de Deploy

### 1. Conectar Repositorio
1. Ir a Netlify Dashboard
2. Click "Add new site" > "Import an existing project"
3. Conectar con tu repositorio Git (GitHub, GitLab, etc.)
4. Seleccionar el repositorio `PROYECTO_REALPRINT`

### 2. Configurar Build
Netlify detectará automáticamente `netlify.toml`, pero verifica:
- Base directory: `frontend`
- Build command: `npm ci && npm run build`
- Publish directory: `frontend/dist`

### 3. Configurar Variables de Entorno
**ANTES del primer deploy, configura:**
```
VITE_API_URL=https://tu-backend.onrender.com/api
```

### 4. Deploy
- Click "Deploy site"
- Netlify asignará una URL como: `https://random-name-123.netlify.app`
- Puedes cambiar el nombre en: Site settings > Domain management > Options > Edit site name

### 5. Configurar Dominio Personalizado (Opcional)
1. Site settings > Domain management
2. Add custom domain
3. Seguir instrucciones de DNS

## Post-Deploy

### 1. Actualizar CORS en Backend
Configura en Render (Environment variables):
```
CORS_ALLOWED_ORIGINS=https://app-realprint.netlify.app
```

### 2. Actualizar URL del Frontend
Si cambiaste el nombre del sitio, actualiza:
```
VITE_API_URL=https://tu-backend.onrender.com/api
```
Y haz redeploy.

### 3. Probar la Aplicación
1. Accede a tu URL de Netlify
2. Intenta hacer login
3. Verifica que las llamadas al backend funcionan

## Troubleshooting

### Build falla
- **Error de Node/npm:** Verifica versión en `package.json` engines
- **Error de dependencias:** Asegúrate que `package-lock.json` está commiteado
- **Error de build:** Revisa logs en Netlify Dashboard

### Variables de entorno no se leen
- Las variables `VITE_*` deben estar configuradas **ANTES** del build
- Si cambias una variable, necesitas hacer redeploy
- Verifica que el nombre tenga el prefijo `VITE_`

### CORS errors
- Verifica que `CORS_ALLOWED_ORIGINS` en Render sea: `https://app-realprint.netlify.app`
- Verifica que la URL no tenga trailing slash
- Ejemplo correcto: `https://app-realprint.netlify.app`

### 404 en rutas
- El archivo `netlify.toml` debe tener la configuración de redirects
- Verifica que existe la regla: `from = "/*"` → `to = "/index.html"`

### Frontend no conecta con backend
- Verifica `VITE_API_URL` en variables de entorno de Netlify
- Abre DevTools > Network para ver qué URL se está llamando
- Verifica que el backend esté desplegado y funcionando

## Comandos Útiles

### Ver build localmente
```bash
cd frontend
npm ci
npm run build
npm run preview
```

### Limpiar cache de Netlify
En el dashboard: Deploys > Trigger deploy > Clear cache and deploy

### Ver logs de producción
En el dashboard: Deploys > último deploy > Deploy log