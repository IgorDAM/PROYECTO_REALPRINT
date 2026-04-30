# ✅ SETUP MYSQL - RESUMEN VISUAL

## 🎯 Lo que se ha preparado

```
✅ Script SQL:              realprint-database-mysql.sql
   └─ Crea BD realprint_db con usuarios y pedidos

✅ docker-compose.yml:      Configuración Docker lista
   └─ MySQL 8.0, usuario realprint, contraseña realprint123

✅ application.properties:  YA ACTUALIZADO
   └─ Cambiado de H2 a MySQL

✅ pom.xml:                 Driver MySQL incluido (líneas 55-59)
   └─ com.mysql:mysql-connector-j
```

---

## 🚀 PRÓXIMOS PASOS (1, 2, 3...)

### PASO 1: Inicia MySQL en Docker (1 minuto)

```bash
cd D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT
docker-compose up -d
```

**Output esperado**:
```
Creating gordon-mysql ... done
```

---

### PASO 2: Verifica que está corriendo (30 segundos)

```bash
docker ps
# Deberías ver: gordon-mysql  STATUS: Up
```

---

### PASO 3: Carga el script SQL (3 minutos)

**Opción A - Desde MySQL Workbench**:
```
1. Abre MySQL Workbench
2. Conecta a: 127.0.0.1:3306 (usuario: realprint, pwd: realprint123)
3. File → Open SQL Script → realprint-database-mysql.sql
4. Clic Play ▶ (o Ctrl+Shift+Enter)
5. Espera a que complete
```

**Opción B - Desde Terminal**:
```bash
docker exec gordon-mysql mysql -u realprint -p realprint123 < realprint-database-mysql.sql
```

**Output esperado**:
```
✓ Base de datos creada
✓ Tablas creadas
✓ Datos insertados
✓ Verificación completada
```

---

### PASO 4: Compila Backend (2 minutos)

```bash
cd realprint-backend
mvn clean compile
```

**Output esperado**:
```
BUILD SUCCESS ✓
```

---

### PASO 5: Ejecuta tests (1 minuto)

```bash
mvn test
```

**Output esperado**:
```
Tests run: X, Failures: 0, Errors: 0, Skipped: 0 ✓
```

---

### PASO 6: Genera JAR (2 minutos)

```bash
mvn clean package -DskipTests
```

**Output esperado**:
```
JAR: target/realprint-backend-0.0.1-SNAPSHOT.jar ✓
Size: ~64 MB
```

---

### PASO 7: Inicia Backend (30 segundos)

```bash
cd realprint-backend
java -jar target/realprint-backend-0.0.1-SNAPSHOT.jar
```

**Output esperado**:
```
Tomcat started on port 8080 ✓
Application started successfully ✓
```

---

### PASO 8: Prueba que funciona (1 minuto)

En otra terminal:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Output esperado**:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

✓ **ÉXITO!** El Backend está conectado a MySQL

---

## 📚 ARCHIVOS GENERADOS/MODIFICADOS

### Nuevos Archivos:
```
✅ realprint-database-mysql.sql       [CREATE BD SQL]
✅ docker-compose.yml                  [Docker configuration]
✅ GUIA_MYSQL_PASO_A_PASO.md           [Guía MySQL]
✅ APLICACION_PROPERTIES_MYSQL.md      [Referencia properties]
✅ SETUPBDMYSQL_COMPLETO.md            [Guía completa]
```

### Archivos Modificados:
```
✅ application.properties              [H2 → MySQL]
✅ DockerCompose creado               [Infraestructura lista]
```

---

## 🔑 Credenciales

```
MySQL Root:
  Usuario:      root
  Contraseña:   root123

MySQL App:
  Usuario:      realprint
  Contraseña:   realprint123

Base de Datos:
  Nombre:       realprint_db
  Host:         127.0.0.1
  Puerto:       3306

Backend:
  URL:          http://localhost:8080
  
Frontend:
  URL:          http://localhost:5173
```

---

## 🧪 Verificación Rápida

```bash
# ¿MySQL está corriendo?
docker ps | grep gordon-mysql

# ¿Backend responde?
curl http://localhost:8080/api/auth/health

# ¿BD está sincronizada?
docker exec gordon-mysql mysql -u realprint -p realprint123 realprint_db -e "SELECT COUNT(*) FROM usuarios;"
```

---

## ⏱️ Tiempo Total

```
Docker up:           1 min
Script SQL:           3 min
Compile:             2 min
Tests:               1 min
Package:             2 min
Backend start:       1 min
────────────────────────
TOTAL:         ~10 minutos
```

---

## 📊 Estructura BD

```
realprint_db
├── usuarios (2 registros)
│   ├── admin / admin123 (ADMIN)
│   └── cliente1 / cliente123 (CLIENTE)
│
└── pedidos (2 registros)
    ├── Pedido #1 (estado: PENDIENTE)
    └── Pedido #2 (estado: EN_PROCESO)
```

---

## 🎯 Diagrama General

```
Your Computer
├── Docker Desktop
│   └── MySQL Container (GORDON)
│       └── BD: realprint_db
│           ├── usuarios
│           └── pedidos
│
├── Backend Running
│   └── http://localhost:8080
│       └──┬──────────────────┐
│          │   /api/auth      │
│          │   /api/pedidos   │
│          │   /api/usuarios  │
│          └──────────────────┘
│
└── Frontend <Ready to Connect>
    └── http://localhost:5173
```

---

## 🚨 Si Algo Falla

```
❌ "Connection refused"
   → Verifica: docker ps
   → Espera 10 segundos
   → Reinicia: docker-compose restart

❌ "Access denied"
   → Verifica credenciales en application.properties
   → Coinciden con docker-compose.yml?

❌ "Database not found"
   → Ejecuta script SQL nuevamente
   → O: docker-compose down -v && docker-compose up -d

❌ "Port already in use"
   → Cambia puerto en docker-compose.yml
   → Luego en application.properties
```

---

## ✅ PRÓXIMO: INICIAR SISTEMAS

Una vez verificado todo, ejecuta en 2 terminales:

**Terminal 1 - Backend**:
```bash
cd realprint-backend
java -jar target/realprint-backend-0.0.1-SNAPSHOT.jar
```

**Terminal 2 - Frontend**:
```bash
cd App-RealPrint
npm run dev
```

**Acceso**:
```
Frontend:  http://localhost:5173
Backend:   http://localhost:8080/api
BD Admin:  MySQL Workbench @ localhost:3306
```

---

**Setup MySQL - Resumen Visual v1.0 | 2026-04-28**

