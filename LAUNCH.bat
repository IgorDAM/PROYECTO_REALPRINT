@echo off
REM ============================================================================
REM RealPrint - Quick Launch
REM ============================================================================
REM Lanzador rápido desde raíz del proyecto
REM Ejecutar desde: LAUNCH.bat (en raíz)

:menu
cls
echo.
echo ============================================================================
echo                      RealPrint - Menu Principal
echo ============================================================================
echo.
echo [1] Inicio Rápido - Inicia Backend + Frontend
echo [2] Setup Inicial - Verifica requisitos e instala dependencias
echo [3] Backend Solo - Inicia solo el backend
echo [4] Frontend Solo - Inicia solo el frontend
echo [5] Limpieza - Borra builds, caches y node_modules
echo [6] Ver documentación (QUICK_START.md)
echo [0] Salir
echo.
set /p choice="Selecciona una opción (0-6): "

if "%choice%"=="1" goto start_all
if "%choice%"=="2" goto setup
if "%choice%"=="3" goto backend
if "%choice%"=="4" goto frontend
if "%choice%"=="5" goto clean
if "%choice%"=="6" goto docs
if "%choice%"=="0" goto exit_menu

echo [ERROR] Opción inválida
timeout /t 2 >nul
goto menu

:start_all
call scripts\START_ALL.bat
goto menu

:setup
call scripts\SETUP.bat
goto menu

:backend
call scripts\START_BACKEND.bat
goto menu

:frontend
call scripts\START_FRONTEND.bat
goto menu

:clean
call scripts\CLEAN.bat
goto menu

:docs
start "" QUICK_START.md
goto menu

:exit_menu
exit /b 0
