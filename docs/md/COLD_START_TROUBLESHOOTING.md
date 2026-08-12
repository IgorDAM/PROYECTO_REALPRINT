# Cold Start - Guía de Troubleshooting (Azure)

## ¿Por qué la primera petición tarda?

No es un fallo de la aplicación. Tanto el backend (Azure Container Apps) como la base de datos (Aiven Free) están configurados para **apagarse tras inactividad**, como parte de la estrategia de coste 0€:

| Componente | Comportamiento |
|---|---|
| **Backend** (Container Apps, `min-replicas: 0`) | Se apaga sin tráfico. Arranca en 20-40s ante la primera petición. |
| **Base de datos** (Aiven Free) | Se apaga tras inactividad prolongada. Se reactiva sola al reconectar, puede tardar unos segundos extra. |

Esto sustituye al antiguo problema de cold start en Render — la causa es la misma filosofía (recursos gratuitos que escalan a cero), pero la infraestructura ha cambiado.

## 🔴 Síntoma Típico

```
curl: (28) Operation timed out after 20000 milliseconds with 0 bytes received
```
o en el navegador: `Failed to fetch` en el primer intento de login tras un rato sin uso.

## ✅ Acciones Sugeridas

### 1️⃣ Verificar Estado del Backend
```bash
az containerapp revision list --name realprint-backend --resource-group realprint-rg -o table
az containerapp logs show --name realprint-backend --resource-group realprint-rg --tail 50
```

### 2️⃣ Verificar Aiven
- Entra al dashboard de Aiven y comprueba que el servicio MySQL esté "Running".
- Si está "Powered off", una simple conexión desde el backend lo reactiva automáticamente.

### 3️⃣ Test Manual
```bash
# Primer intento puede tardar, reintenta a los 20-30s
curl -m 30 https://realprint-backend.politepebble-bca8a1b2.westeurope.azurecontainerapps.io/api/actuator/health
```

## 🔧 Ya no hay workflow de keep-alive

El antiguo `keep-alive.yml` (pings periódicos a Render) está desactivado (`.github/workflows/keep-alive.yml`, sin `schedule`, solo `workflow_dispatch`). No se ha sustituido por uno equivalente para Azure a propósito: mantener el backend "siempre despierto" consumiría más cuota gratuita mensual de Container Apps sin necesidad real para un proyecto académico. Si en el futuro el cold start resulta molesto para una demo, se puede:
- Subir `min-replicas` a 1 en el Container App (deja de haber cold start, pero consume grant gratuito de forma continua — seguiría siendo 0€ mientras no se supere el grant mensual).
- Reactivar un workflow de ping periódico similar al antiguo, apuntando a la nueva URL.

## ❓ ¿Qué hacer si el backend no responde tras varios intentos?

### Opción A: Revisar la revisión activa
```bash
az containerapp revision list --name realprint-backend --resource-group realprint-rg --query "[].{name:name, active:properties.active, runningState:properties.runningState}" -o table
```
Si el `runningState` es `Failed`, revisa los logs (paso 1) para ver el error de arranque.

### Opción B: Verificar variables de entorno
```bash
az containerapp show --name realprint-backend --resource-group realprint-rg --query "properties.template.containers[0].env"
```
Errores típicos: `DB_HOST`/`DB_PASSWORD` incorrectos, o `SERVER_CONTEXT_PATH` corrompido por conversión de rutas de Git Bash (ver `AZURE_BACKEND_CONFIG.md`).

### Opción C: Forzar un redeploy
```bash
az containerapp update --name realprint-backend --resource-group realprint-rg \
  --image ghcr.io/igordam/proyecto_realprint-backend:main
```

## 📊 Logs para Diagnosticar

```bash
az containerapp logs show --name realprint-backend --resource-group realprint-rg --tail 100
```
Busca líneas con `ERROR` o `Unable to start web server` (fallo de arranque) frente a simples logs de arranque lento (normal).

## 📝 Notas Importantes

> **⚠️ Esto es NORMAL:**
> - Que la primera petición tras un rato de inactividad tarde 20-40s.
> - Que la primera consulta a la BD tras inactividad tarde unos segundos más (Aiven reactivándose).

> **🚨 Esto NO es normal:**
> - Que el backend siga sin responder después de 1-2 minutos.
> - Que la revisión aparezca en estado `Failed` de forma persistente.
> - Ver `QuotaExceeded` en el estado del recurso (no debería pasar en Container Apps salvo uso muy por encima de lo esperado; si ocurre, revisar la alerta de presupuesto).
