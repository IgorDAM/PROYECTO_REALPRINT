#!/bin/bash
# =============================================================================
# deploy-prod.sh - Deploy a producción
# =============================================================================
# Uso: ./scripts/deploy-prod.sh <host> <user>
# Ejemplo: ./scripts/deploy-prod.sh prod.example.com ubuntu

set -e

if [ $# -lt 2 ]; then
    echo "Uso: $0 <host> <user>"
    echo "Ejemplo: $0 prod.realprint.com ubuntu"
    exit 1
fi

HOST=$1
USER=$2
REMOTE_PATH="/opt/realprint"
SSH_KEY="${HOME}/.ssh/id_rsa"

echo "[INFO] Preparando deploy a producción..."
echo "[INFO] Host: ${HOST}"
echo "[INFO] Usuario: ${USER}"

# Verificar conexión SSH
echo "[*] Verificando conexión SSH..."
if ! ssh -i "${SSH_KEY}" -o ConnectTimeout=5 "${USER}@${HOST}" "echo ok" > /dev/null 2>&1; then
    echo "[ERROR] No se puede conectar a ${HOST}"
    echo "[INFO] Verifica:"
    echo "  - Host es accesible"
    echo "  - Usuario ${USER} existe"
    echo "  - SSH key en ${SSH_KEY}"
    exit 1
fi
echo "[OK] Conexión SSH establecida"

# Build local
echo "[*] Compilando backend..."
cd backend
mvn clean package -DskipTests > /dev/null 2>&1
cd ..
echo "[OK] Backend compilado"

echo "[*] Build frontend..."
cd frontend
npm run build > /dev/null 2>&1
cd ..
echo "[OK] Frontend compilado"

# Enviar archivos
echo "[*] Enviando archivos a servidor..."
scp -i "${SSH_KEY}" -r docker/ "${USER}@${HOST}:${REMOTE_PATH}/"
scp -i "${SSH_KEY}" .env.example "${USER}@${HOST}:${REMOTE_PATH}/.env"
echo "[OK] Archivos enviados"

# Deploy remoto
echo "[*] Ejecutando deploy en servidor..."
ssh -i "${SSH_KEY}" "${USER}@${HOST}" << EOF
    set -e
    cd ${REMOTE_PATH}
    
    # Configurar .env con valores reales
    # (esto debería hacerse manualmente o con herramientas de secrets)
    
    # Pull latest images
    docker-compose -f docker/docker-compose.prod.yml pull
    
    # Stop servicios antiguos
    docker-compose -f docker/docker-compose.prod.yml down
    
    # Start nuevos servicios
    docker-compose -f docker/docker-compose.prod.yml up -d
    
    # Health check
    sleep 10
    docker-compose -f docker/docker-compose.prod.yml ps
    
    echo "[OK] Deploy completado"
EOF

echo ""
echo "============================================================================"
echo "                    Deploy Completado Exitosamente"
echo "============================================================================"
echo ""
echo "URLs:"
echo "  Frontend: https://${HOST}"
echo "  Backend:  https://${HOST}/api"
echo ""
echo "Próximos pasos:"
echo "  1. Verificar healthcheck: https://${HOST}/api/actuator/health"
echo "  2. Ver logs: ssh ${USER}@${HOST} 'docker logs realprint-backend'"
echo "  3. Backup DB: ssh ${USER}@${HOST} 'cd ${REMOTE_PATH} && ./scripts/backup-mysql.sh'"
echo ""
