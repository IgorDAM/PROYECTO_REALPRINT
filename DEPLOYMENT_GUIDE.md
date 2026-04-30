# 🚀 Guía de Deployment - RealPrint

Guía completa para deployar RealPrint en diferentes entornos.

---

## 📋 Requisitos Previos

### Local/Development
- Docker Desktop
- Git
- Node.js 20+
- Java 17+
- Maven 3.8+

### Servidor Production
- Docker + Docker Compose
- Ubuntu 20.04+ LTS o similar
- 4GB RAM mínimo
- 20GB almacenamiento
- Acceso SSH

---

## 🏗️ Arquitectura Production

```
┌─────────────────────────────────────┐
│         Internet (HTTPS)            │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Nginx (Reverse Proxy + SSL)        │
│  Port: 443 (HTTPS), 80 (HTTP)       │
└─────────────────────────────────────┘
            ↓
┌──────────────────────┬──────────────────────┐
│ Frontend (Nginx)     │ Backend (Spring)     │
│ Port: 3000           │ Port: 8080           │
│ Serve React App      │ API REST + JWT       │
└──────────────────────┴──────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  MySQL 8.0                          │
│  Port: 3306 (Internal only)         │
│  Persistent Volume: /var/lib/mysql  │
└─────────────────────────────────────┘
```

---

## 🐳 Deployment con Docker Compose (Recomendado)

### 1. Preparar Servidor

```bash
# SSH al servidor
ssh ubuntu@prod.realprint.com

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Añadir usuario actual a grupo docker (opcional)
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Clonar Repositorio

```bash
# Crear directorio
mkdir -p /opt/realprint
cd /opt/realprint

# Clonar repo
git clone https://github.com/tu-org/realprint.git .
```

### 3. Configurar Variables de Entorno

```bash
# Copiar template
cp .env.example .env

# Editar con valores reales
nano .env
```

**Variables críticas a cambiar:**

```bash
# Base de datos
DB_PASSWORD=<contraseña-segura-aleatoria>

# JWT (generar con: openssl rand -base64 32)
JWT_SECRET=<generar-nueva-clave-segura>

# CORS
CORS_ALLOWED_ORIGINS=https://realprint.com,https://www.realprint.com

# HTTPS
SSL_CERT_PATH=/etc/letsencrypt/live/realprint.com/fullchain.pem
SSL_KEY_PATH=/etc/letsencrypt/live/realprint.com/privkey.pem
```

### 4. Configurar SSL/HTTPS

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Generar certificado Let's Encrypt
sudo certbot certonly --standalone -d realprint.com -d www.realprint.com

# Certificados en: /etc/letsencrypt/live/realprint.com/
```

### 5. Ejecutar Docker Compose

```bash
# Desde /opt/realprint
cd docker

# Iniciar servicios
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Ver estado
docker-compose -f docker-compose.prod.yml ps
```

### 6. Verificar Deployment

```bash
# Health checks
curl http://localhost:8080/api/actuator/health
curl http://localhost/

# Ver logs
docker-compose -f docker/docker-compose.prod.yml logs backend
docker-compose -f docker/docker-compose.prod.yml logs frontend
docker-compose -f docker/docker-compose.prod.yml logs mysql
```

---

## 🔄 Updates y Mantenimiento

### Actualizar Código

```bash
cd /opt/realprint

# Pull latest changes
git pull origin main

# Rebuild images
docker-compose -f docker/docker-compose.prod.yml build

# Restart servicios
docker-compose -f docker/docker-compose.prod.yml down
docker-compose -f docker/docker-compose.prod.yml up -d
```

### Backup Base de Datos

```bash
# Manual
docker exec realprint-mysql mysqldump -u root -p${DB_PASSWORD} \
    --single-transaction realprint_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Automático (cron)
# Añadir a crontab:
# 0 2 * * * cd /opt/realprint && ./scripts/backup-mysql.sh
```

### Logs y Monitoreo

```bash
# Ver logs en tiempo real
docker-compose -f docker/docker-compose.prod.yml logs -f backend

# Ver logs específicos
docker logs realprint-backend --tail 100 -f

# Exportar logs
docker logs realprint-backend > logs_backup.txt 2>&1
```

---

## 🔐 Seguridad

### Checklist de Seguridad

- [ ] JWT_SECRET generada con openssl rand
- [ ] DB_PASSWORD es contraseña fuerte (20+ caracteres)
- [ ] HTTPS/SSL configurado y renovación automática
- [ ] Firewall permite solo puertos 80, 443, SSH
- [ ] .env NO está en Git
- [ ] Regular backups configurados
- [ ] Monitoreo y alertas activas
- [ ] Updates de seguridad aplicadas

### Firewall (UFW)

```bash
# Habilitar firewall
sudo ufw enable

# Abrir puertos
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS

# Verificar
sudo ufw status
```

---

## 📊 Monitoreo

### Health Endpoints

```bash
# Backend health
curl http://localhost:8080/api/actuator/health

# Respuesta esperada:
# {"status":"UP","components":{"db":{"status":"UP"}}}
```

### Logs Centralizados (Opcional)

Configurar ELK Stack:

```yaml
# docker-compose.prod.yml (añadir)
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
  environment:
    - discovery.type=single-node

logstash:
  image: docker.elastic.co/logstash/logstash:8.0.0

kibana:
  image: docker.elastic.co/kibana/kibana:8.0.0
  ports:
    - "5601:5601"
```

---

## 🚨 Troubleshooting

### Backend no inicia

```bash
# Ver logs
docker logs realprint-backend

# Problemas comunes:
# - BD no accesible: verificar DB_PASSWORD en .env
# - Puerto 8080 en uso: cambiar en application.yml
# - JWT_SECRET inválido: generar nueva con openssl
```

### MySQL crash

```bash
# Reiniciar MySQL
docker-compose -f docker/docker-compose.prod.yml restart mysql

# Reparar BD (si está corrupta)
docker exec realprint-mysql mysqlcheck -u root -p${DB_PASSWORD} -r realprint_db
```

### Frontend no carga

```bash
# Verificar logs de Nginx
docker logs realprint-frontend

# Limpiar cache
docker exec realprint-frontend rm -rf /usr/share/nginx/html/.cache
```

---

## 📈 Escalado (Futuro)

Para alta disponibilidad:

1. **Load Balancer** (Nginx upstream)
2. **Múltiples instancias Backend** (3+)
3. **Database Replication** (Master-Slave MySQL)
4. **Redis Cache** (para sesiones)
5. **CDN** (CloudFlare, AWS CloudFront)

```yaml
# docker-compose.prod.yml
services:
  backend:
    deploy:
      replicas: 3
    # ... resto de config
```

---

## 📞 Soporte

Para problemas de deployment:

1. Revisar logs: `docker-compose logs`
2. Verificar health: `curl /api/actuator/health`
3. Check firewall: `sudo ufw status`
4. Restart services: `docker-compose restart`

---

## 📝 Checklist Pre-Launch

- [ ] Servidor configurado (SSH, Docker)
- [ ] SSL/HTTPS instalado
- [ ] Variables .env correctas
- [ ] Backup strategy implementado
- [ ] Monitoreo activado
- [ ] Health checks funcionando
- [ ] Load testing completado
- [ ] Incident response plan
- [ ] Documentation actualizada
- [ ] Team training completado

¡Listo para producción! 🚀

