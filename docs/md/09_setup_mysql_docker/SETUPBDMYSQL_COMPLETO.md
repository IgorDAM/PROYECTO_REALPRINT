# 🚀 GUÍA COMPLETA - CREAR BD MYSQL Y CONECTAR AL BACKEND

## 📋 INDICE

1. [Crear BD en MySQL](#crear-bd)
2. [Configurar Backend](#configurar-backend)
3. [Pruebas](#pruebas)
4. [Troubleshooting](#troubleshooting)

---

## 🎯 Crear BD en MySQL {#crear-bd}

### OPCIÓN A: Usar Docker Compose (RECOMENDADO)

#### Paso 1: Navega al directorio del proyecto
```bash
cd D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT
```

#### Paso 2: Inicia MySQL en Docker
```bash
docker-compose up -d
```

**Output esperado**:
```
Creating gordon-mysql ... done
```

#### Paso 3: Verifica que está corriendo
```bash
docker ps
# Deberías ver: gordon-mysql  STATUS: Up ...
```

#### Paso 4: Conecta desde MySQL Workbench
```
Connection Name:    GORDON
Hostname:           127.0.0.1
Port:               3306
Username:           realprint
Password:           realprint123
Default Schema:     realprint_db
Test Connection:    OK ✓
```

---

### OPCIÓN B: Usar MySQL Workbench Directamente

#### Paso 1: Abre MySQL Workbench

#### Paso 2: Conecta a tu instancia MySQL existente
```
Selecciona la conexión de tu GORDON container
```

#### Paso 3: Abre el script SQL
```
File → Open SQL Script
Selecciona: realprint-database-mysql.sql
```

#### Paso 4: Ejecuta el script
```
Clic en ▶ (Play button) o Ctrl+Shift+Enter
```

#### Paso 5: Verifica en el panel izquierdo
```
Schemas → realprint_db → Tables
├─ usuarios ✓
└─ pedidos ✓
```

---

## 🔧 Configurar Backend {#configurar-backend}

### ✅ YA COMPLETADO

He actualizado estos archivos automáticamente:

```
✅ application.properties
   └─ Cambiado de H2 a MySQL
   └─ URL, usuario, contraseña configurados
```

### Verificar cambios

Abre: `realprint-backend/src/main/resources/application.properties`

Debe contener:
```properties
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/realprint_db
spring.datasource.username=realprint
spring.datasource.password=realprint123
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=validate
```

---

## 🧪 Compilar y Probar {#pruebas}

### Paso 1: Compilar Backend
```bash
cd realprint-backend
mvn clean compile
```

**Resultado esperado**:
```
BUILD SUCCESS ✓
```

### Paso 2: Ejecutar tests
```bash
mvn test
```

**Resultado esperado**:
```
Tests run completed successfully ✓
Usuarios creados en BD MySQL
```

### Paso 3: Generar JAR
```bash
mvn clean package -DskipTests
```

**Resultado esperado**:
```
JAR generado: target/realprint-backend-0.0.1-SNAPSHOT.jar ✓
```

### Paso 4: Iniciar Backend
```bash
java -jar target/realprint-backend-0.0.1-SNAPSHOT.jar
```

**Resultado esperado**:
```
Tomcat started on port 8080 ✓
Application 'realprint-backend' started successfully ✓
```

### Paso 5: Verificar conexión
En otra terminal:
```bash
curl http://localhost:8080/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}'
```

Debería devolver un JWT token ✓

---

## 📊 Verificar Datos en BD

### Opción 1: MySQL Workbench

```sql
-- Usuarios
SELECT * FROM usuarios;
-- Deberías ver: admin y cliente1

-- Pedidos
SELECT * FROM pedidos;
-- Deberías ver: 2 pedidos

-- Estadísticas
SELECT COUNT(*) FROM usuarios;
SELECT COUNT(*) FROM pedidos;
```

### Opción 2: Desde Terminal
```bash
docker exec gordon-mysql mysql -u realprint -p realprint123 realprint_db -e "SELECT * FROM usuarios;"
```

---

## 🐳 Parar/Reiniciar Docker

### Parar contenedor
```bash
docker-compose down
```

### Reiniciar
```bash
docker-compose up -d
```

### Ver logs
```bash
docker-compose logs -f mysql
```

---

## 🔄 Si Cambias Credenciales

### Editar docker-compose.yml
```yaml
environment:
  MYSQL_ROOT_PASSWORD: nueva_contraseña
  MYSQL_PASSWORD: nueva_contraseña
  MYSQL_USER: nuevo_usuario
```

### Editar application.properties
```properties
spring.datasource.username=nuevo_usuario
spring.datasource.password=nueva_contraseña
```

### Reiniciar Docker
```bash
docker-compose down
docker-compose up -d
```

---

## 🚨 Troubleshooting {#troubleshooting}

### Problema: "Connection refused"
```
❌ Error: java.sql.SQLNonTransientConnectionException

Solución:
1. ¿MySQL está corriendo? docker ps
2. Espera 10-20 segundos después de iniciar Docker
3. Prueba telnet: telnet 127.0.0.1 3306
```

### Problema: "Access denied"
```
❌ Error: java.sql.SQLInvalidAuthorizationSpecException

Solución:
1. Verifica credenciales en application.properties
2. Verifica que coincidan con docker-compose.yml
3. Asegúrate de que la BD realprint_db existe
```

### Problema: "Base de datos no existe"
```
❌ Error: Unknown database 'realprint_db'

Solución:
1. Ejecuta el script SQL en MySQL Workbench
2. O elimina y recrea el contenedor:
   docker-compose down -v
   docker-compose up -d
```

### Problema: Tests fallan
```
❌ Test failures

Solución:
1. Asegúrate de que MySQL está corriendo
2. Limpia y recompila: mvn clean compile
3. Ejecuta: mvn clean test
```

### Problema: Puerto 3306 ya en uso
```
❌ Error: Address already in use

Solución - Opción 1:
Usa otro puerto en docker-compose.yml:
  ports:
    - "3307:3306"
Luego en application.properties:
  spring.datasource.url=jdbc:mysql://127.0.0.1:3307/realprint_db

Solución - Opción 2:
Encuentra qué usa el puerto:
  netstat -ano | findstr :3306
Ciérralo o cambia de puerto
```

---

## ✅ Checklist Final

- [ ] Docker está corriendo
- [ ] MySQL contenedor está UP
- [ ] BD realprint_db existe
- [ ] Usuarios de prueba creados
- [ ] Pedidos de prueba creados
- [ ] application.properties actualizado
- [ ] Backend compila sin errores
- [ ] Tests pasan
- [ ] JAR se genera correctamente
- [ ] Backend inicia en puerto 8080
- [ ] Login devuelve JWT token
- [ ] Frontend conecta al backend

---

## 📈 Arquitectura Final

```
┌─────────────────────────────────────────────┐
│         Frontend (React/TypeScript)          │
│         http://localhost:5173               │
└────────────────────┬────────────────────────┘
                     │ HTTP
                     ▼
┌─────────────────────────────────────────────┐
│         Backend Spring Boot                 │
│         http://localhost:8080/api           │
└────────────────────┬────────────────────────┘
                     │ JDBC
                     ▼
┌─────────────────────────────────────────────┐
│      MySQL 8.0 (Docker Container)           │
│      localhost:3306                         │
│      BD: realprint_db                       │
└─────────────────────────────────────────────┘
```

---

## 🎉 ÉXITO!

Si llegaste aquí sin errores, tu setup está completo:

✅ BD MySQL funcionando  
✅ Backend conectado  
✅ Datos iniciales cargados  
✅ Listo para desarrollo  

**Siguiente paso**: Iniciar Frontend con `npm run dev`

---

**Guía Completa de Setup MySQL v1.0 | 2026-04-28**

