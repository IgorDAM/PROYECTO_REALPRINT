@echo off
REM Script para iniciar RealPrint (Backend + Frontend)
REM Uso: Ejecutar este archivo en Windows

echo.
echo ======================================
echo   Iniciando RealPrint
echo   Backend: localhost:8080
echo   Frontend: localhost:5173
echo ======================================
echo.

echo [1/2] Compilando Backend...
cd /d D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\realprint-backend
call mvn clean compile -q
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo compilar backend
    pause
    exit /b 1
)
echo ✓ Backend compilado

echo.
echo [2/2] Iniciando servicios...
echo.
echo Terminal 1: Backend corriendo en localhost:8080
start cmd /k "cd /d D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\realprint-backend && mvn spring-boot:run"

echo.
echo Esperando 8 segundos para que backend inicie...
timeout /t 8 /nobreak

echo.
echo Terminal 2: Frontend corriendo en localhost:5173
start cmd /k "cd /d D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\App-RealPrint && npm run dev"

echo.
echo ======================================
echo   ✓ Servicios iniciando
echo ======================================
echo.
echo Abre navegador: http://localhost:5173
echo.
echo Para ver logs:
echo  - Backend: primera ventana (port 8080)
echo  - Frontend: segunda ventana (port 5173)
echo.
pause

