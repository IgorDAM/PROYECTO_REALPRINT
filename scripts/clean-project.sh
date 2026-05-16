#!/bin/bash
# =============================================================================
# Script de Limpieza del Proyecto RealPrint
# =============================================================================
# Limpia archivos temporales, builds y artifacts de testing que no deben
# estar en el repositorio ni ocupar espacio en disco.
#
# Uso: ./scripts/clean-project.sh
# =============================================================================

set -e  # Exit on error

echo "🧹 Limpiando proyecto RealPrint..."
echo ""

# Obtener tamaño inicial
INITIAL_SIZE=$(du -sh . 2>/dev/null | cut -f1)
echo "📊 Tamaño inicial: $INITIAL_SIZE"
echo ""

# Frontend
echo "📦 Limpiando frontend..."
if [ -d "frontend/test-results" ]; then
  rm -rf frontend/test-results/
  echo "  ✅ test-results eliminados"
else
  echo "  ℹ️  test-results no existe"
fi

if [ -d "frontend/dist" ]; then
  rm -rf frontend/dist/
  echo "  ✅ dist eliminado"
else
  echo "  ℹ️  dist no existe"
fi

if [ -d "frontend/node_modules/.vite" ]; then
  rm -rf frontend/node_modules/.vite/
  echo "  ✅ caché de vite eliminada"
fi

echo ""

# Backend
echo "☕ Limpiando backend..."
if [ -d "backend/target" ]; then
  rm -rf backend/target/
  echo "  ✅ target eliminado"
else
  echo "  ℹ️  target no existe"
fi

if [ -f "backend/backend.log" ]; then
  rm -f backend/backend.log
  echo "  ✅ backend.log eliminado"
else
  echo "  ℹ️  backend.log no existe"
fi

# Limpiar uploads pero mantener .gitkeep
if [ -d "backend/uploads" ]; then
  UPLOAD_COUNT=$(find backend/uploads -type f ! -name '.gitkeep' | wc -l)
  if [ "$UPLOAD_COUNT" -gt 0 ]; then
    find backend/uploads -type f ! -name '.gitkeep' -delete
    echo "  ✅ $UPLOAD_COUNT archivo(s) de uploads eliminados"
  else
    echo "  ℹ️  uploads ya está limpio"
  fi

  # Asegurar que existe .gitkeep
  touch backend/uploads/.gitkeep
fi

echo ""

# Git optimización
echo "🗂️  Optimizando repositorio git..."
echo "  ⏳ Ejecutando git gc (puede tardar unos segundos)..."
git gc --quiet --prune=now 2>/dev/null || echo "  ⚠️  git gc falló (no crítico)"
echo "  ✅ git gc completado"

echo ""

# Resumen final
FINAL_SIZE=$(du -sh . 2>/dev/null | cut -f1)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Limpieza completada!"
echo ""
echo "📊 Tamaño inicial:  $INITIAL_SIZE"
echo "📊 Tamaño final:    $FINAL_SIZE"
echo ""

# Estadísticas de git
echo "🗂️  Estadísticas del repositorio:"
git count-objects -vH 2>/dev/null | grep "size-pack\|size\|count" | head -3

echo ""
echo "💡 Consejos:"
echo "   • Ejecuta este script regularmente"
echo "   • No commitees archivos .jar, .log ni uploads/"
echo "   • Usa 'npm run build' solo para producción"
echo ""
