@echo off
REM Diagnostico completo de descargas de archivos en RealPrint
REM Ejecutar este script si las descargas no funcionan

setlocal enabledelayedexpansion
cls

echo.
echo ============================================
echo    DIAGNOSTICO: Descargas de Archivos
echo ============================================
echo.

REM Verificar Backend
echo [PASO 1/5] Verificando Backend...
echo   Buscando archivos del backend...
if exist "realprint-backend\pom.xml" (
    echo   ✓ Proyecto Maven encontrado
) else (
    echo   ✗ ERROR: No encontré realprint-backend\pom.xml
    goto FALLO
)

REM Verificar Frontend
echo.
echo [PASO 2/5] Verificando Frontend...
if exist "App-RealPrint\package.json" (
    echo   ✓ Proyecto Node encontrado
) else (
    echo   ✗ ERROR: No encontré App-RealPrint\package.json
    goto FALLO
)

REM Verificar carpeta uploads
echo.
echo [PASO 3/5] Verificando carpeta de archivos...
if exist "realprint-backend\uploads" (
    echo   ✓ Carpeta uploads encontrada
    dir realprint-backend\uploads
) else (
    echo   ! Creando carpeta uploads...
    mkdir realprint-backend\uploads
    echo   ✓ Carpeta uploads creada
)

REM Verificar archivo de prueba
echo.
echo [PASO 4/5] Verificando archivo de prueba...
if exist "realprint-backend\uploads\test-download-file.pdf" (
    echo   ✓ Archivo de prueba existe
) else (
    echo   ! Creando archivo de prueba...
    (
        echo.
        echo PDF de prueba para descargas
    ) > "realprint-backend\uploads\test-download-file.pdf"
    echo   ✓ Archivo de prueba creado
)

REM Compilar Backend
echo.
echo [PASO 5/5] Compilando Backend...
cd realprint-backend
call mvn clean compile -q
if %ERRORLEVEL% NEQ 0 (
    echo   ✗ ERROR compilando backend
    goto FALLO
)
cd ..
echo   ✓ Backend compilado exitosamente

REM Resumen
echo.
echo ============================================
echo    ✓ DIAGNOSTICO COMPLETADO
echo ============================================
echo.
echo SIGUIENTE: Ejecuta START_REALPRINT.bat para iniciar servicios
echo.
echo Instrucciones:
echo   1. Haz doble-click en START_REALPRINT.bat
echo   2. Se abrirán 2 ventanas (Backend y Frontend)
echo   3. Espera a que aparezcan los URLs
echo   4. Abre http://localhost:5173 en navegador
echo   5. Login y prueba descargas
echo.
pause
goto FIN

:FALLO
echo.
echo ============================================
echo    ✗ ERRORES ENCONTRADOS
echo ============================================
echo.
echo Revisa los errores arriba y contacta soporte
echo.
pause

:FIN
endlocal

