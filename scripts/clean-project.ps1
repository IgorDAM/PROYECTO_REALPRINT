# =============================================================================
# Script de Limpieza del Proyecto RealPrint (PowerShell)
# =============================================================================
# Limpia archivos temporales, builds y artifacts de testing que no deben
# estar en el repositorio ni ocupar espacio en disco.
#
# Uso: .\scripts\clean-project.ps1
# =============================================================================

Write-Host "🧹 Limpiando proyecto RealPrint..." -ForegroundColor Cyan
Write-Host ""

# Obtener tamaño inicial
$initialSize = (Get-ChildItem -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
$initialSizeMB = [math]::Round($initialSize / 1MB, 2)
Write-Host "📊 Tamaño inicial: $initialSizeMB MB" -ForegroundColor White
Write-Host ""

$cleaned = 0

# Frontend
Write-Host "📦 Limpiando frontend..." -ForegroundColor Yellow
if (Test-Path "frontend\test-results") {
    Remove-Item -Recurse -Force "frontend\test-results" -ErrorAction SilentlyContinue
    Write-Host "  ✅ test-results eliminados" -ForegroundColor Green
    $cleaned++
} else {
    Write-Host "  ℹ️  test-results no existe" -ForegroundColor Gray
}

if (Test-Path "frontend\dist") {
    Remove-Item -Recurse -Force "frontend\dist" -ErrorAction SilentlyContinue
    Write-Host "  ✅ dist eliminado" -ForegroundColor Green
    $cleaned++
} else {
    Write-Host "  ℹ️  dist no existe" -ForegroundColor Gray
}

if (Test-Path "frontend\node_modules\.vite") {
    Remove-Item -Recurse -Force "frontend\node_modules\.vite" -ErrorAction SilentlyContinue
    Write-Host "  ✅ caché de vite eliminada" -ForegroundColor Green
    $cleaned++
}

Write-Host ""

# Backend
Write-Host "☕ Limpiando backend..." -ForegroundColor Yellow
if (Test-Path "backend\target") {
    Remove-Item -Recurse -Force "backend\target" -ErrorAction SilentlyContinue
    Write-Host "  ✅ target eliminado" -ForegroundColor Green
    $cleaned++
} else {
    Write-Host "  ℹ️  target no existe" -ForegroundColor Gray
}

if (Test-Path "backend\backend.log") {
    Remove-Item -Force "backend\backend.log" -ErrorAction SilentlyContinue
    Write-Host "  ✅ backend.log eliminado" -ForegroundColor Green
    $cleaned++
} else {
    Write-Host "  ℹ️  backend.log no existe" -ForegroundColor Gray
}

# Limpiar uploads pero mantener .gitkeep
if (Test-Path "backend\uploads") {
    $uploadFiles = Get-ChildItem "backend\uploads" -File | Where-Object { $_.Name -ne '.gitkeep' }
    if ($uploadFiles) {
        $uploadFiles | Remove-Item -Force -ErrorAction SilentlyContinue
        Write-Host "  ✅ $($uploadFiles.Count) archivo(s) de uploads eliminados" -ForegroundColor Green
        $cleaned++
    } else {
        Write-Host "  ℹ️  uploads ya está limpio" -ForegroundColor Gray
    }

    # Asegurar que existe .gitkeep
    if (-not (Test-Path "backend\uploads\.gitkeep")) {
        New-Item -ItemType File -Path "backend\uploads\.gitkeep" -Force | Out-Null
        Write-Host "  ✅ .gitkeep creado" -ForegroundColor Green
    }
}

Write-Host ""

# Git optimización
Write-Host "🗂️  Optimizando repositorio git..." -ForegroundColor Yellow
Write-Host "  ⏳ Ejecutando git gc (puede tardar unos segundos)..." -ForegroundColor Gray
try {
    git gc --quiet --prune=now 2>$null
    Write-Host "  ✅ git gc completado" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  git gc falló (no crítico)" -ForegroundColor DarkYellow
}

Write-Host ""

# Resumen final
$finalSize = (Get-ChildItem -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
$finalSizeMB = [math]::Round($finalSize / 1MB, 2)
$savedMB = [math]::Round(($initialSize - $finalSize) / 1MB, 2)

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✨ Limpieza completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Tamaño inicial:  $initialSizeMB MB" -ForegroundColor White
Write-Host "📊 Tamaño final:    $finalSizeMB MB" -ForegroundColor White
if ($savedMB -gt 0) {
    Write-Host "💾 Espacio liberado: $savedMB MB" -ForegroundColor Green
}
Write-Host ""

# Estadísticas de git
Write-Host "🗂️  Estadísticas del repositorio:" -ForegroundColor Yellow
git count-objects -vH 2>$null | Select-String "size-pack|size:|count:" | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }

Write-Host ""
Write-Host "💡 Consejos:" -ForegroundColor Cyan
Write-Host "   • Ejecuta este script regularmente" -ForegroundColor White
Write-Host "   • No commitees archivos .jar, .log ni uploads/" -ForegroundColor White
Write-Host "   • Usa 'npm run build' solo para producción" -ForegroundColor White
Write-Host ""

if ($cleaned -eq 0) {
    Write-Host "ℹ️  El proyecto ya estaba limpio" -ForegroundColor Gray
}
