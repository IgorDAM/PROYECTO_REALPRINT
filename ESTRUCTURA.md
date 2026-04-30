# 📁 Estructura del Proyecto - Reorganización Completada ✅

## Nueva Estructura

```
PROYECTO_REALPRINT/
│
├── 📂 frontend/                   ← React + Vite + TypeScript
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .gitignore
│   ├── .env
│   ├── .env.production
│   └── netlify.toml
│
├── 📂 backend/                    ← Spring Boot 4.0.5 + Java 17
│   ├── src/
│   ├── target/                    (compilado)
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   ├── .mvn/
│   ├── backend.log
│   ├── cleanup-backend.bat
│   └── HELP.md
│
├── 📂 docker/                     ← Orquestación Docker
│   ├── docker-compose.yml         (con rutas actualizadas)
│   └── mysql.cnf
│
├── 📂 scripts/                    ← Scripts de utilidad
│   ├── 🎯 SETUP.bat              (setup inicial - ejecuta UNA VEZ)
│   ├── 🎯 START_ALL.bat          (inicia backend + frontend)
│   ├── 🎯 START_BACKEND.bat
│   ├── 🎯 START_FRONTEND.bat
│   ├── 🎯 CLEAN.bat              (limpia builds y caches)
│   ├── START_REALPRINT.bat        (legacy)
│   ├── START_REALPRINT_FAST.bat   (legacy)
│   ├── DIAGNOSTICO.bat            (legacy)
│   └── realprint-database-mysql.sql
│
├── 📂 docs/                       ← Documentación completa
│   ├── 📂 DIAGRAMAS/
│   ├── 📂 INTERFACES/
│   ├── 📂 md/
│   └── (archivos markdown técnicos)
│
├── 📂 uploads/                    ← Archivos cargados por usuarios
│   └── (se llena en tiempo de ejecución)
│
├── 🎯 LAUNCH.bat                  ← Menú principal (ejecuta desde aquí)
├── 📖 README.md                   ← Documentación principal
├── 📖 QUICK_START.md              ← Guía rápida de inicio
├── .gitignore                     ← Reglas para Git
├── .idea/                         ← IntelliJ IDEA config
└── realprint-backend/             ← (DEPRECATED - será eliminado)

```

---

## ✨ Lo que cambió

| Antes | Ahora | Razón |
|-------|-------|-------|
| `App-RealPrint/` | `frontend/` | Nombrado consistente |
| `realprint-backend/` | `backend/` | Nombrado consistente |
| Raíz desorganizada | `docker/` + `scripts/` + `docs/` | Estructura clara |
| Archivos sueltos | Organizados en carpetas | Fácil localización |
| Sin punto de entrada | `LAUNCH.bat` | Inicio intuitivo |

---

## 🚀 Cómo Iniciar (Ahora)

### Primera vez (Setup completo):
```bash
LAUNCH.bat → Opción 2: Setup Inicial
```

### Desarrollo diario:
```bash
LAUNCH.bat → Opción 1: Inicio Rápido
```

O directamente:
```bash
scripts\START_ALL.bat
```

---

## 📊 Comparación de Rutas

### Backend
- **Antes**: `realprint-backend/src/main/...`
- **Ahora**: `backend/src/main/...`
- **Script**: `scripts/START_BACKEND.bat`

### Frontend
- **Antes**: `App-RealPrint/src/...`
- **Ahora**: `frontend/src/...`
- **Script**: `scripts/START_FRONTEND.bat`

### Base de Datos
- **Antes**: `realprint-database-mysql.sql` (raíz)
- **Ahora**: `scripts/realprint-database-mysql.sql`
- **Docker**: `docker/docker-compose.yml`

### Documentación
- **Antes**: `DIAGRAMAS/`, `INTERFACES/`, `md/` (raíz)
- **Ahora**: `docs/DIAGRAMAS/`, `docs/INTERFACES/`, `docs/md/`

---

## 📝 Scripts Disponibles

| Script | Uso | Cuándo |
|--------|-----|--------|
| **LAUNCH.bat** | Menú principal | Siempre (punto de entrada) |
| **SETUP.bat** | Setup inicial | Primera vez o después de git clean |
| **START_ALL.bat** | Backend + Frontend | Desarrollo |
| **START_BACKEND.bat** | Solo backend | Debugging |
| **START_FRONTEND.bat** | Solo frontend | Debugging |
| **CLEAN.bat** | Limpia todo | Conflictos o cambios de rama |

---

## 🌐 URLs de Acceso

```
Frontend:  http://localhost:5173
Backend:   http://localhost:8080/api
MySQL:     localhost:3306
```

---

## ✅ Beneficios

1. ✅ **Estructura monorepo clara**: Todo en una carpeta con separación nítida
2. ✅ **Nombrado consistente**: `frontend` + `backend` (no mezclado)
3. ✅ **Fácil onboarding**: `LAUNCH.bat` → todo funciona
4. ✅ **Organización documentación**: `docs/` centraliza todo
5. ✅ **Scripts automatizados**: `SETUP.bat` configura todo automáticamente
6. ✅ **Git limpio**: `.gitignore` raíz con reglas globales
7. ✅ **Docker ready**: `docker/` separado para composición

---

## 🔄 Migración de IDEs

Si usas IntelliJ / VS Code:

```
Frontend:  Abre carpeta: frontend/
Backend:   Abre carpeta: backend/
O ambas:   Abre raíz (workspace)
```

---

## 🛠️ Próximos Pasos Recomendados

1. Ejecuta: `LAUNCH.bat`
2. Selecciona opción **2** (Setup)
3. Una vez completo, selecciona opción **1** (Inicio Rápido)
4. Accede a http://localhost:5173

¡Listo! 🎉

