# 📚 PASO A PASO: DEPLOYMENT A PRODUCCIÓN

**Guía visual y paso-a-paso para llevar RealPrint a producción**

---

## 🎯 FASE 0: ENTENDIMIENTO GENERAL

### Las 3 cosas principales que cambian:

```
DESARROLLO                          PRODUCCIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Autenticación Local (localStorage)  →  JWT Backend (token real)
VITE_USE_LOCAL_AUTH=true            →  VITE_USE_LOCAL_AUTH=false
Fallback sin auth en backend        →  Autenticación OBLIGATORIA
```

### Timeline:
```
├─ PASO 1: Actualizar código (5 min)
├─ PASO 2: Crear archivos de config (5 min)  
├─ PASO 3: Compilar y buildear (10 min)
├─ PASO 4: Preparar servidor (15 min)
├─ PASO 5: Desplegar (10 min)
├─ PASO 6: Verificar (5 min)
└─ PASO 7: Monitorear (ongoing)

   TOTAL: ~50 minutos para despliegue inicial
```

---

## PASO 1️⃣ ACTUALIZAR CÓDIGO

### Paso 1.1: Editar FileController.java

**Ubicación:** `realprint-backend/src/main/java/com/realprint/realprintbackend/controller/FileController.java`

**Qué hacer:**
1. Abre el archivo en tu editor
2. Ve a línea 56 (método `@GetMapping("/files/{fileName:.+}")`)
3. Busca el bloque `if (authentication != null...`

**Antes:**
```java
56  |     @GetMapping("/files/{fileName:.+}")
57  |     public ResponseEntity<?> download(@PathVariable String fileName, Authentication authentication) {
58  |         // Comentario didáctico: permitimos acceso en estos casos:
59  |         // 1. Usuario autenticado y verificamos permisos
60  |         // 2. Acceso público (fallback para desarrollo/demo local)
61  |         if (authentication != null && authentication.isAuthenticated()) {
62  |             validateDownloadAccess(fileName, authentication);
63  |         } else {
64  |             // FALLBACK: permitir descarga sin autenticación
65  |             System.out.println("ADVERTENCIA: Descargando archivo sin autenticación: " + fileName);
66  |         }
```

**Después:**
```java
56  |     @GetMapping("/files/{fileName:.+}")
57  |     public ResponseEntity<?> download(@PathVariable String fileName, Authentication authentication) {
58  |         // ✅ PRODUCCIÓN: Autenticación OBLIGATORIA
59  |         if (authentication == null || !authentication.isAuthenticated()) {
60  |             throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, 
61  |                 "Se requiere autenticación JWT para descargar archivos");
62  |         }
63  |         
64  |         validateDownloadAccess(fileName, authentication);
```

**✅ Hecho:** FileController.java actualizado

---

### Paso 1.2: Verificar imports en FileController.java

**Busca esta línea (aproximadamente línea 26):**
```java
import static org.springframework.http.HttpStatus.FORBIDDEN;
```

**Debe convertirse en:**
```java
import static org.springframework.http.HttpStatus.FORBIDDEN;
import org.springframework.http.HttpStatus;
```

O simplemente usar:
```java
import org.springframework.http.HttpStatus;
```

**✅ Hecho:** Imports verificados/actualizados

---

## PASO 2️⃣ CREAR ARCHIVOS DE CONFIGURACIÓN

### Paso 2.1: Crear application-prod.properties

**Ubicación:** `realprint-backend/src/main/resources/application-prod.properties`

**⚠️ IMPORTANTE:** Este archivo NO existirá, lo crearás nuevo

**Pasos:**
1. Abre explorador de archivos
2. Navega a: `realprint-backend\src\main\resources\`
3. Clic derecho → Nuevo archivo → `application-prod.properties`
4. Copía este contenido (actualiza los valores):

```properties
# ===== BASE DE DATOS =====
spring.datasource.url=jdbc:mysql://localhost:3306/realprint_prod
spring.datasource.username=realprint_user
spring.datasource.password=CAMBIAR_ESTO_PASSWORD_FUERTE
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# ===== SEGURIDAD JWT =====
app.jwt.secret=CAMBIAR_ESTO_SECRET_MAS_DE_32_CARACTERES_ALEATORIO_12345
app.jwt.expiration=86400000

# ===== ALMACENAMIENTO DE ARCHIVOS =====
app.upload.dir=/var/realprint/uploads

# ===== CORS =====
app.cors.allowed-origins=https://tudominio.com,https://www.tudominio.com

# ===== LOGGING =====
logging.level.root=WARN
logging.level.com.realprint=INFO
logging.file.name=/var/log/realprint/application.log
```

**Valores a cambiar:**
- `CAMBIAR_ESTO_PASSWORD_FUERTE` → tu password de BD producción
- `CAMBIAR_ESTO_SECRET_MAS_DE_32...` → secret alfanumérico largo y aleatorio
- `tudominio.com` → tu dominio real

**✅ Hecho:** application-prod.properties creado

### Paso 2.2: Crear .env.production

**Ubicación:** `App-RealPrint/.env.production`

**Pasos:**
1. Abre explorador de archivos
2. Navega a: `App-RealPrint\`
3. Clic derecho → Nuevo archivo → `.env.production`
4. Copía este contenido:

```env
VITE_API_URL=https://api.tudominio.com
VITE_API_PORT=443
VITE_USE_LOCAL_AUTH=false
VITE_AUTH_BACKEND=true
VITE_ENABLE_DEBUG=false
VITE_LOG_LEVEL=warn
```

**Valores a cambiar:**
- `https://api.tudominio.com` → URL real de API en producción

**⚠️ IMPORTANTE:** Si no tienes subdominio de API, usar: `VITE_API_URL=https://tudominio.com`

**✅ Hecho:** .env.production creado

---

## PASO 3️⃣ COMPILAR Y BUILDEAR

### Paso 3.1: Compilar Backend

**En terminal/PowerShell, navega a raíz del proyecto:**

```powershell
# 1. Navegar a carpeta del backend
cd D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\realprint-backend

# 2. Limpiar compilaciones previas
mvn clean

# 3. Compilar
mvn compile

# 4. Ejecutar tests (DEBE pasar 100%)
mvn test

# Salida esperada:
# [INFO] BUILD SUCCESS
# [INFO] Tests run: XX, Failures: 0, Errors: 0
```

**⚠️ Si hay errores:**
- Verifica que Java JDK está instalado: `java -version`
- Verifica que Maven está instalado: `mvn -version`
- Verifica imports en FileController.java

**✅ Hecho:** Backend compila sin errores

### Paso 3.2: Crear JAR para desplegar

```powershell
# Desde la carpeta backend
mvn package -DskipTests

# Salida:
# [INFO] BUILD SUCCESS
# [INFO] Building jar: ...target/realprint-backend-1.0.0.jar

# Verificar que JAR se creó
ls target/*.jar

# Debe mostrarse:
# realprint-backend-1.0.0.jar
```

**Ubicación del JAR:** `realprint-backend/target/realprint-backend-1.0.0.jar`

**✅ Hecho:** JAR creado listo para desplegar

### Paso 3.3: Buildear Frontend

```powershell
# 1. Navegar a carpeta frontend
cd D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\App-RealPrint

# 2. Instalar dependencias
npm install

# Salida: "added XX packages"

# 3. Buildear para producción
npm run build

# Salida:
# ✓ built in XXs
# dist/
#   ├─ index.html
#   ├─ assets/
#   │  ├─ main-xxx.js
#   │  ├─ style-xxx.css
# ... (otros archivos)

# 4. Verificar que dist fue creado
ls dist/

# Debe mostrar archivos
```

**Ubicación del frontend:** `App-RealPrint/dist/`

**✅ Hecho:** Frontend compilado

---

## PASO 4️⃣ PREPARAR SERVIDOR LINUX

### Paso 4.1: Conectarse al servidor

```bash
ssh usuario@tu-servidor.com
# Ejemplo: ssh root@192.168.1.100

# O si usas llave SSH:
ssh -i "ruta/a/clave.pem" usuario@tu-servidor.com
```

### Paso 4.2: Preparar directorios

```bash
# Ejecutar en el servidor:

# 1. Crear directorios necesarios
sudo mkdir -p /var/realprint/uploads
sudo mkdir -p /var/log/realprint
sudo mkdir -p /opt/realprint

# 2. Crear usuario para el app (si no existe)
sudo useradd -r -s /bin/false realprint 2>/dev/null || true

# 3. Asignar permisos
sudo chown -R realprint:realprint /var/realprint
sudo chown -R realprint:realprint /var/log/realprint
sudo chmod 755 /var/realprint/uploads

# 4. Verificar
ls -la /var/realprint/
# Debe mostrar: drwxr-xr-x uploads y logs
```

**✅ Hecho:** Servidor preparado

---

## PASO 5️⃣ DESPLEGAR

### Paso 5.1: Subir JAR del Backend

**Desde tu máquina local:**

```powershell
# Copiar JAR a servidor
scp C:\Users\TU_USER\Desktop\realprint-backend-1.0.0.jar usuario@tu-servidor.com:/opt/realprint/

# O si usas llave SSH:
scp -i "ruta/clave.pem" .\realprint-backend-1.0.0.jar usuario@tu-servidor.com:/opt/realprint/

# Verificar upload:
# Conexión SSH → ls -la /opt/realprint/
```

**✅ Hecho:** JAR en servidor

### Paso 5.2: Configurar servicio systemd para Backend

**En el servidor SSH:**

```bash
# 1. Crear archivo de servicio
sudo tee /etc/systemd/system/realprint-backend.service > /dev/null << 'EOF'
[Unit]
Description=RealPrint Backend API
After=network.target mysql.service

[Service]
Type=simple
User=realprint
WorkingDirectory=/opt/realprint

ExecStart=/usr/bin/java -jar /opt/realprint/realprint-backend-1.0.0.jar \
    --spring.profiles.active=prod \
    --server.port=8080

Environment="JWT_SECRET=CAMBIAR_ESTO_SECRET_FUERTE_32_CARACTERES"
Environment="DB_URL=jdbc:mysql://localhost:3306/realprint_prod"
Environment="DB_USER=realprint_user"
Environment="DB_PASSWORD=CAMBIAR_ESTO_PASSWORD"
Environment="UPLOAD_DIR=/var/realprint/uploads"
Environment="CORS_ORIGINS=https://tudominio.com"

Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# 2. Recargar systemd
sudo systemctl daemon-reload

# 3. Habilitar servicio (para que inicie al rebootear)
sudo systemctl enable realprint-backend

# 4. Iniciar servicio
sudo systemctl start realprint-backend

# 5. Verificar estado
sudo systemctl status realprint-backend
# Debe mostrar: "active (running)"

# 6. Ver logs
sudo journalctl -u realprint-backend -f
# Presiona Ctrl+C para salir
```

**⚠️ Valores a cambiar en el archivo:**
- `CAMBIAR_ESTO_SECRET_FUERTE_32_CARACTERES` → secret aleatorio
- `CAMBIAR_ESTO_PASSWORD` → password base de datos real
- `tudominio.com` → tu dominio real

**✅ Hecho:** Backend deployado y corriendo

### Paso 5.3: Subir Frontend a Nginx

**Desde tu máquina local:**

```powershell
# Copiar todos los archivos compilados
scp -r "App-RealPrint\dist\*" usuario@tu-servidor.com:/var/www/realprint/html/

# O usando WinSCP si prefieres interfaz gráfica
```

**En servidor SSH:**

```bash
# 1. Verificar que archivos llegaron
ls -la /var/www/realprint/html/
# Debe mostrar: index.html, assets/, etc

# 2. Asignar permisos
sudo chown -R www-data:www-data /var/www/realprint/html
sudo chmod -R 755 /var/www/realprint/html

# 3. Recargar Nginx
sudo systemctl reload nginx
```

**✅ Hecho:** Frontend deployado

---

## PASO 6️⃣ VERIFICAR QUE FUNCIONA

### Paso 6.1: Checks de Conectividad Básica

```bash
# En servidor SSH:

# 1. ¿Backend responde en localhost:8080?
curl http://localhost:8080/health
# Debe retornar JSON con estado UP

# 2. ¿Nginx está serviendo frontend?
curl http://localhost/
# Debe retornar HTML del index

# 3. ¿Nginx puede conectar al backend?
curl http://localhost/api/health
# Debe retornar JSON (pasando por Nginx proxy)
```

### Paso 6.2: Verificar Autenticación de Descargas

```bash
# En servidor SSH:

# 1. Crear un token de test (login)
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token obtenido: $TOKEN"

# 2. Intentar descargar SIN token (DEBE fallar con 401)
curl -i http://localhost:8080/files/test-download-file.pdf 2>&1 | head -1
# Expected: HTTP/1.1 401 Unauthorized

# 3. Intentar descargar CON token (DEBE funcionar con 200)
curl -i -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/files/test-download-file.pdf 2>&1 | head -1
# Expected: HTTP/1.1 200 OK
```

### Paso 6.3: Test en Navegador

**Desde tu máquina local:**

1. Abre navegador → `http://tu-servidor-ip/`
2. Deberías ver la interfaz de login de RealPrint
3. Login con credenciales válidas
4. Si eres admin → Ir a Pedidos → Ver un pedido con archivos
5. Hacer clic en "Descargar archivo"
6. Debe descargarse el PDF ✅

**Si funciona → ¡ÉXITO!**

**✅ Hecho:** Sistema verificado y funcional

---

## PASO 7️⃣ PRODUCCIÓN: AGREGAR SSL/HTTPS

### Paso 7.1: Instalar Certbot

```bash
# En servidor SSH:
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot certonly --nginx -d tudominio.com -d www.tudominio.com

# Seguir el asistente:
# 1. Ingresa email -> presiona Enter
# 2. Acepta términos -> presiona Enter
# 3. Comparte email -> y/n (tu preferencia)
```

### Paso 7.2: Configurar Nginx con SSL

```bash
# Abrir configuración Nginx
sudo nano /etc/nginx/sites-available/realprint

# Reemplazar contenido con:
```

```nginx
# Redirect HTTP a HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name tudominio.com www.tudominio.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name tudominio.com www.tudominio.com;
    
    # SSL
    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Headers de seguridad
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Frontend
    root /var/www/realprint/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Presiona Ctrl+X → Y → Enter (guardar en nano)

# 3. Verificar sintaxis
sudo nginx -t
# Debe mostrar: "syntax is ok"

# 4. Recargar
sudo systemctl reload nginx

# 5. Verificar
curl -I https://tudominio.com
# Debe mostrar: HTTP/2 200 (sin errores SSL)
```

**✅ Hecho:** HTTPS funcionando

---

## 🎉 ¡DESPLIEGUE COMPLETADO!

### Última verificación:

```bash
# 1. ¿Frontend accesible?
curl -I https://tudominio.com
# → 200 OK

# 2. ¿Login funciona?
curl -s -X POST https://tudominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}' | jq

# 3. ¿Descargas requieren auth?
curl -i https://tudominio.com/api/files/any.pdf
# → 401 Unauthorized ✅

# 4. ¿Logs sin errores?
sudo journalctl -u realprint-backend --no-pager -n 20
```

---

## 📊 MONITOREO CONTINUO

```bash
# Ver logs en tiempo real
sudo journalctl -u realprint-backend -f

# Verificar estado del servicio
sudo systemctl status realprint-backend

# Ver uso de disco
df -h /var/realprint

# Renovar certificado SSL (automático, pero verifica)
sudo certbot renew --dry-run
```

---

## 🔄 CHEAT SHEET ÚTIL

```bash
# Restart backend (si haces cambios)
sudo systemctl restart realprint-backend

# Ver últimos 50 logs
sudo journalctl -u realprint-backend -n 50

# Detener backend
sudo systemctl stop realprint-backend

# Editar entorno variables
sudo nano /etc/systemd/system/realprint-backend.service
# Luego: sudo systemctl daemon-reload && sudo systemctl restart realprint-backend

# Backup rápido de BD
mysqldump -u realprint_user -p realprint_prod > /home/usuario/backup.sql

# Limpiar logs antiguos (si ocupan espacio)
sudo journalctl --vacuum=100M
```

---

## ✅ RESUMEN DE CAMBIOS

| Archivo | Cambio |
|---------|--------|
| FileController.java | ❌ Fallback auth, ✅ Auth obligatoria |
| application-prod.properties | ✅ Creado (BD, JWT, paths) |
| .env.production | ✅ Creado (VITE_USE_LOCAL_AUTH=false) |
| realprint-backend-1.0.0.jar | ✅ Deployado en /opt/realprint |
| /var/www/realprint/html | ✅ Frontend files deployed |
| Nginx config | ✅ SSL + proxy |
| systemd service | ✅ Backend auto-start |

---

**¿Preguntas?** Ver `DEPLOYMENT_PRODUCCION_CHECKLIST.md` para más detalles.

