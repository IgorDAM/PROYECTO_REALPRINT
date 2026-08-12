#!/bin/sh
# Aplica la ultima imagen publicada en GHCR al backend de Azure Container Apps.
# Uso: ./scripts/redeploy-backend.sh
set -e

IMAGE="ghcr.io/igordam/proyecto_realprint-backend:main"
APP="realprint-backend"
RG="realprint-rg"
HEALTH_URL="https://realprint-backend.politepebble-bca8a1b2.westeurope.azurecontainerapps.io/api/actuator/health"

echo "Aplicando $IMAGE al Container App '$APP'..."
az containerapp update --name "$APP" --resource-group "$RG" --image "$IMAGE"

echo "Esperando arranque..."
sleep 15

for i in 1 2 3 4 5 6; do
  code=$(curl -sS -m 20 -o /dev/null -w "%{http_code}" "$HEALTH_URL" || true)
  if [ "$code" = "200" ]; then
    echo "Backend OK (HTTP 200)."
    exit 0
  fi
  echo "[$i] Todavia no responde (HTTP $code), reintentando..."
  sleep 10
done

echo "Aviso: el backend no respondio 200 tras varios intentos. Revisa los logs:"
echo "  az containerapp logs show --name $APP --resource-group $RG --tail 50"
exit 1
