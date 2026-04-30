# 🔧 CAMBIOS NECESARIOS - application.properties

## Archivo Actual vs Actualizado

### COPIAR Y REEMPLAZAR EN:
`realprint-backend/src/main/resources/application.properties`

---

## CONTENIDO COMPLETO actualizado para MySQL

```properties
# ========== APPLICATION CONFIGURATION ==========
spring.application.name=realprint-backend
spring.profiles.active=dev

# ========== DATABASE CONFIGURATION (MySQL) ==========
# IMPORTANTE: Cambiar host, puerto, usuario, contraseña según tu instalación

# Conexión a MySQL
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/realprint_db?useSSL=false&serverTimezone=America/Madrid&allowPublicKeyRetrieval=true
spring.datasource.username=realprint
spring.datasource.password=realprint123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.use_sql_comments=true

# ========== JWT CONFIGURATION ==========
jwt.secret=realPrintSecretKeyPara2026MAS_LARGO_POSIBLE_PARA_SEGURIDAD_1234567890ABCDEFGHIJKLMNOP
jwt.expiration-ms=86400000

# ========== CORS CONFIGURATION ==========
cors.allowed-origins=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS,PATCH
cors.allowed-headers=*
cors.allow-credentials=true
cors.max-age=3600

# ========== FILE UPLOAD CONFIGURATION ==========
file.upload.dir=${user.home}/realprint-uploads
app.upload.dir=${user.home}/realprint-uploads

# Tamaño máximo de archivo permitido: 10MB
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# ========== LOGGING CONFIGURATION ==========
logging.level.root=INFO
logging.level.com.realprint.realprintbackend=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# ========== SERVER CONFIGURATION ==========
server.port=8080
server.servlet.context-path=/
server.compression.enabled=true
server.compression.min-response-size=1024

# ========== HIBERNATE PROPERTIES ==========
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
```

---

## VALORES POR DEFECTO

Si usas las credenciales del docker-compose.yml, son:

```properties
# Usuario: realprint
# Contraseña: realprint123
# BD: realprint_db

spring.datasource.username=realprint
spring.datasource.password=realprint123
```

---

## ALTERNATIVAS SEGÚN ENTORNO

### DESARROLLO (con Docker)
```properties
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/realprint_db?useSSL=false&serverTimezone=America/Madrid
spring.datasource.username=realprint
spring.datasource.password=realprint123
spring.jpa.hibernate.ddl-auto=validate
```

### TESTING (H2 en memoria - para tests)
```properties
# Para tests, puedes mantener H2:
# spring.datasource.url=jdbc:h2:mem:realprint
# spring.datasource.driver-class-name=org.h2.Driver
```

### PRODUCCIÓN
```properties
spring.datasource.url=jdbc:mysql://production-db-host:3306/realprint_db?useSSL=true&serverTimezone=UTC
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
logging.level.root=WARN
```

---

## VERIFICACIÓN

1. Asegúrate de que MySQL está corriendo
2. Abre una terminal y ejecuta:
```bash
cd realprint-backend
mvn clean compile
```

3. Si hay errores de conexión, verifica:
   - ¿MySQL está corriendo?
   - ¿Credenciales correctas?
   - ¿Host y puerto correctos?
   - ¿BD realprint_db existe?

---

**Archivo: application.properties actualizado para MySQL**

