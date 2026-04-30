@echo off
REM ============================================================================
REM RealPrint - Start Backend (MEJORADO)
REM ============================================================================
REM Inicia el backend en Spring Boot (Java 17 + Maven)
REM Ejecutar desde: scripts\START_BACKEND.bat

setlocal enabledelayedexpansion

echo.
echo ============================================================================
echo           RealPrint Backend - Iniciando...
echo ============================================================================
echo.

REM Verificar que Maven está instalado
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Maven no encontrado en PATH
    echo Descargalo desde: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

REM Verificar que Java está instalado
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Java no encontrado
    pause
    exit /b 1
)
echo [OK] Java y Maven encontrados

REM Verificar Docker (MySQL debe estar en Docker)
docker ps | findstr realprint-mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] MySQL no detectado en Docker
    echo Iniciando MySQL via docker-compose...
    cd /d "%~dp0..\docker"
    docker-compose up -d
    echo [INFO] Esperando 15 segundos para que MySQL esté listo...
    timeout /t 15 /nobreak
    cd /d "%~dp0..\backend"
)

REM Cambiar a directorio del backend
cd /d "%~dp0..\backend"

if not exist "pom.xml" (
    echo [ERROR] pom.xml no encontrado en %cd%
    pause
    exit /b 1
)

echo [INFO] Directorio: %cd%
echo [INFO] Iniciando backend en modo desarrollo...
echo.
echo ============================================================================
echo           Backend iniciando - Compilando...
echo ============================================================================
echo.

REM Ejecutar Maven spring-boot:run
mvn clean spring-boot:run

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Backend falló
    echo Verifica:
    echo   1. Docker está corriendo y MySQL está en docker (realprint-mysql)
    echo   2. Puerto 8080 no está en uso
    echo   3. No hay errores de compilación
    pause
    exit /b 1
)

echo.
echo [OK] Backend iniciado correctamente
echo Disponible en: http://localhost:8080/api
echo.
pause
