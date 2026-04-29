# 📚 INDICE - SETUP MYSQL PARA REALPRINT

## 🎯 Lee Esto Primero

```
┌─────────────────────────────────────────════════════════┐
│  SI TIENES 5 MIN:       Lee SETUP_MYSQL_VISUAL_RESUMEN  │
│  SI TIENES 15 MIN:      Lee SETUPBDMYSQL_COMPLETO       │
│  SI TIENES 30 MIN:      Lee todo en orden de abajo      │
└─────────────────────────────────────────════════════════┘
```

---

## 📄 ARCHIVOS GENERADOS EN ESTA SESIÓN

### 1. **SETUP_MYSQL_VISUAL_RESUMEN.md** ⭐ EMPEZAR AQUÍ
```
Contenido: Resumen visual paso a paso
Tiempo:   5 minutos
Propósito: Visión rápida de qué hacer
```

### 2. **SETUPBDMYSQL_COMPLETO.md** ⭐ RECOMENDADO
```
Contenido: Guía completa y detallada
Tiempo:   15 minutos
Propósito: Toda la información en un lugar
```

### 3. **GUIA_MYSQL_PASO_A_PASO.md**
```
Contenido: Instructions paso a paso para MySQL Workbench y Docker
Tiempo:   20 minutos
Propósito: Entender cómo crear BD en ambas opciones
```

### 4. **realprint-database-mysql.sql**
```
Contenido: Script SQL para crear BD, tablas e insertar datos
Propósito: Ejecutar en MySQL Workbench o en Docker
Ubicación: D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\
```

### 5. **docker-compose.yml** ✅ YA EN PROYECTO
```
Contenido: Configuración Docker para MySQL
Ubicación: D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\
Estado:   Listo para usar
```

### 6. **APLICACION_PROPERTIES_MYSQL.md** (Referencia)
```
Contenido: Valores de application.properties para MySQL
Propósito: Referencia de cómo está configurado
```

### 7. **Este Índice** (archivo actual)
```
Contenido: Navegación por todos los archivos
Propósito: Orientación general
```

---

## ✅ ARCHIVOS MODIFICADOS EN PROYECTO

### **application.properties** ✅ ACTUALIZADO
```
Ubicación: realprint-backend/src/main/resources/
Cambio:    H2 (en memoria) → MySQL (servidor Docker)
Estado:    LISTO PARA USAR
```

### **pom.xml** ✅ YA TIENE DRIVER
```
Ubicación: realprint-backend/
Contiene:  mysql-connector-j (líneas 55-59)
Estado:    NO REQUIERE CAMBIOS
```

---

## 🎯 FLUJO RECOMENDADO

```
1. Lee: SETUP_MYSQL_VISUAL_RESUMEN.md
   └─ (5 minutos, visión general)

2. Ejecuta Paso 1-8 de arriba
   └─ (10 minutos, configuración)

3. Si necesitas más detalles:
   └─ Lee: SETUPBDMYSQL_COMPLETO.md

4. Si falla algo:
   └─ Ve a: TROUBLESHOOTING en SETUPBDMYSQL_COMPLETO.md
```

---

## 🚀 ACCIONES POR TOMAR

### Inmediatas (Ahora)

```bash
# 1. Navega al proyecto
cd D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT

# 2. Inicia Docker
docker-compose up -d

# 3. Verifica que está corriendo
docker ps
```

### En 5 minutos

```bash
# 4. Carga el script SQL en MySQL Workbench
# (ver instrucciones en SETUP_MYSQL_VISUAL_RESUMEN.md)

# 5. Compila Backend
cd realprint-backend
mvn clean compile
```

### En 10 minutos

```bash
# 6. Ejecuta tests
mvn test

# 7. Genera JAR
mvn clean package -DskipTests

# 8. Inicia Backend
java -jar target/realprint-backend-0.0.1-SNAPSHOT.jar
```

---

## 🔑 CREDENCIALES (Guardar)

```
MySQL/Docker:
  Host:       127.0.0.1
  Puerto:     3306
  Usuario:    realprint
  Contraseña: realprint123
  BD:         realprint_db

Usuario de Prueba (Admin):
  Usuario:    admin
  Contraseña: admin123

Usuario de Prueba (Cliente):
  Usuario:    cliente1
  Contraseña: cliente123
```

---

## 📊 ESTRUCTURA CREADA

```
BD: realprint_db
├── Tabla: usuarios
│   ├── Columnas: id, username, password_hash, nombre, email, rol, activo
│   └── Registros: 2 (admin, cliente1)
│
├── Tabla: pedidos
│   ├── Columnas: id, cliente_id, servicio, estado, total, fechas, archivos, etc
│   └── Registros: 2 (pedidos de prueba)
│
├── Índices: username, cliente_id, estado, fecha, etc
└── Conectividad: ✓ LISTO
```

---

## 🧪 VERIFICACIÓN RÁPIDA

```bash
# ¿Docker está corriendo?
docker ps | grep gordon-mysql

# ¿MySQL responde?
docker exec gordon-mysql mysql -u realprint -p realprint123 realprint_db -e "SELECT COUNT(*) FROM usuarios;"

# ¿Backend se inició?
curl http://localhost:8080/api/auth/health

# ¿Backend se conecta a BD?
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 📚 DOCUMENTOS POR CATEGORÍA

### Orientación y Setup
- ✅ SETUP_MYSQL_VISUAL_RESUMEN.md (aquí estás)
- ✅ SETUPBDMYSQL_COMPLETO.md (referencia)

### Instrucciones Detalladas
- ✅ GUIA_MYSQL_PASO_A_PASO.md (paso a paso)
- ✅ APLICACION_PROPERTIES_MYSQL.md (configuración)

### Archivos de Ejecución
- ✅ realprint-database-mysql.sql (script)
- ✅ docker-compose.yml (infraestructura)
- ✅ application.properties (configuración)

---

## 🎉 RESULTADO ESPERADO

Cuando termines todos los pasos:

```
✓ Docker corriendo con MySQL
✓ BD realprint_db creada
✓ Usuarios y pedidos de prueba insertados
✓ Backend compila sin errores
✓ Tests pasan 100%
✓ Backend inicia en puerto 8080
✓ Frontend puede conectar al Backend
✓ Flujo completo de login → obtener JWT → acceder a endpoints
```

---

## 🆘 Si Necesitas Ayuda

1. Revisa: SETUPBDMYSQL_COMPLETO.md → Sección TROUBLESHOOTING
2. Verifica comandos docker: `docker-compose logs -f mysql`
3. Verifica credenciales en application.properties
4. Verifica que realprint_db existe en MySQL

---

## ⏱️ Tiempo Estimado Total

```
Lectura documentación:    5 minutos
Docker setup:             3 minutos
Script SQL:               3 minutos
Compilación:              5 minutos
Tests y Package:          5 minutos
Verificación:             2 minutos
────────────────────────
TOTAL:                    ~23 minutos
```

---

## 🎯 SIGUIENTE PASO

**Ahora ejecuta**:
```bash
cd D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT
docker-compose up -d
```

Luego sigue los pasos en **SETUP_MYSQL_VISUAL_RESUMEN.md**

---

**Índice Completo - MySQL Setup v1.0 | 2026-04-28**

