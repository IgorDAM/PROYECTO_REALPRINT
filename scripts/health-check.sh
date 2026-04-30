#!/bin/bash
# =============================================================================
# health-check.sh - Verificar salud de servicios
# =============================================================================

set -e

BACKEND_URL="http://localhost:8080/api/actuator/health"
FRONTEND_URL="http://localhost:5173"
DB_CONTAINER="realprint-mysql"

echo ""
echo "============================================================================"
echo "                    RealPrint Health Check"
echo "============================================================================"
echo ""

# Backend Health
echo "[*] Verificando Backend..."
if curl -f -s "${BACKEND_URL}" > /dev/null 2>&1; then
    STATUS=$(curl -s "${BACKEND_URL}" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    echo "✅ Backend: ${STATUS}"
else
    echo "❌ Backend: No accesible en ${BACKEND_URL}"
fi

# Frontend Health
echo "[*] Verificando Frontend..."
if curl -f -s "${FRONTEND_URL}" > /dev/null 2>&1; then
    echo "✅ Frontend: Accesible"
else
    echo "❌ Frontend: No accesible en ${FRONTEND_URL}"
fi

# MySQL Health
echo "[*] Verificando MySQL..."
if docker ps | grep -q "${DB_CONTAINER}"; then
    if docker exec "${DB_CONTAINER}" mysqladmin ping -u root -p"${DB_PASSWORD:-root123}" > /dev/null 2>&1; then
        echo "✅ MySQL: Accesible"
    else
        echo "❌ MySQL: No accesible"
    fi
else
    echo "❌ MySQL: Contenedor no corriendo"
fi

# Docker Compose Status
echo ""
echo "[*] Estado de contenedores:"
docker-compose ps 2>/dev/null || echo "  (No hay docker-compose activo)"

echo ""
echo "============================================================================"
