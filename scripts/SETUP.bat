@echo off
REM ============================================================================
REM RealPrint - Setup Initial (MEJORADO)
REM ============================================================================
REM Setup completo: verifica requisitos, inicia Docker, instala dependencias
REM Ejecutar desde: scripts\SETUP.bat

setlocal enabledelayedexpansion

echo.
echo ============================================================================
echo           RealPrint - Setup Inicial
echo ============================================================================
echo.

REM Verificar Java
echo [*] Verificando Java 17+...
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Java no encontrado
    echo Descargalo desde: https://adoptopenjdk.net/
    pause
    exit /b 1
)
echo [OK] Java encontrado

REM Verificar Maven
echo [*] Verificando Maven 3.8+...
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Maven no encontrado
    echo Descargalo desde: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)
echo [OK] Maven encontrado

REM Verificar Node.js
echo [*] Verificando Node.js 18+...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no encontrado
    echo Descargalo desde: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=1" %%i in ('node -v') do (
    set NODE_VERSION=%%i
    echo [OK] Node.js encontrado: !NODE_VERSION!
)

REM Verificar Docker
echo [*] Verificando Docker...
docker ps >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker no disponible
    echo Instala Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo [OK] Docker disponible

echo.
echo ============================================================================
echo           Iniciando MySQL en Docker...
echo ============================================================================
echo.

cd /d "%~dp0..\docker"
docker-compose up -d
if %errorlevel% neq 0 (
    echo [ERROR] Falló docker-compose
    pause
    exit /b 1
)

echo [INFO] MySQL iniciando... esperando 15 segundos para que esté listo
timeout /t 15 /nobreak

echo [OK] MySQL iniciado en Docker

echo.
echo ============================================================================
echo           Instalando dependencias del Backend...
echo ============================================================================
echo.

cd /d "%~dp0..\backend"
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo [ERROR] Falló la instalación de dependencias del backend
    pause
    exit /b 1
)
echo [OK] Dependencias del backend instaladas

echo.
echo ============================================================================
echo           Instalando dependencias del Frontend...
echo ============================================================================
echo.

cd /d "%~dp0..\frontend"
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Falló npm install
    pause
    exit /b 1
)
echo [OK] Dependencias del frontend instaladas

echo.
echo ============================================================================
echo           Setup Completado Exitosamente
echo ============================================================================
echo.
echo Próximos pasos:
echo.
echo 1. Para iniciar todo:
echo    - Ejecuta: scripts\START_ALL.bat
echo.
echo 2. O inicia por separado:
echo    - Backend:  scripts\START_BACKEND.bat
echo    - Frontend: scripts\START_FRONTEND.bat
echo.
echo URLs:
echo    - Frontend:  http://localhost:5173
echo    - Backend:   http://localhost:8080/api
echo    - MySQL:     localhost:3306 (root / root123)
echo.
echo Usuarios de prueba:
echo    - admin / admin123
echo    - cliente1 / cliente123
echo.
pause
