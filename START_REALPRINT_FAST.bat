@echo off
REM Script RÁPIDO para iniciar RealPrint con JAR precompilado
REM Uso: Ejecutar este archivo en Windows
REM VERSIÓN OPTIMIZADA: 10x más rápido que START_REALPRINT.bat

echo.
echo ========================================
echo   REALPRINT - STARTUP RÁPIDO v2
echo   Backend: localhost:8080
echo   Frontend: localhost:5173
echo ========================================
echo.

echo [1/3] Compilando Backend (generar JAR)...
cd /d D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\realprint-backend
call mvn clean package -q -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo compilar backend
    pause
    exit /b 1
)
echo Ok - JAR compilado
echo.

echo [2/3] Iniciando Backend (JAR en puerto 8080)...
start cmd /k "cd /d D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\realprint-backend && java -jar target/realprint-backend-0.0.1-SNAPSHOT.jar"

echo.
echo Esperando 15 segundos para que backend inicie...
timeout /t 15 /nobreak
echo.

echo [3/3] Iniciando Frontend (npm en puerto 5173)...
start cmd /k "cd /d D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\App-RealPrint && npm run dev"

echo.
echo ========================================
echo   OK - Servicios iniciando
echo ========================================
echo.
echo BACKEND: http://localhost:8080
echo FRONTEND: http://localhost:5173
echo.
echo Abre en navegador: http://localhost:5173
echo.
echo [Logs en las ventanas que se abrieron]
echo.
pause

