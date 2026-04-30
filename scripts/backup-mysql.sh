#!/bin/bash
# =============================================================================
# backup-mysql.sh - Backup automático de MySQL
# =============================================================================
# Uso: ./scripts/backup-mysql.sh
# Crea archivo backup en: ./backups/realprint_YYYYMMDD_HHMMSS.sql

set -e

BACKUP_DIR="./backups"
DB_CONTAINER="realprint-mysql"
DB_USER="root"
DB_PASSWORD="${DB_PASSWORD:-root123}"
DB_NAME="realprint_db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/realprint_${TIMESTAMP}.sql"

# Crear directorio de backups
mkdir -p "${BACKUP_DIR}"

echo "[INFO] Iniciando backup de MySQL..."
echo "[INFO] Database: ${DB_NAME}"
echo "[INFO] Archivo: ${BACKUP_FILE}"

# Ejecutar mysqldump
docker exec "${DB_CONTAINER}" mysqldump \
    -u "${DB_USER}" \
    -p"${DB_PASSWORD}" \
    --single-transaction \
    --lock-tables=false \
    --routines \
    --triggers \
    --events \
    "${DB_NAME}" > "${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    echo "[OK] Backup completado exitosamente"
    echo "[INFO] Tamaño: ${SIZE}"
    echo "[INFO] Archivo: ${BACKUP_FILE}"
    
    # Comprimir backup
    gzip "${BACKUP_FILE}"
    echo "[OK] Backup comprimido: ${BACKUP_FILE}.gz"
    
    # Limpiar backups antiguos (más de 7 días)
    echo "[INFO] Limpiando backups antiguos..."
    find "${BACKUP_DIR}" -name "*.sql.gz" -mtime +7 -delete
    echo "[OK] Limpieza completada"
else
    echo "[ERROR] Falló el backup"
    exit 1
fi
