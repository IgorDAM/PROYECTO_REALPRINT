# 📋 CHECKLIST DEPLOYMENT A PRODUCCIÓN - RealPrint

**Fecha de Creación:** 27 de Abril de 2026  
**Versión:** 1.0  
**Estado:** Guía de referencia para despliegue a producción

---

## 📌 RESUMEN EJECUTIVO

Este documento contiene todos los pasos necesarios para desplegar RealPrint de manera segura a un ambiente de producción. Los cambios principal están en:

1. **Seguridad de archivos** - Forzar autenticación JWT
2. **Variables de entorno** - Configuración de base de datos y API
3. **Frontend** - Desactivar autenticación local
4. **Backend** - Validación obligatoria

**Tiempo estimado:** 45 minutos (incluyendo testing)

---

## 🔒 FASE 1: CAMBIOS DE CÓDIGO (Backend)

### 1.1 FileController.java - Forzar Autenticación JWT

**Archivo:** `realprint-backend/src/main/java/com/realprint/realprintbackend/controller/FileController.java`

**Lineas a cambiar:** 56-75

**Cambio requerido:**

```java
@GetMapping("/files/{fileName:.+}")
public ResponseEntity<?> download(@PathVariable String fileName, Authentication authentication) {
    // ✅ PRODUCCIÓN: Autenticación OBLIGATORIA
    if (authentication == null || !authentication.isAuthenticated()) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, 
            "Se requiere autenticación JWT para descargar archivos");
    }
    
    validateDownloadAccess(fileName, authentication);
    
    FileStorageService.StoredFile storedFile = fileStorageService.load(fileName);
    
    return ResponseEntity.ok()
            .contentType(storedFile.mediaType())
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + storedFile.fileName() + "\"")
            .body(storedFile.resource());
}
```

**✓ Checklist:**
- [ ] Cambio realizado en FileController.java
- [ ] Se eliminó el bloque FALLBACK (líneas 64-66)
- [ ] Se agregó validación OBLIGATORIA de JWT
- [ ] Se agregó HttpStatus import si es necesario: `import org.springframework.http.HttpStatus;`

---

## 🌍 FASE 2: VARIABLES DE ENTORNO

### 2.1 Backend - application-prod.properties

**Archivo:** `realprint-backend/src/main/resources/application-prod.properties`

Crear o actualizar con estos valores:

```properties
# ===== SEGURIDAD JWT =====
app.jwt.secret=${JWT_SECRET:cambiar-en-produccion-secret-key-muy-larga}
app.jwt.expiration=${JWT_EXPIRATION:86400000}

# ===== BASE DE DATOS =====
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/realprint_prod}
spring.datasource.username=${DB_USER:root}
spring.datasource.password=${DB_PASSWORD:password}
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# ===== ALMACENAMIENTO DE ARCHIVOS =====
app.upload.dir=${UPLOAD_DIR:/var/realprint/uploads}
app.max.upload.size=10485760

# ===== CORS =====
app.cors.allowed-origins=${CORS_ORIGINS:https://tudominio.com,https://www.tudominio.com}

# ===== LOGGING =====
logging.level.root=WARN
logging.level.com.realprint=INFO
logging.file.name=/var/log/realprint/application.log

# ===== ACTUATOR (para monitoreo) =====
management.endpoints.web.exposure.include=health,metrics
management.endpoint.health.show-details=when-authorized
```

**✓ Checklist:**
- [ ] Archivo `application-prod.properties` creado
- [ ] JWT_SECRET actualizado con valor seguro (>32 caracteres)
- [ ] DB_URL, DB_USER, DB_PASSWORD configurados para BD producción
- [ ] UPLOAD_DIR apunta a carpeta con permisos de escritura (ej: `/var/realprint/uploads`)
- [ ] CORS_ORIGINS actualizado con dominio real
- [ ] Logging en nivel WARN o INFO (no DEBUG)

### 2.2 Frontend - .env.production

**Archivo:** `App-RealPrint/.env.production`

```env
# ===== API CONFIGURATION =====
VITE_API_URL=https://api.tudominio.com
VITE_API_PORT=443

# ===== AUTHENTICATION =====
VITE_USE_LOCAL_AUTH=false
VITE_AUTH_BACKEND=true

# ===== FEATURES =====
VITE_ENABLE_DEBUG=false
VITE_LOG_LEVEL=warn
```

**✓ Checklist:**
- [ ] Archivo `.env.production` creado en raíz de App-RealPrint
- [ ] `VITE_USE_LOCAL_AUTH=false` ✅ IMPORTANTE
- [ ] `VITE_AUTH_BACKEND=true` ✅ IMPORTANTE
- [ ] `VITE_API_URL` apunta a dominio real de API
- [ ] `VITE_ENABLE_DEBUG=false`
- [ ] `.env.production` añadido a `.gitignore`

---

## 🔧 FASE 3: COMPILACIÓN Y TESTING

### 3.1 Backend - Maven Build

```bash
# 1. Limpiar compilaciones previas
mvn clean

# 2. Compilar con perfil producción
mvn -Pproduction compile

# 3. Ejecutar tests (DEBE pasar 100%)
mvn test

# 4. Crear JAR para desplegar
mvn -Pproduction package

# 5. Verificar JAR fue generado
ls -la realprint-backend/target/realprint-backend-1.0.0.jar
```

**✓ Checklist:**
- [ ] `mvn clean` ejecutado sin errores
- [ ] `mvn test` ejecutado con 100% de tests pasando
- [ ] `mvn package` generó JAR en `target/`
- [ ] JAR es descargable (>50MB típicamente)

### 3.2 Frontend - Build Vite

```bash
# 1. Navegar a carpeta frontend
cd App-RealPrint

# 2. Instalar dependencias
npm install

# 3. Build para producción
npm run build

# 4. Verificar que 'dist' contiene archivos
ls -la dist/

# 5. (Opcional) Preview local
npm run preview
```

**✓ Checklist:**
- [ ] `npm install` completado
- [ ] `npm run build` sin errores
- [ ] Carpeta `dist/` creada con archivos estáticos
- [ ] `dist/index.html` existe y es válido
- [ ] Tamaño de bundle razonable (<5MB gzipped)

---

## 🚀 FASE 4: INFRAESTRUCTURA Y DESPLIEGUE

### 4.1 Preparar Servidor Linux

```bash
# 1. SSH al servidor
ssh usuario@tu-servidor.com

# 2. Crear directorios necesarios
sudo mkdir -p /var/realprint/uploads
sudo mkdir -p /var/log/realprint
sudo mkdir -p /opt/realprint

# 3. Asignar permisos
sudo chown -R realprint:realprint /var/realprint
sudo chown -R realprint:realprint /var/log/realprint
sudo chmod 755 /var/realprint/uploads
sudo chmod 755 /var/log/realprint

# 4. Verificar directorios
ls -la /var/realprint/
```

**✓ Checklist:**
- [ ] Directorios creados (`/var/realprint/uploads`, `/var/log/realprint`, `/opt/realprint`)
- [ ] Permisos asignados correctamente
- [ ] Usuario `realprint` tiene acceso de escritura

### 4.2 Desplegar Backend (Spring Boot JAR)

```bash
# 1. Subir JAR a servidor
scp realprint-backend/target/realprint-backend-1.0.0.jar usuario@tu-servidor.com:/opt/realprint/

# 2. SSH al servidor y verificar
ssh usuario@tu-servidor.com
ls -la /opt/realprint/realprint-backend-1.0.0.jar

# 3. Crear archivo de configuración systemd
sudo nano /etc/systemd/system/realprint-backend.service
```

**Contenido de `realprint-backend.service`:**

```ini
[Unit]
Description=RealPrint Backend API
After=network.target mysql.service

[Service]
Type=simple
User=realprint
WorkingDirectory=/opt/realprint
ExecStart=/usr/bin/java -jar /opt/realprint/realprint-backend-1.0.0.jar \
    --spring.profiles.active=prod \
    --server.port=8080 \
    --management.endpoints.web.exposure.include=health,metrics

Environment="JWT_SECRET=tu-secret-key-muy-largo-y-seguro-aqui"
Environment="DB_URL=jdbc:mysql://localhost:3306/realprint_prod"
Environment="DB_USER=realprint_user"
Environment="DB_PASSWORD=tu-password-seguro"
Environment="UPLOAD_DIR=/var/realprint/uploads"
Environment="CORS_ORIGINS=https://tudominio.com,https://www.tudominio.com"

Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
# 4. Habilitar y iniciar servicio
sudo systemctl daemon-reload
sudo systemctl enable realprint-backend
sudo systemctl start realprint-backend

# 5. Verificar estado
sudo systemctl status realprint-backend
sudo journalctl -u realprint-backend -f  # Ver logs en tiempo real

# 6. Verificar que backend responde
curl http://localhost:8080/health
```

**✓ Checklist:**
- [ ] JAR subido a `/opt/realprint/`
- [ ] Archivo `realprint-backend.service` creado
- [ ] Servicio habilitado: `sudo systemctl enable realprint-backend`
- [ ] Servicio iniciado: `sudo systemctl start realprint-backend`
- [ ] Endpoint `/health` responde (HTTP 200)
- [ ] Logs sin errores críticos: `sudo journalctl -u realprint-backend -f`

### 4.3 Desplegar Frontend (Nginx)

```bash
# 1. Instalar Nginx (si no está instalado)
sudo apt-get update
sudo apt-get install -y nginx

# 2. Crear carpeta para archivos estáticos
sudo mkdir -p /var/www/realprint/{html,scripts}
sudo chown -R www-data:www-data /var/www/realprint

# 3. Subir archivos compilados
scp -r App-RealPrint/dist/* usuario@tu-servidor.com:/var/www/realprint/html/

# 4. Verificar archivos
ssh usuario@tu-servidor.com
ls -la /var/www/realprint/html/

# 5. Crear configuración de Nginx
sudo nano /etc/nginx/sites-available/realprint
```

**Contenido de `/etc/nginx/sites-available/realprint`:**

```nginx
# Cache para archivos estáticos
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=static_cache:10m;

# Backend upstream
upstream realprint_backend {
    server 127.0.0.1:8080;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name tudominio.com www.tudominio.com;
    
    # Redirigir a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name tudominio.com www.tudominio.com;
    
    # Certificados SSL (Let's Encrypt con Certbot)
    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;
    
    # Configuraciones SSL modernas
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Seguridad adicional
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Archivos estáticos (frontend)
    root /var/www/realprint/html;
    index index.html;
    
    # Cache para assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # API Backend
    location /api/ {
        proxy_pass http://realprint_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
    }
    
    # SPA - redirigir rutas desconocidas a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Negar acceso a archivos sensibles
    location ~ /\. {
        deny all;
    }
    
    # Logs
    access_log /var/log/nginx/realprint_access.log combined;
    error_log /var/log/nginx/realprint_error.log warn;
}
```

```bash
# 6. Habilitar site
sudo ln -s /etc/nginx/sites-available/realprint /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 7. Verificar configuración Nginx
sudo nginx -t

# 8. Hacer reload
sudo systemctl reload nginx

# 9. Obtener certificado SSL con Certbot
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d tudominio.com -d www.tudominio.com

# 10. Editar archivo Nginx para añadir rutas SSL (ver arriba)
# 11. Recargar Nginx
sudo systemctl reload nginx

# 12. Verificar auto-renovación de certificados
sudo certbot renew --dry-run
```

**✓ Checklist:**
- [ ] Nginx instalado
- [ ] Archivos estáticos en `/var/www/realprint/html/`
- [ ] Configuración Nginx creada y verificada (`sudo nginx -t`)
- [ ] Certificado SSL obtenido
- [ ] Nginx iniciado: `sudo systemctl start nginx`
- [ ] HTTPS accesible: `curl https://tudominio.com` (sin errores SSL)

---

## 🧪 FASE 5: TESTING POST-DESPLIEGUE

### 5.1 Verificar Conectividad Backend

```bash
# 1. Health check
curl https://tudominio.com/api/health

# Respuesta esperada:
# {"status":"UP","components":{"db":{"status":"UP"}}}

# 2. Login test
curl -X POST https://tudominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Respuesta esperada:
# {"token":"eyJhbGci...","username":"admin","role":"ADMIN"}
```

**✓ Checklist:**
- [ ] GET /api/health responde 200
- [ ] POST /api/auth/login responde con token JWT válido
- [ ] Errores de conexión a BD se detectan temprano

### 5.2 Verificar Autenticación de Descarga

```bash
# 1. Obtener token
TOKEN=$(curl -s -X POST https://tudominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' | jq -r '.token')

# 2. Intentar descargar SIN token (DEBE fallar)
curl -i https://tudominio.com/api/files/test-download-file.pdf
# Respuesta esperada: 401 Unauthorized

# 3. Intentar descargar CON token (DEBE funcionar)
curl -i -H "Authorization: Bearer $TOKEN" \
  https://tudominio.com/api/files/test-download-file.pdf
# Respuesta esperada: 200 OK + archivo descargado
```

**✓ Checklist:**
- [ ] Descargar sin token retorna 401 Unauthorized ✅
- [ ] Descargar con token válido retorna 200 OK ✅
- [ ] Archivo se descarga correctamente
- [ ] Header `Content-Disposition: attachment` presente

### 5.3 Verificar Frontend SPA

```bash
# 1. Acceder al sitio
curl -s https://tudominio.com | head -50

# Debe contener:
# - <!DOCTYPE html>
# - <meta name="viewport"
# - script tags para React/Vite

# 2. Verificar que archivos estáticos se sirven
curl -I https://tudominio.com/index.html
# Respuesta esperada: 200 OK

curl -I https://tudominio.com/assets/main-xxxxx.js
# Respuesta esperada: 200 OK
```

**✓ Checklist:**
- [ ] Sitio accesible en https://tudominio.com
- [ ] index.html se sirve como SPA
- [ ] Assets se cargan correctamente
- [ ] Sin errores en DevTools Console
- [ ] Responsive design funciona en móvil

### 5.4 Flujo End-to-End Completo

```
1. Abrir https://tudominio.com en navegador
2. Login con credenciales admin/cliente
3. Cliente: Crear nuevo pedido, cargar archivo PDF
4. Verificar que archivo se sube (spinner desaparece)
5. Admin: Ver pedido, verificar archivo en "Archivos del pedido"
6. Admin: Hacer click en "Descargar archivo 1"
7. Verificar que descarga funciona
8. Revisar DevTools Network:
   - Button click → POST /api/auth/login (si deslogueado)
   - Button click → GET /api/files/uuid-filename
   - Response: 200 OK, Content-Type: application/pdf
```

**✓ Checklist:**
- [ ] Login funciona con credenciales reales
- [ ] Cliente puede crear pedidos
- [ ] Cliente puede cargar archivos
- [ ] Admin ve los archivo en pedidos
- [ ] Descargas funcionan sin errores
- [ ] DevTools Network muestra 200 OK para descargas

### 5.5 Monitoreo de Logs

```bash
# Backend logs
sudo journalctl -u realprint-backend -n 50

# Nginx access logs
sudo tail -f /var/log/nginx/realprint_access.log

# Nginx error logs
sudo tail -f /var/log/nginx/realprint_error.log

# Buscar errores
sudo journalctl -u realprint-backend | grep -i error
```

**✓ Checklist:**
- [ ] Sin errores críticos en logs backend
- [ ] Sin errores 5xx en access logs Nginx
- [ ] Tiempos de respuesta < 2 segundos
- [ ] No hay warnings de SSL

---

## 🔐 FASE 6: SEGURIDAD

### 6.1 Validaciones de Seguridad

```bash
# 1. Verificar headers de seguridad
curl -I https://tudominio.com | grep -i "strict-transport\|x-frame\|x-content-type\|x-xss"

# Esperado:
# Strict-Transport-Security: max-age=31536000; includeSubDomains
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block

# 2. Verificar que JWT_SECRET es fuerte
# ✅ Mínimo 32 caracteres
# ✅ Incluye mayúsculas, minúsculas, números y símbolos
# ✅ NO incluye datos personales

# 3. Verificar base de datos
# ✅ Usuario de BD tiene permisos limitados (solo tablas necesarias)
# ✅ Contraseña de BD es única y fuerte
# ✅ Backups automáticos configurados

# 4. Verificar almacenamiento de archivos
# ✅ Carpeta /var/realprint/uploads NO es servida directamente por Nginx
# ✅ Solo se accede via /api/files endpoint con autenticación
# ✅ Archivos tienen permisos 644 (no ejecuta)
```

**✓ Checklist:**
- [ ] Headers de seguridad presentes
- [ ] JWT_SECRET tiene >32 caracteres
- [ ] BD usa usuario con permisos limitados
- [ ] Contraseña de BD es fuerte
- [ ] Backups automáticos habilitados
- [ ] Almacenamiento de archivos no es público
- [ ] Permisos de archivos correctos (644)

### 6.2 Backup y Recuperación

```bash
# 1. Script de backup automático
sudo nano /opt/realprint/backup.sh
```

**Contenido de `backup.sh`:**

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/realprint"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="realprint_prod"
DB_USER="realprint_user"
DB_PASSWORD="tu-password"

# Crear directorio si no existe
mkdir -p $BACKUP_DIR

# Backup de BD
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME | \
  gzip > $BACKUP_DIR/db_$TIMESTAMP.sql.gz

# Backup de archivos
tar -czf $BACKUP_DIR/uploads_$TIMESTAMP.tar.gz /var/realprint/uploads/

# Limpiar backups antiguos (>30 días)
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completado: $TIMESTAMP"
```

```bash
# 2. Hacer ejecutable
sudo chmod +x /opt/realprint/backup.sh

# 3. Agregar a crontab (diario a las 2 AM)
sudo crontab -e
# Agregar línea:
# 0 2 * * * /opt/realprint/backup.sh

# Verificar:
sudo crontab -l
```

**✓ Checklist:**
- [ ] Script de backup creado
- [ ] Cron job configurado
- [ ] Backup directorios accesibles

---

## 📊 FASE 7: MONITOREO

### 7.1 Configurar Alertas

```bash
# 1. Instalación de aplicación de monitoreo (ej: Uptime Kuma, Zabbix)
# O usar servicio como: UptimeRobot, Pingdom, etc.

# Endpoints a monitorear:
# - https://tudominio.com/api/health (Backend)
# - https://tudominio.com (Frontend)
# - https://tudominio.com/api/auth/login (Autenticación)
```

**✓ Checklist:**
- [ ] Monitoreo configurado
- [ ] Alertas por email habilitadas
- [ ] Escalación configurada para downtime > 15 min

### 7.2 Métricas Importantes

```
Monitorear:
- CPU usage < 80%
- Memory usage < 80%
- Disk usage < 85%
- Response time < 2s
- Error rate < 1%
- JWT token validity
- Database connection pool
```

**✓ Checklist:**
- [ ] Dashboard de métricas creado
- [ ] Alertas por umbral configuradas

---

## ✅ CHECKLIST FINAL PRE-PRODUCCIÓN

### Código
- [ ] FileController.java actualizado (autenticación obligatoria)
- [ ] application-prod.properties creado
- [ ] .env.production creado
- [ ] Todos los builds sin errores (mvn test, npm build)

### Infraestructura
- [ ] Servidor Linux preparado
- [ ] Backend JAR deployado y corriendo
- [ ] Nginx configurado con SSL
- [ ] Base de datos productiva accesible
- [ ] Almacenamiento de archivos con permisos correctos

### Seguridad
- [ ] HTTPS habilitado
- [ ] JWT_SECRET fuerte (>32 caracteres)
- [ ] Headers de seguridad presentes
- [ ] Backups automáticos configurados
- [ ] Permisos de archivos correctos

### Testing
- [ ] Descarga sin auth retorna 401
- [ ] Descarga con auth retorna 200
- [ ] Flujo e2e funciona (login → upload → download)
- [ ] Logs sin errores críticos
- [ ] Frontend responsive en móvil/desktop

### Monitoreo
- [ ] Alertas configuradas
- [ ] Logs centralizados
- [ ] Métricas siendo registradas

---

## 🆘 ROLLBACK DE EMERGENCIA

Si algo va mal en producción:

```bash
# 1. Parar backend (restaura última versión)
sudo systemctl stop realprint-backend

# 2. Restaurar BD desde backup más reciente
LATEST_BACKUP=$(ls -t /var/backups/realprint/db_*.sql.gz | head -1)
gunzip < $LATEST_BACKUP | mysql -u realprint_user -p realprint_prod

# 3. Restaurar archivos desde backup
cd /var/realprint
tar -xzf /var/backups/realprint/uploads_*.tar.gz

# 4. Desplegar versión anterior del JAR
sudo cp /var/backups/realprint/realprint-backend-OLD.jar \
        /opt/realprint/realprint-backend-1.0.0.jar

# 5. Reiniciar backend
sudo systemctl start realprint-backend

# 6. Verificar logs
sudo journalctl -u realprint-backend -f
```

**✓ Checklist:**
- [ ] Procedimiento de rollback entendido
- [ ] Backups de versiones anteriores mantenidas
- [ ] Key contacts notificados (DevOps, DBA)

---

## 📞 CONTACTOS Y REFERENCIAS

**Documentación Relacionada:**
- FLUJO_ARCHIVOS_CLIENTE_ADMIN.md - Explicación del flujo de archivos
- TROUBLESHOOTING_DESCARGA_ARCHIVOS.md - Solución de problemas
- FileController.java - Código del controlador de archivos
- FileStorageService.java - Lógica de almacenamiento

**URLs Importantes:**
- Backend Health: https://tudominio.com/api/health
- Frontend: https://tudominio.com
- Admin Panel: https://tudominio.com/admin
- API Docs: https://tudominio.com/api/swagger-ui.html (si está habilitado)

**Comandos Útiles:**
```bash
# Ver estado del servicio
sudo systemctl status realprint-backend

# Ver últimos 100 logs
sudo journalctl -u realprint-backend -n 100

# Reiniciar servicio
sudo systemctl restart realprint-backend

# Ver espacio en disco
df -h /var/realprint

# Ver uso de memoria
free -h
```

---

## 🎯 PRÓXIMOS PASOS DESPUÉS DE DESPLIEGUE

1. **Monitoreo continuo** - Revisar logs y métricas diariamente por 1 semana
2. **Performance tuning** - Optimizar si response time > 2s
3. **User feedback** - Recopilar feedback de usuarios reales
4. **Security audit** - Considerar auditoría de seguridad externa
5. **Disaster recovery** - Hacer simulacro de recuperación de desastres
6. **Scalability planning** - Preparar plan para crecimiento de usuarios

---

**Versión:** 1.0  
**Última actualización:** 27 de Abril de 2026  
**Documento mantenido por:** Equipo DevOps RealPrint

