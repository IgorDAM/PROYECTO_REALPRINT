# Configuración de Deploy del Frontend en Azure Static Web Apps

## Recurso Azure

- **Resource group**: `realprint-rg`
- **Static Web App**: `realprint-frontend` (plan Free)
- **URL**: https://brave-desert-082e32103.7.azurestaticapps.net

## Variable de Build Requerida

El build del frontend (Vite) necesita saber a qué backend llamar en tiempo de compilación:

```
VITE_API_URL=https://realprint-backend.politepebble-bca8a1b2.westeurope.azurecontainerapps.io/api
```

Esta variable **no vive en el repositorio** (antes se configuraba en el panel de Netlify); ahora se pasa como `env:` al paso de deploy en `.github/workflows/ci-cd.yml`, ya que Azure Static Web Apps compila el proyecto con Oryx durante la propia Action:

```yaml
- name: Deploy to Azure Static Web Apps
  uses: azure/static-web-apps-deploy@v1
  env:
    VITE_API_URL: https://realprint-backend.politepebble-bca8a1b2.westeurope.azurecontainerapps.io/api
  with:
    azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
    repo_token: ${{ secrets.GITHUB_TOKEN }}
    action: upload
    app_location: /frontend
    output_location: dist
```

> Si cambias la URL del backend, actualiza este `env:` y vuelve a hacer push a `main` — Oryx reconstruye el frontend con el nuevo valor.

## Secret de despliegue

`AZURE_STATIC_WEB_APPS_API_TOKEN` (repository secret de GitHub) — se obtiene con:
```bash
az staticwebapp secrets list --name realprint-frontend --resource-group realprint-rg --query "properties.apiKey" -o tsv
```

## Deploy

Es automático: cualquier push a `main` dispara `.github/workflows/ci-cd.yml`, que construye y publica el frontend en Static Web Apps sin pasos manuales (a diferencia del backend).

## Post-Deploy

### 1. Actualizar CORS en el Backend
Si cambia la URL del frontend, actualiza `CORS_ALLOWED_ORIGINS` en el Container App — ver [AZURE_BACKEND_ENV_VARS.md](./AZURE_BACKEND_ENV_VARS.md).

### 2. Probar la Aplicación
1. Accede a https://brave-desert-082e32103.7.azurestaticapps.net
2. Intenta hacer login (`admin` / `admin123`)
3. Verifica que las llamadas van al backend de Container Apps (DevTools > Network)

## Troubleshooting

### "Failed to fetch" al hacer login
Causa más probable: `VITE_API_URL` no se pasó al build, o el backend está "dormido" (cold start) y tarda en responder. Verifica el bundle compilado:
```bash
curl -s https://brave-desert-082e32103.7.azurestaticapps.net | grep -o 'src="[^"]*\.js"'
curl -s https://brave-desert-082e32103.7.azurestaticapps.net/assets/<bundle>.js | grep -o 'azurecontainerapps.io[^"]*'
```
Si no aparece la URL del backend, el build se hizo sin `VITE_API_URL` — revisa el `env:` del step de deploy y vuelve a pushear.

### Build falla en GitHub Actions
- Revisa el job "Test Frontend" (lint, typecheck, build) en Actions.
- Asegúrate de que `package-lock.json` está commiteado.

### CORS errors
- Verifica `CORS_ALLOWED_ORIGINS` en el backend (sin trailing slash).
- Aplica el cambio con `az containerapp update --set-env-vars ...` (los cambios de env var sí se aplican solos, a diferencia de la imagen).

### 404 en rutas de React Router
Azure Static Web Apps necesita `staticwebapp.config.json` con fallback a `index.html` si usas rutas anidadas — revisar si el proyecto lo necesita (Vite + React Router).
