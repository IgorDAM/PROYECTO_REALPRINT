# Checklist de Deploy - RealPrint (Azure)

## Resumen de Infraestructura

✅ **Backend en Azure Container Apps** (plan consumo, grant gratuito mensual, `min-replicas: 0`)
✅ **Frontend en Azure Static Web Apps** (plan Free)
✅ **Base de datos MySQL en Aiven** (plan Free)
✅ **Backend configurado para MySQL** en producción (antes PostgreSQL en Render)
✅ **CORS configurado** vía variable de entorno del Container App
✅ **Alerta de presupuesto** de 1€/mes en el resource group `realprint-rg`
✅ **Coste esperado: 0€**

---

## 📋 Checklist de Deploy

### Parte 1: Recursos Azure

#### 1.1 Resource group y entorno de Container Apps
- [ ] `az group create --name realprint-rg --location westeurope`
- [ ] `az containerapp env create --name realprint-env --resource-group realprint-rg --location westeurope`

#### 1.2 Base de datos MySQL en Aiven
- [ ] Crear cuenta en https://aiven.io/free-mysql-database (sin tarjeta)
- [ ] Crear servicio MySQL, plan Free
- [ ] Anotar: host, puerto, usuario (`avnadmin`), password, nombre de BD (`defaultdb`)

#### 1.3 Crear la Container App del backend
- [ ] `az containerapp create` con imagen `ghcr.io/igordam/proyecto_realprint-backend:main` (ver [AZURE_BACKEND_CONFIG.md](./AZURE_BACKEND_CONFIG.md))
- [ ] Variables/secrets: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (secret), `JWT_SECRET` (secret), `SPRING_PROFILE=production`, `SERVER_CONTEXT_PATH=/api`, `CORS_ALLOWED_ORIGINS`

#### 1.4 Crear la Static Web App del frontend
- [ ] `az staticwebapp create --name realprint-frontend --resource-group realprint-rg --sku Free`
- [ ] Obtener el token: `az staticwebapp secrets list --name realprint-frontend --resource-group realprint-rg`

#### 1.5 Presupuesto de seguridad
- [ ] Crear budget de 1€/mes en `realprint-rg` con alerta al 50% (ver comando en `AZURE_BACKEND_CONFIG.md` histórico o Azure Portal > Cost Management)

---

### Parte 2: GitHub

#### 2.1 Secrets del repositorio
- [ ] `AZURE_STATIC_WEB_APPS_API_TOKEN` (del paso 1.4)
- [ ] Hacer público el paquete GHCR del backend: GitHub → Packages → `proyecto_realprint-backend` → Package settings → Change visibility → Public

#### 2.2 Verificar `.github/workflows/ci-cd.yml`
- [ ] Job `deploy-frontend` con `env: VITE_API_URL` apuntando al backend
- [ ] Job `deploy-backend` documentado como manual (el tenant no permite service principals)

#### 2.3 Deploy y Verificación
- [ ] Push a `main` → pipeline verde (tests, build, push de imágenes, deploy automático del frontend)
- [ ] Aplicar el backend manualmente:
  ```bash
  az containerapp update --name realprint-backend --resource-group realprint-rg \
    --image ghcr.io/igordam/proyecto_realprint-backend:main
  ```
- [ ] Verificar salud: `curl https://realprint-backend.politepebble-bca8a1b2.westeurope.azurecontainerapps.io/api/actuator/health`

---

### Parte 3: Verificar Conectividad Frontend ↔ Backend

- [ ] Abrir https://brave-desert-082e32103.7.azurestaticapps.net
- [ ] DevTools (F12) > Network
- [ ] Login con `admin` / `admin123`
- [ ] Verificar que las peticiones van al backend de Container Apps
- [ ] Verificar que NO hay errores CORS
- [ ] Login exitoso ✅

---

## 🚨 Troubleshooting Común

Ver documentos específicos:
- Backend / Container Apps → [AZURE_BACKEND_CONFIG.md](./AZURE_BACKEND_CONFIG.md)
- Frontend / Static Web Apps → [AZURE_FRONTEND_CONFIG.md](./AZURE_FRONTEND_CONFIG.md)
- Cold start / arranque lento → [COLD_START_TROUBLESHOOTING.md](./COLD_START_TROUBLESHOOTING.md)

---

## 📚 Documentación Adicional

- **Configuración del backend:** Ver `AZURE_BACKEND_CONFIG.md` y `AZURE_BACKEND_ENV_VARS.md`
- **Configuración del frontend:** Ver `AZURE_FRONTEND_CONFIG.md`

---

## ✅ Deploy Completo

Si todos los checkboxes están marcados:
- ✅ Backend funcionando en Azure Container Apps
- ✅ Frontend funcionando en Azure Static Web Apps
- ✅ Base de datos funcionando en Aiven
- ✅ Ambos comunicándose correctamente
- ✅ Login funcional
- ✅ Coste real: 0€

**¡Felicidades! Tu aplicación está en producción** 🎉
