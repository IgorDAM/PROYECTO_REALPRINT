#!/bin/sh
# Instala los git hooks del proyecto (avisos de redeploy, etc.)
set -e
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cp "$ROOT_DIR/scripts/hooks/pre-push" "$ROOT_DIR/.git/hooks/pre-push"
chmod +x "$ROOT_DIR/.git/hooks/pre-push"

echo "Hook pre-push instalado: avisara si un push toca backend/."
