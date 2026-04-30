@echo off
REM ============================================================================
REM RealPrint - Start All (Backend + Frontend)
REM ============================================================================
REM Abre dos ventanas de terminal: una para backend, otra para frontend
REM Ejecutar desde: scripts\START_ALL.bat

setlocal enabledelayedexpansion

echo.
echo ============================================================================
echo           RealPrint - Iniciando Sistema Completo
echo ============================================================================
echo.

REM Verificar Docker
echo [*] Verificando Docker...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker no está disponible
    echo   - Instala Docker Desktop: https://www.docker.com/products/docker-desktop
    echo   - O verifica que Docker está corriendo
    echo.
    pause
    exit /b 1
)
echo [OK] Docker disponible

REM Verificar/Iniciar MySQL en Docker
echo [*] Verificando MySQL en Docker...
docker ps | findstr realprint-mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Iniciando MySQL en Docker...
    cd /d "%~dp0..\docker"
    docker-compose up -d
    if %errorlevel% neq 0 (
        echo [ERROR] Falló al iniciar Docker Compose
        pause
        exit /b 1
    )
    echo [INFO] MySQL iniciando... esperando 15 segundos
    timeout /t 15 /nobreak
    cd /d "%~dp0"
)
echo [OK] MySQL está corriendo en Docker (realprint-mysql)

REM Verificar Java
echo [*] Verificando Java...
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Java no encontrado
    pause
    exit /b 1
)
echo [OK] Java encontrado

REM Verificar Node.js
echo [*] Verificando Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no encontrado
    pause
    exit /b 1
)
echo [OK] Node.js encontrado

echo.
echo [INFO] Iniciando Backend en nueva ventana...
start "RealPrint Backend" cmd /k "%~dp0START_BACKEND.bat"

echo [INFO] Esperando 3 segundos...
timeout /t 3 /nobreak

echo [INFO] Iniciando Frontend en nueva ventana...
start "RealPrint Frontend" cmd /k "%~dp0START_FRONTEND.bat"

echo.
echo ============================================================================
echo           Sistema iniciado exitosamente
echo ============================================================================
echo.
echo Backend:  http://localhost:8080/api
echo Frontend: http://localhost:5173
echo MySQL:    localhost:3306 (usuario: root, contraseña: root123)
echo.
echo Abre el navegador en: http://localhost:5173
echo.
echo Usuarios de prueba:
echo   - admin / admin123
echo   - cliente1 / cliente123
echo.
echo Presiona cualquier tecla para cerrar esta ventana
echo.
pause
