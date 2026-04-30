@echo off
REM Script de limpieza del Backend - Elimina archivos innecesarios
REM Este script debe ejecutarse desde el directorio raíz del proyecto

setlocal enabledelayedexpansion

echo ====================================================================
echo  LIMPIEZA DE ARCHIVOS INNECESARIOS - REALPRINT BACKEND
echo ====================================================================
echo.

set "FILE1=realprint-backend\src\main\java\com\realprint\realprintbackend\controller\TestSecurityController.java"
set "FILE2=realprint-backend\src\main\java\com\realprint\realprintbackend\config\DataSeeder.java"

echo [1] Verificando archivos a eliminar...
echo.

if exist "%FILE1%" (
    echo ✓ Encontrado: %FILE1%
) else (
    echo ✗ No encontrado: %FILE1%
)

if exist "%FILE2%" (
    echo ✓ Encontrado: %FILE2%
) else (
    echo ✗ No encontrado: %FILE2%
)

echo.
echo ====================================================================
echo [2] Eliminando archivos innecesarios...
echo ====================================================================
echo.

if exist "%FILE1%" (
    echo [*] Eliminando TestSecurityController.java...
    del /Q "%FILE1%"
    if exist "%FILE1%" (
        echo ✗ ERROR: No se pudo eliminar %FILE1%
        exit /b 1
    ) else (
        echo ✓ TestSecurityController.java eliminado correctamente
    )
) else (
    echo ⚠  TestSecurityController.java ya no existe
)

if exist "%FILE2%" (
    echo [*] Eliminando DataSeeder.java...
    del /Q "%FILE2%"
    if exist "%FILE2%" (
        echo ✗ ERROR: No se pudo eliminar %FILE2%
        exit /b 1
    ) else (
        echo ✓ DataSeeder.java eliminado correctamente
    )
) else (
    echo ⚠  DataSeeder.java ya no existe
)

echo.
echo ====================================================================
echo [3] Compilando Backend para verificar...
echo ====================================================================
echo.

cd realprint-backend

echo [*] Ejecutando: mvn clean compile -q

call mvn clean compile -q

if %ERRORLEVEL% EQU 0 (
    echo ✓ Backend compila correctamente
) else (
    echo ✗ ERROR: Backend no compila. Verificar errores arriba
    cd ..
    exit /b 1
)

cd ..

echo.
echo ====================================================================
echo ✓ LIMPIEZA COMPLETADA EXITOSAMENTE
echo ====================================================================
echo.
echo Pasos siguientes:
echo  1. Ejecutar: mvn test -q (en directorio realprint-backend)
echo  2. Ejecutar: mvn clean package -DskipTests (en realprint-backend)
echo  3. Iniciar Backend: java -jar target/realprint-backend-0.0.1-SNAPSHOT.jar
echo  4. Iniciar Frontend: npm run dev (en directorio App-RealPrint)
echo  5. Probar nuevos endpoints: GET http://localhost:8080/api/usuarios
echo.

pause

