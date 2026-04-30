# RealPrint - Sistema de Gestión de Pedidos

Sistema integral de gestión de pedidos para servicios de impresión personalizada, con frontend moderno y backend REST seguro.

## 📁 Estructura del Proyecto

```
PROYECTO_REALPRINT/
├── frontend/              # React + Vite + TypeScript
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/               # Spring Boot 4.0.5 + Java 17
│   ├── src/
│   ├── pom.xml
│   └── target/
├── docker/                # Configuración Docker
│   └── docker-compose.yml
├── scripts/               # Base de datos y utilidades
│   └── realprint-database-mysql.sql
├── docs/                  # Documentación
│   ├── DIAGRAMAS/
│   ├── INTERFACES/
│   └── md/
└── README.md
```

## 🚀 Inicio Rápido

### Requisitos Previos
- **Node.js** 18+
- **Java** 17+
- **Maven** 3.8+
- **MySQL** 8.0+
- **Docker** (opcional)

### 1. Configurar Base de Datos

```bash
# Abrir MySQL y ejecutar el script
mysql -u root -p < scripts/realprint-database-mysql.sql
```

O si usas Workbench:
1. Abre MySQL Workbench
2. Ejecuta `scripts/realprint-database-mysql.sql`

### 2. Arrancar Backend

```bash
cd backend
mvn spring-boot:run
```

El backend estará disponible en `http://localhost:8080/api`

**Usuarios de prueba:**
- `admin` / `admin123`
- `cliente1` / `cliente123`

### 3. Arrancar Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📋 Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Login de usuario

### Pedidos
- `GET /api/pedidos` - Listar pedidos
- `POST /api/pedidos` - Crear pedido
- `PUT /api/pedidos/:id` - Actualizar pedido
- `DELETE /api/pedidos/:id` - Eliminar pedido

### Usuarios
- `GET /api/usuarios` - Listar usuarios
- `POST /api/usuarios` - Crear usuario

## 🛠️ Stack Tecnológico

### Frontend
- **React** 18.2
- **Vite** 8.0
- **TypeScript** 5.9
- **React Router** 7.12
- **Tailwind CSS** 3.3
- **Zod** 4.3 (Validación)

### Backend
- **Spring Boot** 4.0.5
- **Java** 17
- **MySQL** 8.0
- **Spring Security** + JWT
- **JPA/Hibernate** ORM
- **Lombok**

## 🔒 Seguridad

- Autenticación basada en JWT
- Contraseñas hasheadas con BCrypt
- CORS configurado
- Validación de entrada con Zod

## 📝 Notas Importantes

### Context Path
El backend usa context path `/api`:
- URLs base: `http://localhost:8080/api`
- Las rutas en controladores son relativas al contexto
- Ej: `@RequestMapping("/pedidos")` → `/api/pedidos`

### BD MySQL
- Host: `localhost:3306`
- Database: `realprint_db`
- Usuario: `root`
- Contraseña: `root123`

## 📚 Documentación Adicional

Ver carpeta `/docs` para:
- Diagramas de arquitectura
- Interfaces de usuario
- Documentación técnica detallada

## 🐛 Troubleshooting

### Backend no inicia
```bash
# Limpia build anterior
mvn clean
mvn spring-boot:run
```

### Error de conexión a BD
- Verifica que MySQL está corriendo: `net start MySQL80`
- Comprueba credenciales en `backend/src/main/resources/application.yml`

### Frontend no conecta al backend
- Verifica CORS en `backend/src/main/java/.../config/CorsConfig.java`
- Backend debe estar en `http://localhost:8080/api`

## 👨‍💻 Desarrollo

### Modo desarrollo con hot reload

**Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Build para producción

**Backend:**
```bash
cd backend
mvn clean package -DskipTests
```

**Frontend:**
```bash
cd frontend
npm run build
```

## 📞 Contacto & Soporte

Para reportar bugs o sugerencias, contacta al equipo de desarrollo.
