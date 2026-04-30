# 🗄️ GUÍA PASO A PASO - CREAR BD MYSQL PARA REALPRINT

## 📋 OPCIONES DISPONIBLES

Este documento cubre dos opciones:
1. **OPCIÓN 1**: Usar MySQL Workbench (local o Docker)
2. **OPCIÓN 2**: Usar Docker Compose (recomendado)

---

## 🎯 OPCIÓN 1: MYSQL WORKBENCH (RECOMENDADA PARA DESARROLLO)

### Paso 1: Conectar a MySQL en Docker Workbench

```
1. Abre MySQL Workbench
2. En la esquina superior izquierda, busca: Database → New Connection
3. O haz click en el "+" junto a "MySQL Connections"

Configuración de la Conexión:
├─ Connection Name:     GORDON (o el nombre que uses)
├─ Connection Method:   Standard (TCP/IP)
├─ Hostname:            127.0.0.1  (si está en Docker: localhost)
├─ Port:                3306
├─ Username:            root
├─ Password:            [tu contraseña de GORDON]
├─ Default Schema:      (dejar vacío)
└─ Test Connection:     ✓ Clic para verificar
```

### Paso 2: Crear la Base de Datos

**Opción A - Usar Script SQL (Recomendado)**

```
1. Abre MySQL Workbench
2. Ve a: File → Open SQL Script
3. Selecciona: realprint-database-mysql.sql (en la raíz del proyecto)
4. Se abrirá el script en una pestaña
5. Clic en el ícono de Play (▶) o Ctrl+Shift+Enter
6. Espera a que complete
7. Verás en la consola:
   - ✓ Base de datos creada
   - ✓ Tablas creadas
   - ✓ Datos insertados
   - ✓ Estadísticas mostradas
```

**Opción B - Crear Manualmente**

```
1. En MySQL Workbench, haz clic: File → New Query Tab
2. Copia y pega el contenido de realprint-database-mysql.sql
3. Selecciona todo: Ctrl+A
4. Ejecuta: Ctrl+Shift+Enter o el botón Play ▶
```

### Paso 3: Verificar que se creó correctamente

```
En el panel izquierdo "Schemas", deberías ver:
├─ realprint_db ✓
   ├─ Tables
   │   ├─ usuarios ✓
   │   └─ pedidos ✓
   └─ Views

Haz doble clic en "realprint_db" para seleccionarla como por defecto.
```

### Paso 4: Verificar los Datos

```sql
-- Ejecuta estas queries en una nueva pestaña SQL:

SELECT * FROM usuarios;
-- Deberías ver 2 usuarios: admin y cliente1

SELECT * FROM pedidos;
-- Deberías ver 2 pedidos de prueba

SELECT * FROM realprint_db.usuarios;
SELECT * FROM realprint_db.pedidos;
```

---

## 🐳 OPCIÓN 2: DOCKER COMPOSE (RECOMENDADO PARA INFRAESTRUCTURA)

### Paso 1: Crear archivo docker-compose.yml

Crea el archivo en la raíz del proyecto:
```
D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\docker-compose.yml
```

**Contenido**:
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: gordon-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123        # Cambiar si lo deseas
      MYSQL_DATABASE: realprint_db
      MYSQL_USER: realprint
      MYSQL_PASSWORD: realprint123        # Cambiar si lo deseas
      TZ: 'America/Madrid'
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./realprint-database-mysql.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - realprint_network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10
      interval: 10s

volumes:
  mysql_data:
    driver: local

networks:
  realprint_network:
    driver: bridge
```

### Paso 2: Iniciar el Contenedor en Docker Desktop

**Desde PowerShell**:
```bash
# Navega al directorio del proyecto
cd D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT

# Inicia los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f mysql

# Verificar que está corriendo
docker ps
```

**Desde Docker Desktop GUI**:
```
1. Abre Docker Desktop
2. Ve a la pestaña "Containers"
3. Deberías ver un contenedor "realprint" o "gordon-mysql"
4. Estado: Running ✓
```

### Paso 3: Conectar MySQL Workbench al Contenedor

```
En MySQL Workbench:

Connection Name:  GORDON (o realprint-mysql)
Hostname:         127.0.0.1 (o localhost)
Port:             3306
Username:         realprint (o root)
Password:         realprint123 (o root123)
Default Schema:   realprint_db

Test Connection → ✓ OK
```

### Paso 4: Detener el Contenedor (cuando no lo necesites)

```bash
docker-compose down
```

---

## ✅ VERIFICACIÓN FINAL

Ejecuta estos comandos para verificar que todo está bien:

```bash
# Ver contenedores corriendo
docker ps

# Conectar a MySQL desde terminal
docker exec -it gordon-mysql mysql -u realprint -p realprint_db -e "SELECT * FROM usuarios;"

# O desde MySQL Workbench
# Ejecuta: SELECT * FROM usuarios LIMIT 5;
```

---

## 🔧 CAMBIOS EN EL CÓDIGO (BackEnd)

Una vez que la BD esté lista, actualiza estos archivos:

### 1. Actualizar `application.properties`

```
# Ver próximo documento: APLICACION_PROPERTIES_ACTUALIZACION.md
```

### 2. Agregar dependencia MySQL en `pom.xml`

```xml
<!-- Ver próximo documento: MAVEN_DEPENDENCIAS_ACTUALIZACION.md -->
```

### 3. Cambiar estrategia DDL en `application.properties`

```
# ANTES (H2 - desarrollo):
spring.jpa.hibernate.ddl-auto=create-drop

# DESPUÉS (MySQL - producción):
spring.jpa.hibernate.ddl-auto=validate
# O para testing:
spring.jpa.hibernate.ddl-auto=update
```

---

## 🚨 TROUBLESHOOTING

### Problema: Puerto 3306 en uso
```bash
# Ver qué está usando el puerto
netstat -ano | findstr :3306

# Cambiar puerto en docker-compose.yml:
ports:
  - "3307:3306"  # Usa 3307 en host,3306 en contenedor
```

### Problema: No puedo conectar desde Workbench
```
1. Verifica que MySQL está corriendo: docker ps
2. Verifica credenciales en docker-compose.yml
3. Cambia hostname de "localhost" a "127.0.0.1"
4. Aumenta timeout en Workbench: Edit → Preferences → MySQL Connections
```

### Problema: Script SQL no ejecuta
```
1. Verifica sintaxis: Copia el contenido en un editor
2. Asegúrate de estar en la BD correcta: USE realprint_db;
3. Ejecuta línea por línea si hay error
4. Revisa la consola de errores
```

---

## 📦 ESTRUCTURA ESPERADA

Después de ejecutar el script, tu BD de MySQL debería verse así:

```
realprint_db
├── Tablas
│   ├── usuarios
│   │   ├── id (PK)
│   │   ├── username (UNIQUE)
│   │   ├── password_hash
│   │   ├── nombre
│   │   ├── email
│   │   ├── rol (ENUM: ADMIN, CLIENTE)
│   │   ├── activo (BOOLEAN)
│   │   ├── created_at
│   │   └── updated_at
│   │
│   └── pedidos
│       ├── id (PK)
│       ├── cliente_id (FK)
│       ├── cliente_nombre
│       ├── servicio
│       ├── descripcion
│       ├── cantidad
│       ├── fecha
│       ├── fecha_entrega
│       ├── estado (ENUM: 5 valores)
│       ├── total (DECIMAL)
│       ├── created_at
│       └── updated_at
│
├── Índices
│   ├── idx_username
│   ├── idx_cliente_id
│   ├── idx_estado
│   └── (otros)
│
└── Datos iniciales
    ├── 2 usuarios de prueba
    └── 2 pedidos de prueba
```

---

## 🎯 SIGUIENTES PASOS

1. ✅ Crear base de datos MySQL
2. ⏳ Actualizar application.properties
3. ⏳ Agregar dependencia MySQL en pom.xml
4. ⏳ Actualizar DataInitializer (si es necesario)
5. ⏳ Compilar y probar el Backend

Ver: 
- `APLICACION_PROPERTIES_ACTUALIZACION.md`
- `MAVEN_DEPENDENCIAS_ACTUALIZACION.md`

---

**Guía MySQL para RealPrint v1.0 | 2026-04-28**

