@echo off
REM ============================================================================
REM RealPrint - Clean & Reset
REM ============================================================================
REM Limpia builds, caches y logs
REM Ejecutar desde: scripts\CLEAN.bat

setlocal enabledelayedexpansion

echo.
echo ============================================================================
echo           RealPrint - Limpiar & Resetear
echo ============================================================================
echo.

set /p confirm="^!Esto eliminará builds, caches y node_modules^! ^(S/N^): "
if /i not "%confirm%"=="S" (
    echo Cancelado.
    exit /b 0
)

echo.
echo [*] Limpiando Backend...
cd /d "%~dp0..\backend"
if exist "target" rmdir /s /q "target" >nul 2>&1
echo [OK] Backend limpio

echo.
echo [*] Limpiando Frontend...
cd /d "%~dp0..\frontend"
if exist "node_modules" rmdir /s /q "node_modules" >nul 2>&1
if exist "dist" rmdir /s /q "dist" >nul 2>&1
echo [OK] Frontend limpio

echo.
echo [*] Limpiando logs...
cd /d "%~dp0..\backend"
if exist "backend.log" del /q "backend.log" >nul 2>&1
echo [OK] Logs limpios

echo.
echo ============================================================================
echo           Limpieza completada
echo ============================================================================
echo.
echo Próximo paso: ejecuta SETUP.bat para reinstalar dependencias
echo.
pause
