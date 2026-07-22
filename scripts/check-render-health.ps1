#!/usr/bin/env pwsh
# Script para verificar el estado del backend en Render
# Uso: .\check-render-health.ps1

Write-Host "🔍 Verificando estado del backend en Render..." -ForegroundColor Cyan
Write-Host ""

$BACKEND_URL = "https://proyecto-realprint.onrender.com/api"
$HEALTH_ENDPOINT = "$BACKEND_URL/health"
$DATABASE_HEALTH_ENDPOINT = "$BACKEND_URL/health/db"
$ACTUATOR_ENDPOINT = "$BACKEND_URL/actuator/health"

Write-Host "📍 Backend URL: $BACKEND_URL" -ForegroundColor Yellow
Write-Host ""

# 1. Health check ligero del backend
Write-Host "1️⃣ Verificando health check ligero del backend..." -ForegroundColor Cyan
try {
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $response = Invoke-WebRequest -Uri $HEALTH_ENDPOINT -TimeoutSec 180 -SkipHttpErrorCheck
    $stopwatch.Stop()

    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend respondió: $($response.StatusCode) en $($stopwatch.ElapsedMilliseconds)ms" -ForegroundColor Green
        Write-Host "📄 Respuesta: $($response.Content)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Backend respondió pero con código: $($response.StatusCode)" -ForegroundColor Yellow
        Write-Host "📄 Respuesta: $($response.Content)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error conectando al backend: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Posible causa: Cold start (servidor hibernado)" -ForegroundColor Gray
}

Write-Host ""

# 2. Health check de BD
Write-Host "2️⃣ Verificando health check de BD..." -ForegroundColor Cyan
try {
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $response = Invoke-WebRequest -Uri $DATABASE_HEALTH_ENDPOINT -TimeoutSec 180 -SkipHttpErrorCheck
    $stopwatch.Stop()

    if ($response.StatusCode -eq 200) {
        Write-Host "✅ BD respondió: $($response.StatusCode) en $($stopwatch.ElapsedMilliseconds)ms" -ForegroundColor Green
        Write-Host "📄 Respuesta: $($response.Content)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ BD respondió pero con código: $($response.StatusCode)" -ForegroundColor Yellow
        Write-Host "📄 Respuesta: $($response.Content)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error conectando a BD: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Posible causa: BD desconectada o todavía arrancando" -ForegroundColor Gray
}

Write-Host ""

# 3. Health check general
Write-Host "3️⃣ Verificando health check general..." -ForegroundColor Cyan
try {
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $response = Invoke-WebRequest -Uri $ACTUATOR_ENDPOINT -TimeoutSec 60 -SkipHttpErrorCheck
    $stopwatch.Stop()

    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Servidor respondió: $($response.StatusCode) en $($stopwatch.ElapsedMilliseconds)ms" -ForegroundColor Green
        $content = $response.Content | ConvertFrom-Json
        Write-Host "📊 Estado: $($content.status)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Servidor respondió pero con código: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error conectando a servidor: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Posible causa: Servidor hibernado o caído" -ForegroundColor Gray
}

Write-Host ""

# 4. Información de diagnóstico
Write-Host "4️⃣ Diagnóstico:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Posibles causas de fallo:" -ForegroundColor Yellow
Write-Host "  • ❄️ Cold start: Servidor hibernado por inactividad (normal en plan gratuito)"
Write-Host "  • 🗄️  BD desconectada en Render"
Write-Host "  • 🌐 Problemas de conectividad con Render"
Write-Host "  • 🔧 Servidor completamente caído"
Write-Host ""

Write-Host "Soluciones recomendadas:" -ForegroundColor Green
Write-Host "  1. Espera 1-2 minutos y vuelve a intentar (posible cold start)"
Write-Host "  2. Verifica Render Dashboard: https://dashboard.render.com/"
Write-Host "  3. Comprueba que PostgreSQL esté levantado"
Write-Host "  4. Si persiste, reinicia el servicio manualmente"
Write-Host ""

Write-Host "📌 Test desde app oficial:" -ForegroundColor Cyan
Write-Host "  Accede a: https://app-realprint.netlify.app/" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Verificación completada" -ForegroundColor Green
