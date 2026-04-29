# 🆘 REFERENCIA RÁPIDA - TROUBLESHOOTING MYSQL

## ⚡ Problemas Comunes y Soluciones Rápidas

### 1. Connection Refused (No se conecta a MySQL)

**Error**:
```
java.sql.SQLNonTransientConnectionException: Cannot get a connection
```

**Soluciones**:
```bash
# Verificar Docker está corriendo
docker ps | grep gordon-mysql

# Si no aparece, iniciar Docker
docker-compose up -d

# Ver logs
docker-compose logs mysql

# Esperar 15-20 segundos (MySQL tarda en iniciar)
```

---

### 2. Access Denied (Credenciales incorrectas)

**Error**:
```
java.sql.SQLInvalidAuthorizationSpecException: Access denied
```

**Soluciones**:
```
Verificar en application.properties:
  spring.datasource.username=realprint
  spring.datasource.password=realprint123
  
¿Coinciden con docker-compose.yml?
  MYSQL_USER: realprint
  MYSQL_PASSWORD: realprint123

Si no coinciden, actualizar o recrear Docker:
  docker-compose down -v
  docker-compose up -d
```

---

### 3. Unknown Database (Base de datos no existe)

**Error**:
```
java.sql.SQLSyntaxErrorException: Unknown database 'realprint_db'
```

**Soluciones**:
```
# Ejecutar script SQL en MySQL Workbench:
1. File → Open SQL Script → realprint-database-mysql.sql
2. Click Play ▶
3. Esperar a completar

# O desde terminal:
docker exec gordon-mysql mysql -u realprint -p realprint123 < realprint-database-mysql.sql

# Verificar que existe:
docker exec gordon-mysql mysql -u realprint -p realprint123 -e "SHOW DATABASES LIKE 'realprint_db%';"
```

---

### 4. Port Already in Use (Puerto ocupado)

**Error**:
```
docker: Error response from daemon: Ports are not available: exposing port 3306
```

**Soluciones**:
```bash
# Ver qué usa el puerto 3306
netstat -ano | findstr :3306

# Opción A: Cambiar puerto en docker-compose.yml
ports:
  - "3307:3306"  # Usa 3307 en lugar de 3306

# Opción B: Matar proceso que lo usa
taskkill /PID <ProcesosID> /F

# Luego recrear Docker
docker-compose down
docker-compose up -d
```

---

### 5. Build Failure (Compilación falla)

**Error**:
```
[ERROR] COMPILATION ERROR : /path/to/file.java:[XX,XX]
```

**Soluciones**:
```bash
# 1. Limpiar y recompilar
mvn clean compile -q

# 2. Si persiste, verificar MySQL está corriendo
docker ps | grep gordon-mysql

# 3. Verificar credenciales en application.properties

# 4. Si todo OK, ver error específico
mvn clean compile  # Sin -q para ver detalles
```

---

### 6. Tests Fallan

**Error**:
```
Test failures: Cannot connect to MySQL
```

**Soluciones**:
```bash
# 1. Asegurar MySQL está corriendo
docker ps

# 2. Esperar 10-15 segundos después de iniciar
sleep 15

# 3. Ejecutar tests
mvn test

# 4. Si hay error de timeout en tests, aumentar:
# En pom.xml, agregar a maven-surefire-plugin:
<systemPropertyVariables>
    <db.connection.waitMs>30000</db.connection.waitMs>
</systemPropertyVariables>
```

---

### 7. MySQL Workbench No Conecta

**Error**:
```
Error 2003: Cannot connect to MySQL server on 'localhost'
```

**Soluciones**:
```
1. Verificar Docker está corriendo:
   docker ps | grep gordon-mysql

2. En MySQL Workbench, cambiar hostname:
   ❌ localhost  →  ✓ 127.0.0.1

3. Aumentar timeout en Workbench:
   Edit → Preferences → MySQL Connections
   Connection read timeout: 60000 (60 segundos)

4. Verificar credenciales:
   Username: realprint
   Password: realprint123
   Port: 3306

5. Test Connection antes de guardar
```

---

### 8. Datos No Se Guardan (BD no persiste)

**Error**:
```
Los datos desaparecen al reiniciar Docker
```

**Soluciones**:
```bash
# Verificar que el volumen está configurado en docker-compose.yml:
services:
  mysql:
    volumes:
      - mysql_data:/var/lib/mysql  ← Debe estar presente

# Recrear Docker con volumen
docker-compose down
docker-compose up -d

# Verificar volumen fue creado
docker volume ls | grep mysql
```

---

### 9. Script SQL No Ejecuta

**Error**:
```
Script no ejecuta o hay errores de sintaxis
```

**Soluciones**:
```
1. Opción A - Copiar línea por línea:
   - Selecciona línea
   - Copia
   - Pega en MySQL Workbench
   - Ejecuta

2. Opción B - Verificar codificación:
   - Archivo podría estar en UTF-16
   - Abrir en editor, guardar como UTF-8

3. Opción C - Desde terminal:
   docker exec gordon-mysql mysql \
     -u realprint -p realprint123 realprint_db \
     < realprint-database-mysql.sql

4. Ver errores específicos:
   - En MySQL Workbench, revisar panel "Output"
```

---

### 10. Backend Lento o Timeouts

**Error**:
```
org.hibernate.exception.JDBCConnectionException: Timeout
```

**Soluciones**:
```
1. Aumentar timeout en application.properties:
   # Agregar:
   spring.datasource.hikari.connection-timeout=30000
   spring.datasource.hikari.idle-timeout=600000
   spring.datasource.hikari.max-lifetime=1800000

2. Verificar MySQL no está saturado:
   docker stats

3. Aumentar recursos Docker:
   Docker Desktop → Settings → Resources → Memory: 4GB+

4. Ver logs de MySQL:
   docker-compose logs -f mysql --tail=100
```

---

## 🔧 Comandos Útiles

### Docker

```bash
# Ver contenedores corriendo
docker ps

# Ver todos los contenedores
docker ps -a

# Ver logs
docker-compose logs -f mysql

# Entrar en contenedor
docker exec -it gordon-mysql bash

# Reiniciar servicio
docker-compose restart mysql

# Parar todo
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v

# Ver volúmenes
docker volume ls

# Inspeccionar volumen
docker volume inspect mysql_data
```

### MySQL desde Terminal

```bash
# Conectar a MySQL
docker exec -it gordon-mysql mysql -u realprint -p realprint123

# Ver bases de datos
docker exec gordon-mysql mysql -u realprint -p realprint123 -e "SHOW DATABASES;"

# Ver tablas
docker exec gordon-mysql mysql -u realprint -p realprint123 realprint_db -e "SHOW TABLES;"

# Ver usuarios
docker exec gordon-mysql mysql -u realprint -p realprint123 realprint_db -e "SELECT * FROM usuarios;"

# Ver pedidos
docker exec gordon-mysql mysql -u realprint -p realprint123 realprint_db -e "SELECT * FROM pedidos;"

# Ejecutar script
docker exec gordon-mysql mysql -u realprint -p realprint123 realprint_db < script.sql
```

### Maven

```bash
# Ver versión
mvn -v

# Compilar
mvn clean compile

# Tests
mvn test

# Skip tests
mvn clean package -DskipTests

# Ver dependencias
mvn dependency:tree

# Limpiar cache
mvn clean -U

# Forzar actualizar dependencias
mvn clean install -U
```

---

## 📊 Verificación de Salud

```bash
# Check 1: ¿Docker corre?
docker ps | grep gordon-mysql
# Expected: container name aparece con STATUS: Up

# Check 2: ¿MySQL responde?
docker exec gordon-mysql mysql -u realprint -p realprint123 -e "SELECT 1;"
# Expected: 1

# Check 3: ¿BD existe?
docker exec gordon-mysql mysql -u realprint -p realprint123 -e "USE realprint_db; SELECT COUNT(*) FROM usuarios;"
# Expected: 2

# Check 4: ¿Backend compilar?
cd realprint-backend && mvn clean compile -q
# Expected: Éxito sin errores

# Check 5: ¿Tests pasan?
mvn test -q
# Expected: All tests pass

# Check 6: ¿Backend inicia?
java -jar target/realprint-backend-0.0.1-SNAPSHOT.jar &
sleep 5
curl http://localhost:8080/api/auth/health
# Expected: 200 OK
```

---

## 🎯 Restablecimiento Completo

Si todo está roto, resetear todo:

```bash
# 1. Parar y eliminar Docker
docker-compose down -v

# 2. Limpiar Backend
cd realprint-backend
mvn clean

# 3. Recrear Docker
cd ..
docker-compose up -d

# 4. Cargar datos
docker exec gordon-mysql mysql -u realprint -p realprint123 realprint_db < realprint-database-mysql.sql

# 5. Recompilar Backend
cd realprint-backend
mvn clean package -DskipTests

# 6. Iniciar
java -jar target/realprint-backend-0.0.1-SNAPSHOT.jar
```

---

## 📞 Cuando Nada Funciona

1. Lee este doc completamente
2. Ejecuta todos los "Check" en Verificación de Salud
3. Anota qué check falla
4. Ve a esa sección en este documento
5. Sigue las soluciones paso a paso

Si aún así no funciona:
1. Restablecimiento Completo (arriba)
2. Espera 2-5 minutos
3. Intenta nuevamente

---

**Referencia Rápida - Troubleshooting MySQL v1.0 | 2026-04-28**

