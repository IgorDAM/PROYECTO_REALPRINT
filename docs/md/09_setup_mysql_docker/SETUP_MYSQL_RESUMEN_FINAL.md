# ✅ SETUP MYSQL - RESUMEN FINAL Y PRÓXIMOS PASOS

## 🎉 COMPLETADO

He preparado **TODO lo necesario** para migrar del Backend H2 (en memoria) a MySQL en Docker.

---

## 📦 ARCHIVOS GENERADOS

### Script SQL (Base de Datos)
```
✅ realprint-database-mysql.sql
   └─ Crea BD realprint_db con:
      ├─ Tabla usuarios (con 2 registros de prueba)
      ├─ Tabla pedidos (con 2 registros de prueba)
      └─ Índices y constraints
   Ubicación: D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\
```

### Docker Compose (Infraestructura)
```
✅ docker-compose.yml
   └─ Configura MySQL 8.0 con:
      ├─ Container: gordon-mysql
      ├─ Usuario: realprint / realprint123
      ├─ BD: realprint_db
      ├─ Puerto: 3306
      └─ Volumen persistente
   Ubicación: D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\
```

### Documentación (Guías)
```
✅ INDICE_SETUP_MYSQL.md
   └─ Navegación de todos los archivos

✅ SETUP_MYSQL_VISUAL_RESUMEN.md  ⭐ EMPEZAR AQUÍ
   └─ Resumen visual de pasos (5 min)

✅ SETUPBDMYSQL_COMPLETO.md
   └─ Guía completa y detallada (15 min)

✅ GUIA_MYSQL_PASO_A_PASO.md
   └─ Instrucciones para MySQL Workbench

✅ APLICACION_PROPERTIES_MYSQL.md
   └─ Referencia de configuración
```

---

## 🔧 ARCHIVOS MODIFICADOS

### Application Properties (YA ACTUALIZADO)
```
✅ realprint-backend/src/main/resources/application.properties
   Cambio: H2 (jdbc:h2:mem:realprint) → MySQL (jdbc:mysql://127.0.0.1:3306/realprint_db)
   Usuario: realprint
   Contraseña: realprint123
   Dialect: MySQL8Dialect
```

### POM.xml (NO REQUIERE CAMBIOS)
```
✅ realprint-backend/pom.xml
   Estado: Ya contiene driver MySQL (mysql-connector-j, líneas 55-59)
   Acción: NINGUNA (está listo)
```

---

## 🚀 PASOS A EJECUTAR (8 pasos, 20 minutos)

### PASO 1: Inicia Docker (1 minuto)
```bash
cd D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT
docker-compose up -d
```

### PASO 2: Verifica Docker (30 segundos)
```bash
docker ps
# Deberías ver: gordon-mysql  STATUS: Up
```

### PASO 3: Carga BD (3 minutos)

**Opción A - MySQL Workbench** (Gráfico):
```
1. Abre MySQL Workbench
2. Conecta a: 127.0.0.1:3306 (usuario: realprint, pwd: realprint123)
3. File → Open SQL Script → realprint-database-mysql.sql
4. Clic Play ▶ (o Ctrl+Shift+Enter)
5. Espera a completar
```

**Opción B - Terminal** (Línea de comando):
```bash
docker exec gordon-mysql mysql -u realprint -p realprint123 realprint_db < realprint-database-mysql.sql
```

### PASO 4: Compilar Backend (2 minutos)
```bash
cd realprint-backend
mvn clean compile
```

### PASO 5: Tests (1 minuto)
```bash
mvn test
```

### PASO 6: Package (2 minutos)
```bash
mvn clean package -DskipTests
```

### PASO 7: Inicia Backend (30 segundos)
```bash
java -jar target/realprint-backend-0.0.1-SNAPSHOT.jar
```

### PASO 8: Verifica (1 minuto)
```bash
# En otra terminal:
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Deberías recibir JWT token ✓
```

---

## 📊 Antes vs Después

### ANTES (H2 - Desarrollo)
```
Base de Datos:  H2 (en memoria)
Persistencia:   NO (se pierde al reiniciar)
Ubicación:      memoria RAM
Velocidad:      muy rápida
Caso de uso:    testing/desarrollo local
```

### DESPUÉS (MySQL - Producción)
```
Base de Datos:  MySQL 8.0 (servidor real)
Persistencia:   SI (data guardada en disco)
Ubicación:      Docker container (GORDON)
Velocidad:      rápida
Caso de uso:    desarrollo, staging, producción
```

---

## 🔑 Credenciales y Endpoints

### MySQL
```
Host:       127.0.0.1
Puerto:     3306
Usuario:    realprint
Contraseña: realprint123
BD:         realprint_db
```

### Backend
```
URL:        http://localhost:8080
Login:      /api/auth/login
Pedidos:    /api/pedidos
Usuarios:   /api/usuarios
Files:      /api/files
```

### Usuarios de Prueba
```
Admin:
  Usuario:    admin
  Contraseña: admin123
  Rol:        ADMIN

Cliente:
  Usuario:    cliente1
  Contraseña: cliente123
  Rol:        CLIENTE
```

---

## ✅ Verificación de Éxito

Cuando todo esté bien:

```
✓ docker ps muestra: gordon-mysql  STATUS: Up
✓ mvn compile ejecuta sin errores
✓ mvn test: Tests run: X, Failures: 0 ✓
✓ java -jar inicia Backend en puerto 8080 ✓
✓ curl al login devuelve JWT token ✓
✓ MySQL Workbench ve: realprint_db con usuarios y pedidos ✓
```

---

## 🎯 QUÉ LEER AHORA

### Si tienes 2 minutos:
→ Lee este archivo (lo estás leyendo)

### Si tienes 5 minutos:
→ Lee: `SETUP_MYSQL_VISUAL_RESUMEN.md`

### Si tienes 15 minutos:
→ Lee: `SETUPBDMYSQL_COMPLETO.md`

### Si necesitas entender bien:
→ Lee: `GUIA_MYSQL_PASO_A_PASO.md`

---

## 🚨 Troubleshooting Rápido

```
❌ "Connection refused"
→ Verifica: docker ps
→ Espera 10-20 segundos tras iniciar

❌ "Access denied"
→ Verifica credenciales en application.properties
→ ¿Coinciden con docker-compose.yml?

❌ "Database not found"
→ Ejecuta script SQL nuevamente
→ Verificá que entró en MySQL Workbench

❌ "Port already in use 3306"
→ Cambia puerto en docker-compose.yml
→ Cambia también en application.properties

❌ "BUILD FAILURE"
→ Asegúrate de que MySQL está corriendo
→ mvn clean compile -q
```

---

## 📊 Arquitectura General

```
┌─────────────────────────────────────────┐
│  App Frontend (React)                   │
│  http://localhost:5173                  │
└────────────────────┬────────────────────┘
                     │ HTTP/JSON
                     ▼
┌─────────────────────────────────────────┐
│  Backend Spring Boot                    │
│  http://localhost:8080/api              │
│  (CONECTADO A MYSQL)                    │
└────────────────────┬────────────────────┘
                     │ JDBC
                     ▼
┌─────────────────────────────────────────┐
│  MySQL 8.0 (Docker - GORDON)            │
│  localhost:3306/realprint_db            │
│  Usuario: realprint                     │
│  Datos persistentes en disco            │
└─────────────────────────────────────────┘
```

---

## 📝 Lista de Verificación

- [ ] He leído este documento (hasta aquí)
- [ ] Ejecuté: docker-compose up -d
- [ ] Verifiqué: docker ps muestra gordon-mysql
- [ ] Cargué: script SQL en MySQL Workbench
- [ ] Compilé: mvn clean compile
- [ ] Tests: mvn test (pasó exitosamente)
- [ ] Package: mvn clean package -DskipTests
- [ ] Backend inicia: java -jar target/*.jar
- [ ] Probé / curl al /auth/login (devolvió JWT)
- [ ] Verifiqué BD en MySQL Workbench
- [ ] Todo funciona ✓

---

## 🔄 Mantener Corriendo

### Inicia MongoDB (cada vez que arranques)
```bash
docker-compose up -d
```

### Detén MongoDB (cuando termines)
```bash
docker-compose down
```

### Ver logs de MySQL
```bash
docker-compose logs -f mysql
```

### Restablecer BD (si necesitas)
```bash
docker-compose down -v
docker-compose up -d
# (Ejecutar script SQL nuevamente)
```

---

## 📈 Próximos Pasos Después de Setup

1. ✅ Backend conectado a MySQL (HECHO)
2. ⏳ Frontend conectado al Backend (verificar)
3. ⏳ Flujo completo login → ver pedidos
4. ⏳ Flujo crear nuevo pedido
5. ⏳ Descarga de archivos
6. ⏳ Deploy a producción

---

## 🎉 ¡ESTÁS LISTO!

**Ahora ejecuta**:
```bash
cd D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT
docker-compose up -d
```

**Luego sigue los 8 pasos arriba**

Debería todo funcionar en **~20 minutos**.

---

## 📞 Archivos de Referencia

```
/PROYECTO_REALPRINT/
├─ INDICE_SETUP_MYSQL.md           (navegación)
├─ SETUP_MYSQL_VISUAL_RESUMEN.md   (⭐ visual)
├─ SETUPBDMYSQL_COMPLETO.md        (⭐ detallado)
├─ GUIA_MYSQL_PASO_A_PASO.md       (instrucciones)
├─ APLICACION_PROPERTIES_MYSQL.md  (referencia)
├─ realprint-database-mysql.sql    (script BD)
├─ docker-compose.yml              (docker config)
└─ realprint-backend/
   └─ src/main/resources/application.properties (✅ YA ACTUALIZADO)
```

---

**Setup MySQL - Resumen Final v1.0 | 2026-04-28**

¿Listo para empezar? 🚀

