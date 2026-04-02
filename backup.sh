#!/bin/bash

# ========================================
# Script de Respaldo - Liga Caldense de Fútbol
# ========================================

FECHA=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups"

echo "🔄 Iniciando respaldo..."

# Crear carpeta de respaldos si no existe
mkdir -p $BACKUP_DIR

# 1. Respaldo de la base de datos
echo "📦 Respaldando base de datos..."
cp db/custom.db $BACKUP_DIR/custom_$FECHA.db
echo "✅ Base de datos respaldada: $BACKUP_DIR/custom_$FECHA.db"

# 2. Respaldo de archivos públicos
echo "📦 Respaldando archivos públicos..."
tar -czf $BACKUP_DIR/public_$FECHA.tar.gz public/ 2>/dev/null
echo "✅ Archivos públicos respaldados: $BACKUP_DIR/public_$FECHA.tar.gz"

# 3. Exportar SQL de la base de datos
echo "📦 Exportando SQL..."
sqlite3 db/custom.db .dump > $BACKUP_DIR/dump_$FECHA.sql 2>/dev/null
echo "✅ SQL exportado: $BACKUP_DIR/dump_$FECHA.sql"

# 4. Limpiar respaldos antiguos (mantener últimos 10)
echo "🧹 Limpiando respaldos antiguos..."
ls -t $BACKUP_DIR/custom_*.db 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null
ls -t $BACKUP_DIR/public_*.tar.gz 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null
ls -t $BACKUP_DIR/dump_*.sql 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null

echo ""
echo "✅ Respaldo completado exitosamente!"
echo "📁 Ubicación: $BACKUP_DIR/"
ls -la $BACKUP_DIR/ | tail -5
