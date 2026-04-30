@echo off
REM ============================================================================
REM RealPrint - Abrir proyecto en IDE
REM ============================================================================
REM Abre el proyecto en el IDE detectado (VS Code / IntelliJ)

setlocal enabledelayedexpansion

echo.
echo ============================================================================
echo           RealPrint - Abrir en IDE
echo ============================================================================
echo.

REM Detectar VS Code
where code >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] VS Code detectado
    set /p choice="Abrir en VS Code? (S/N): "
    if /i "%choice%"=="S" (
        code .
        exit /b 0
    )
)

REM Detectar IntelliJ
if exist "C:\Program Files\JetBrains\IntelliJ IDEA*\bin\idea64.exe" (
    echo [OK] IntelliJ IDEA detectado
    set /p choice="Abrir en IntelliJ IDEA? (S/N): "
    if /i "%choice%"=="S" (
        start "" "C:\Program Files\JetBrains\IntelliJ IDEA Community Edition\bin\idea64.exe" .
        exit /b 0
    )
)

echo [INFO] No se detectaron IDEs instalados
echo Opciones:
echo   - Visual Studio Code: https://code.visualstudio.com/
echo   - IntelliJ IDEA: https://www.jetbrains.com/idea/

pause
