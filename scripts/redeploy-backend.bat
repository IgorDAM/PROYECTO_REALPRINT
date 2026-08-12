@echo off
REM Aplica la ultima imagen publicada en GHCR al backend de Azure Container Apps.
REM Uso: scripts\redeploy-backend.bat

set IMAGE=ghcr.io/igordam/proyecto_realprint-backend:main
set APP=realprint-backend
set RG=realprint-rg

echo Aplicando %IMAGE% al Container App '%APP%'...
call az containerapp update --name %APP% --resource-group %RG% --image %IMAGE%
if %errorlevel% neq 0 (
    echo [ERROR] Fallo el redeploy. Revisa el mensaje de az cli arriba.
    exit /b 1
)

echo Hecho. Comprueba la salud en unos segundos con:
echo   curl https://realprint-backend.politepebble-bca8a1b2.westeurope.azurecontainerapps.io/api/actuator/health
