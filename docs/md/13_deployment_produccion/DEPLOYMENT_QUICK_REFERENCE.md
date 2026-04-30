# ⚡ CAMBIOS RÁPIDOS PARA PRODUCCIÓN - ReferenceCard

**Imprime esto o guárdalo en favoritos**

---

## 🔴 CAMBIO #1: FileController.java

**Archivo:** `realprint-backend/src/main/java/com/realprint/realprintbackend/controller/FileController.java`

**Lineas 56-75 - Reemplazar:**

```java
// ❌ DESARROLLO (CON FALLBACK)
@GetMapping("/files/{fileName:.+}")
public ResponseEntity<?> download(@PathVariable String fileName, Authentication authentication) {
    if (authentication != null && authentication.isAuthenticated()) {
        validateDownloadAccess(fileName, authentication);
    } else {
        System.out.println("ADVERTENCIA: Descargando archivo sin autenticación: " + fileName);
    }
    // ... resto del code
}
```

**Por:**

```java
// ✅ PRODUCCIÓN (AUTENTICACIÓN OBLIGATORIA)
@GetMapping("/files/{fileName:.+}")
public ResponseEntity<?> download(@PathVariable String fileName, Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, 
            "Se requiere autenticación JWT para descargar archivos");
    }
    validateDownloadAccess(fileName, authentication);
    // ... resto del código
}
```

**Agregar import si no existe:**
```java
import org.springframework.http.HttpStatus;
```

---

## 🌍 CAMBIO #2: application-prod.properties

**Archivo:** `realprint-backend/src/main/resources/application-prod.properties`

**Crear con valores reales:**
```properties
app.jwt.secret=TU_SECRET_AQUI_MAS_DE_32_CARACTERES_ALEATORIO
app.jwt.expiration=86400000

spring.datasource.url=jdbc:mysql://localhost:3306/realprint_prod
spring.datasource.username=realprint_user
spring.datasource.password=TU_PASSWORD_BD_AQUI
spring.jpa.hibernate.ddl-auto=validate

app.upload.dir=/var/realprint/uploads
app.cors.allowed-origins=https://tudominio.com,https://www.tudominio.com
```

---

## 💻 CAMBIO #3: .env.production

**Archivo:** `App-RealPrint/.env.production`

**Crear con:**
```env
VITE_API_URL=https://api.tudominio.com
VITE_API_PORT=443
VITE_USE_LOCAL_AUTH=false
VITE_AUTH_BACKEND=true
VITE_ENABLE_DEBUG=false
```

**⚠️ IMPORTANTE:** `VITE_USE_LOCAL_AUTH=false`

---

## 🔨 COMPILAR Y DEPLOYAR

### Backend:
```bash
mvn clean test package -Pproduction
# Copiar JAR a servidor en: /opt/realprint/realprint-backend-1.0.0.jar
sudo systemctl restart realprint-backend
```

### Frontend:
```bash
cd App-RealPrint
npm install
npm run build
# Copiar dist/* a servidor en: /var/www/realprint/html/
sudo systemctl reload nginx
```

---

## ✅ VERIFICACIÓN CRÍTICA

| Verificar | Comando | Esperado |
|-----------|---------|----------|
| Sin token | `curl https://tudominio.com/api/files/test.pdf` | **401 Unauthorized** |
| Con token | `curl -H "Authorization: Bearer TOKEN" https://tudominio.com/api/files/test.pdf` | **200 OK** |
| Frontend | Visitar https://tudominio.com | Carga correctamente |
| Login | POST /api/auth/login | Retorna JWT token |

---

## 🆘 PROBLEMAS COMUNES

| Problema | Causa | Solución |
|----------|-------|---------|
| Descargas fallan con 403 | JWT_SECRET no coincide | Actualizar JWT_SECRET en application-prod.properties |
| Frontend no carga | VITE_USE_LOCAL_AUTH=true | Cambiar a false en .env.production |
| Base de datos no conecta | Credenciales incorrectas | Verificar DB_URL, DB_USER, DB_PASSWORD |
| Logs muestran errores JWT | Certificado SSL inválido | Renovar con: `sudo certbot renew` |

---

## 🎯 RESUMEN FASE POR FASE

```
1. CÓDIGO: Cambiar FileController.java + crear .properties + .env.production
2. BUILD: mvn clean test package && npm run build
3. DEPLOY: Subir JAR a /opt/realprint y dist a /var/www/realprint/html
4. CONFIG: application-prod.properties con valores reales en servidor
5. SSL: Certificado Let's Encrypt para HTTPS
6. NGINX: Reverse proxy configurado apuntando a localhost:8080
7. TEST: Verificar 401 sin token, 200 con token
8. MONITOR: Ver logs en tiempo real: sudo journalctl -u realprint-backend -f
```

---

## 🚨 BEFORE YOU DEPLOY

- [ ] JWT_SECRET es único y >32 caracteres
- [ ] VITE_USE_LOCAL_AUTH = false
- [ ] DB_url, DB_USER, DB_PASSWORD correctos
- [ ] CORS_ORIGINS contiene tu dominio real
- [ ] Backend tests pasan: mvn test ✅
- [ ] Frontend builds sin errores: npm run build ✅
- [ ] Certificado SSL válido en servidor
- [ ] Backups de BD configurados
- [ ] Plan de rollback preparado

---

**Más detalles:** Ver `DEPLOYMENT_PRODUCCION_CHECKLIST.md`

