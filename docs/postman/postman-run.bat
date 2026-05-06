@echo off
REM Script para ejecutar la colección Postman de RealPrint con Newman
REM Uso: postman-run.bat [--report] [--bail]

setlocal enabledelayedexpansion

REM Verificar que Newman está instalado
where newman >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo[
    echo ❌ Newman no está instalado.
    echo[
    echo Instálalo con:
    echo    npm install -g newman
    echo[
    exit /b 1
)

REM Variables
set "COLLECTION=docs\postman\RealPrint.postman_collection.json"
set "ENVIRONMENT=docs\postman\RealPrint.postman_environment.json"
set "REPORTER=cli"
set "BAIL="

REM Procesar argumentos
:parse_args
if "%~1"=="" goto run_newman
if "%~1"=="--report" (
    set "REPORTER=cli,junit,html"
    set "REPORT_ARGS=--reporter-junit-export newman-junit-results.xml --reporter-html-export newman-report.html"
    shift
    goto parse_args
)
if "%~1"=="--bail" (
    set "BAIL=--bail"
    shift
    goto parse_args
)
shift
goto parse_args

:run_newman
echo[
echo 🚀 Ejecutando colección Postman: RealPrint API
echo 📍 Colección: %COLLECTION%
echo 📍 Environment: %ENVIRONMENT%
echo[

newman run "%COLLECTION%" ^
  -e "%ENVIRONMENT%" ^
  --delay-request 200 ^
  --timeout-request 10000 ^
  --reporters %REPORTER% ^
  %REPORT_ARGS% ^
  %BAIL%

if %ERRORLEVEL% EQU 0 (
    echo[
    echo ✅ Ejecución completada exitosamente
    if "%REPORTER%"=="cli,junit,html" (
        echo 📊 Reportes generados:
        echo    - newman-junit-results.xml
        echo    - newman-report.html
    )
) else (
    echo[
    echo ❌ Ejecución fallida
    exit /b 1
)

endlocal

