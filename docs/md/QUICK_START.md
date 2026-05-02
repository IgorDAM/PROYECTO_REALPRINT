# 🚀 Quick Start - RealPrint

Guía rápida para arrancar el proyecto completo.

## 📋 Requisitos Previos

Instala estos antes de continuar:

- **Java 17+**: https://adoptopenjdk.net/
- **Maven 3.8+**: https://maven.apache.org/download.cgi
- **Node.js 18+**: https://nodejs.org/
- **MySQL 8.0+**: https://dev.mysql.com/downloads/mysql/

## ⚡ Inicio Rápido (3 pasos)

### 1️⃣ Setup Inicial (Primera vez solamente)

```bash
scripts\SETUP.bat
```

Esto:
- ✅ Verifica Java, Maven, Node.js, MySQL
- ✅ Crea la base de datos `realprint_db`
- ✅ Instala dependencias del backend (Maven)
- ✅ Instala dependencias del frontend (npm)

### 2️⃣ Inicia Todo de Una Vez

```bash
scripts\START_ALL.bat
```

Se abrirán 2 ventanas:
- 🔵 Backend en `http://localhost:8080/api`
- ⚪ Frontend en `http://localhost:5173`

### 3️⃣ Accede a la Aplicación

Abre tu navegador y ve a: **http://localhost:5173**

**Usuarios de prueba:**
- Usuario: `admin` | Contraseña: `admin123`
- Usuario: `cliente1` | Contraseña: `cliente123`

---

## 🎯 Scripts Disponibles

### `SETUP.bat` - Setup Inicial
Ejecuta UNA SOLA VEZ al clonar el proyecto.

```bash
scripts\SETUP.bat
```

**Qué hace:**
- Verifica requisitos (Java, Maven, Node, MySQL)
- Crea BD MySQL con esquema
- Instala dependencias del backend
- Instala dependencias del frontend

---

### `START_ALL.bat` - Inicia Todo (Recomendado)
Abre 2 ventanas: backend + frontend.

```bash
scripts\START_ALL.bat
```

**Ventajas:**
- Más simple: un solo comando
- Monitorea ambos procesos en paralelo
- Fácil para desarrollo

**URLs generadas:**
- Backend: `http://localhost:8080/api`
- Frontend: `http://localhost:5173`

---

### `START_BACKEND.bat` - Inicia Solo Backend
Para cuando quieres iniciar procesos separados.

```bash
scripts\START_BACKEND.bat
```

**Requisitos:**
- MySQL debe estar corriendo
- BD `realprint_db` debe existir

**Puerto:** `8080` con contexto `/api`

---

### `START_FRONTEND.bat` - Inicia Solo Frontend
Frontend en modo desarrollo con Vite (hot reload).

```bash
scripts\START_FRONTEND.bat
```

**Requisitos:**
- Backend debe estar corriendo en `http://localhost:8080/api`

**Puerto:** `5173`

---

### `CLEAN.bat` - Limpia & Resetea
Elimina builds, node_modules y caches.

```bash
scripts\CLEAN.bat
```

**Cuándo usar:**
- Después de cambiar ramas con `git`
- Cuando hay conflictos de dependencias
- Para resetear el estado del proyecto

**Después de limpiar, ejecuta `SETUP.bat` de nuevo.**

---

## 🔧 Troubleshooting

### ❌ "Maven not found"
```
Solución: Añade Maven a PATH
  1. Instala Maven desde https://maven.apache.org/download.cgi
  2. Añade C:\Program Files\Maven\bin a PATH de Windows
  3. Reinicia terminal/cmd
```

### ❌ "Node not found"
```
Solución: Instala Node.js desde https://nodejs.org/
  (elige versión LTS 18+)
```

### ❌ "MySQL not accessible"
```
Solución: 
  1. Verifica MySQL está corriendo: net start MySQL80
  2. Verifica credenciales en application.yml
  3. Crea BD manualmente si es necesario
```

### ❌ "Port 8080 already in use"
```
Solución:
  1. Encuentra el proceso: netstat -ano | findstr :8080
  2. Mata el proceso: taskkill /PID <pid> /F
  3. O cambia puerto en backend/src/main/resources/application.yml
```

### ❌ "Port 5173 already in use"
```
Solución:
  1. Frontend automáticamente usará otro puerto (5174, 5175, etc)
  2. O mata el proceso anterior: taskkill /PID <pid> /F
```

---

## 📝 Estructura de Carpetas

```
PROYECTO_REALPRINT/
├── frontend/           ← Frontend React (Vite)
├── backend/            ← Backend Spring Boot
├── docker/             ← Docker Compose
├── docs/               ← Documentación
├── scripts/            ← Scripts de inicio (TÚ ESTÁS AQUÍ)
│   ├── SETUP.bat       ← Setup inicial
│   ├── START_ALL.bat   ← Inicia todo
│   ├── START_BACKEND.bat
│   ├── START_FRONTEND.bat
│   ├── CLEAN.bat
│   └── realprint-database-mysql.sql
└── README.md
```

---

## 🌐 URLs de Acceso

| Componente | URL | Usuario/Pass |
|-----------|-----|---|
| Frontend | http://localhost:5173 | admin/admin123 |
| Backend API | http://localhost:8080/api | - |
| MySQL | localhost:3306 | root/root123 |

---

## 💡 Tips

### Hot Reload
- **Frontend** automáticamente recarga cambios (Vite)
- **Backend** requiere recompilación manual (Maven)

### Ver logs
- Abre DevTools (F12) en el navegador para errores frontend
- Backend logs aparecen en la terminal

### Base de datos
- Usuario BD: `root`
- Contraseña BD: `root123`
- Base de datos: `realprint_db`

### Git
Al cambiar ramas, ejecuta:
```bash
scripts\CLEAN.bat
scripts\SETUP.bat
```

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa el log del backend (terminal)
2. Revisa DevTools del navegador (F12)
3. Verifica que MySQL está corriendo
4. Intenta limpiar y resetear: `scripts\CLEAN.bat` → `scripts\SETUP.bat`
5. Reinicia todo

---

¡Listo! 🎉 Disfruta desarrollando RealPrint.
