# 🔖 GUÍA DE REFERENCIA RÁPIDA - MEJORAS PRIORITARIAS

## Si solo tienes 15 minutos... 📋

### 1️⃣ **IMPLEMENTA AHORA (Sin backend)**

```javascript
// Archivo: src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiClient = {
  async get(url) {
    const response = await fetch(`${API_BASE}${url}`);
    return response.json();
  },
  async post(url, data) {
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
```

### 2️⃣ **CREA ARCHIVO .env**

```env
VITE_API_URL=http://localhost:8080/api
VITE_API_TIMEOUT=5000
```

### 3️⃣ **ACTUALIZA AuthContext**

```javascript
// Cambiar de:
localStorage.setItem('realprint_user', JSON.stringify(userData));

// A:
localStorage.setItem('realprint_token', token);
```

---

## Si tienes 1 hora... ⏰

### Orden de implementación:

1. ✅ Crear carpeta `/src/services/`
2. ✅ Crear `api.js` con cliente HTTP
3. ✅ Crear `pedidoService.js` usando `api.js`
4. ✅ Crear `.env`
5. ✅ Actualizar `package.json` con scripts
6. ✅ Crear `useApi.js` hook

**Tiempo:** 45-60 minutos

---

## Si tienes 1 semana... 📅

### Semana 1: Refactorización Frontend

| Día | Tarea | Tiempo |
|-----|-------|--------|
| Lun | Crear servicios API | 2h |
| Mar | Refactorizar AuthContext | 2h |
| Mié | Crear validaciones | 2h |
| Jue | Manejo de errores | 2h |
| Vie | Tests y documentación | 2h |
| Sab | Revisión y ajustes | 2h |

**Total: 12 horas distribuidas**

---

## Si tienes 1 mes... 🗓️

### SEMANA 1: Frontend (preparación)
- Refactorizar con servicios API ✅
- Mejorar validaciones ✅
- Manejo de errores centralizado ✅

### SEMANA 2: Backend (inicio)
- Proyecto SpringBoot inicializado
- Entities de Usuario, Pedido
- DAOs básicos (interface + impl)

### SEMANA 3: Backend (desarrollo)
- Services de negocio
- Controllers REST
- Autenticación JWT
- Convenciones MVC + DAO cerradas

### SEMANA 4: Integración
- Frontend conectado a backend
- Tests básicos
- Deploy local

---

## CHEAT SHEET - Comandos Útiles

### PostgreSQL
```bash
# Crear base de datos
createdb realprint_db

# Conectar
psql -U postgres -d realprint_db

# Docker
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16
```

### SpringBoot
```bash
# Crear proyecto
spring boot create --from spring-boot-starter-web,spring-boot-starter-data-jpa,postgresql

# Ejecutar en desarrollo
mvn spring-boot:run

# Tests
mvn test
```

### React/Vite
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build
```

### Docker
```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

---

## RESPUESTAS RÁPIDAS

**P: ¿Por dónde empiezo?**
→ Abre `MEJORAS_INMEDIATAS.md` sección 1

**P: ¿Cuánto tiempo me llevará?**
→ 2-3 meses si trabajas a tiempo completo

**P: ¿Necesito cambiar mi frontend?**
→ Sí, pero son cambios incrementales

**P: ¿Debo aprender SQL?**
→ Básico sí, Hibernate hace la mayoría

**P: ¿Y después de terminado?**
→ Deploy en la nube (AWS, Heroku, etc.)

---

## ARCHIVOS A CREAR (Orden)

```
Semana 1:
✅ src/services/api.js
✅ src/services/pedidoService.js
✅ src/hooks/useApi.js
✅ src/utils/validators.js
✅ src/utils/errorHandler.js
✅ .env
✅ .env.example

Semana 2+:
⏳ Backend SpringBoot (nuevo proyecto)
⏳ Entities
⏳ Controllers
⏳ Tests
```

---

## ESTRUCTURA FINAL (Objetivo)

```
realprint-project/
├── App-RealPrint/               (Frontend existente)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/            ✨ NUEVO
│   │   │   ├── api.js
│   │   │   └── pedidoService.js
│   │   ├── utils/               ✨ NUEVO
│   │   │   ├── validators.js
│   │   │   └── errorHandler.js
│   │   ├── .env                 ✨ NUEVO
│   │   └── main.jsx
│   └── package.json             (actualizado)
│
├── realprint-backend/           ✨ NUEVO (crear)
│   ├── src/main/java/...
│   │   ├── controller/
│   │   ├── service/
│   │   ├── dao/
│   │   └── dao/impl/
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── README.md
│
├── docker-compose.yml           ✨ NUEVO
├── RESUMEN_EJECUTIVO.md         ✨ GENERADO
├── ANALISIS_Y_PAUTAS.md        ✨ GENERADO
├── MEJORAS_INMEDIATAS.md        ✨ GENERADO
└── EJEMPLOS_Y_TEMPLATES.md      ✨ GENERADO
```

---

## DOCUMENTACIÓN MÍNIMA

Para cada componente/servicio importante:

```javascript
/**
 * @description Obtiene los pedidos del usuario actual
 * @param {number} page - Número de página (default: 0)
 * @param {number} size - Tamaño de página (default: 20)
 * @returns {Promise<Object>} Pedidos paginados
 * @throws {ApiError} Si falla la petición
 * @example
 * const pedidos = await pedidoService.getPedidos(0, 20);
 */
async getPedidos(page = 0, size = 20) {
  // ...
}
```

---

## TESTING MÍNIMO

```javascript
// Ejemplo con Vitest
import { describe, it, expect, vi } from 'vitest';
import { apiClient } from './api';

describe('apiClient', () => {
  it('should make GET request', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => ({ success: true })
    });
    
    const result = await apiClient.get('/test');
    expect(result.success).toBe(true);
  });
});
```

---

## PROBLEMAS COMUNES Y SOLUCIONES

| Problema | Solución |
|----------|----------|
| CORS error | Configurar SpringBoot `@CrossOrigin` |
| Token expirado | Interceptar 401 y redirigir a login |
| Datos no se guardan | Verificar que backend responde 201/200 |
| Validaciones fallan | Usar `FormData` para archivos |
| Lentitud | Agregar paginación y índices en BD |

---

## RECURSOS RÁPIDOS

### Documentación
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [React Docs](https://react.dev)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Vite Guide](https://vitejs.dev)

### Tutoriales
- Traversy Media (YouTube - SpringBoot)
- Net Ninja (YouTube - React)
- Web Dev Simplified (JWT)

### Herramientas
- Postman (testing API)
- pgAdmin (gestión BD)
- DevTools (debugging React)
- Docker (ambiente local)

---

## ESTIMACIÓN DE ESFUERZO

```
Refactorización Frontend:    40 horas
Aprendizaje SpringBoot:      20 horas
Creación Backend:            60 horas
Integración:                 40 horas
Testing:                     30 horas
Documentación:               20 horas
─────────────────────────────────────
TOTAL:                      210 horas ≈ 5 semanas (full-time)
                            o 3 meses (part-time)
```

---

## ÚLTIMA VERIFICACIÓN

Antes de pasar a backend, verifica:

- [ ] `api.js` cliente HTTP funciona
- [ ] `.env` configurado
- [ ] `AuthContext` usa tokens
- [ ] Servicios crean/leen datos
- [ ] Validaciones funcionan
- [ ] Errores se muestran
- [ ] Componentes actualizados

Si todas están ✅, estás listo para backend.

---

**Creado:** 2026-03-20  
**Propósito:** Referencia rápida durante desarrollo  
**Actualizar:** Conforme avances en el proyecto


