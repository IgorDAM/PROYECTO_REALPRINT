@echo off
REM ============================================================================
REM RealPrint - Start Frontend (MEJORADO)
REM ============================================================================
REM Inicia el frontend en modo desarrollo (React + Vite)
REM Ejecutar desde: scripts\START_FRONTEND.bat

setlocal enabledelayedexpansion

echo.
echo ============================================================================
echo           RealPrint Frontend - Iniciando...
echo ============================================================================
echo.

REM Verificar que Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no encontrado
    echo Descargalo desde: https://nodejs.org/ ^(versión 18+^)
    pause
    exit /b 1
)

for /f "tokens=1" %%i in ('node -v') do (
    set NODE_VERSION=%%i
    echo [OK] Node.js encontrado: !NODE_VERSION!
)

REM Cambiar a directorio del frontend
cd /d "%~dp0..\frontend"

if not exist "package.json" (
    echo [ERROR] package.json no encontrado en %cd%
    pause
    exit /b 1
)

echo [INFO] Directorio: %cd%
echo.

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo ============================================================================
    echo           Instalando dependencias del frontend...
    echo ============================================================================
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install falló
        pause
        exit /b 1
    )
)

echo.
echo ============================================================================
echo           Iniciando servidor de desarrollo (Vite)...
echo ============================================================================
echo.
echo [INFO] Frontend estará disponible en: http://localhost:5173
echo [INFO] Backend debe estar en: http://localhost:8080/api
echo [INFO] Presiona Ctrl+C para detener
echo.

REM Ejecutar Vite en modo desarrollo
call npm run dev

pause
