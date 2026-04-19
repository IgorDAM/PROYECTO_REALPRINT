# 🚀 REALPRINT - PUNTO DE PARTIDA PARA BACKEND

**Fecha:** 2026-04-19  
**Estado del Proyecto:** Frontend ✅ COMPLETO | Backend 🔴 POR INICIAR

---

## 📊 RESUMEN EJECUTIVO

El frontend de RealPrint está **funcional y listo** para conectar backend. Se ha completado:

✅ Flujo de creación de pedidos (3 tipos):
  - Solo Serigrafía
  - Serigrafía + Planchado (prenda propia)
  - Serigrafía + Planchado (prenda RealPrint)

✅ Multiarchivo por pedido + medidas en 2D

✅ Precios dinámicos por rangos (pequeño/mediano/grande) editables en admin

✅ Estados de pedido (pendiente → en_proceso → completado)

✅ Visibilidad cliente/admin con permisos

✅ Admin de inventario, productos finales y usuarios

---

## 🎯 SIGUIENTE PASO: CREAR BACKEND

### ¿Por Dónde Empezar?

**Recomendación: Spring Boot 3.2+ con MySQL**

Razones:
- Frontend espera JSON + Bearer token (estándar REST).
- Queries parametrizadas, validación automática, CORS out-of-box.
- Escala bien para operarios + admin + clientes.

### Estructura de Base de Datos

```sql
-- Usuarios
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role ENUM('admin', 'cliente') NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventario
CREATE TABLE inventario (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  categoria VARCHAR(100),
  stock INT DEFAULT 0,
  stock_minimo INT DEFAULT 0,
  precio DECIMAL(10, 2),
  disponible_para_pedidos BOOLEAN DEFAULT false,
  servicios_disponibles JSON,
  clientes_permitidos JSON,
  usados INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Productos Finales
CREATE TABLE productos_finales (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  servicio VARCHAR(100),
  subservicio VARCHAR(100),
  quien_ropa VARCHAR(100),
  prenda VARCHAR(100),
  modelo VARCHAR(100),
  talla VARCHAR(50),
  precio DECIMAL(10, 2),
  en_caja BOOLEAN DEFAULT false,
  tamano_caja INT DEFAULT 50,
  materiales JSON,
  clientes_permitidos JSON,
  productos_inventario JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Pedidos
CREATE TABLE pedidos (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  cliente_id INT NOT NULL,
  cliente VARCHAR(255),
  servicio VARCHAR(100),
  subservicio VARCHAR(100),
  opcion VARCHAR(100),
  producto_final_id BIGINT,
  pedido VARCHAR(255),
  descripcion TEXT,
  cantidad INT,
  cantidad_unidades INT,
  fecha DATE,
  fecha_entrega DATE,
  measurement_width_cm INT,
  measurement_height_cm INT,
  file_urls JSON,
  estado VARCHAR(50) DEFAULT 'pendiente',
  total DECIMAL(10, 2),
  box_total INT,
  cajas_completadas INT DEFAULT 0,
  tamano_caja INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
  FOREIGN KEY (producto_final_id) REFERENCES productos_finales(id)
);

-- Precios Config (opcional fase 1)
CREATE TABLE precios_config (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ranges JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 📄 DOCUMENTO CLAVE

**Archivo: `BACKEND_SPECIFICATION.md`**

Contiene:
- ✅ Contrato de endpoints esperados por frontend
- ✅ DTOs y ejemplos de request/response
- ✅ Plan de activación incremental con feature flags
- ✅ Estructura de carpetas Spring Boot recomendada
- ✅ Dependencias `pom.xml`
- ✅ Checklist de backend

---

## 🔧 ACTIVACIÓN INCREMENTAL

El frontend tiene **feature flags** para activar backend sin romper la app:

```env
# .env - Cambiar gradualmente a true conforme backend esté listo

VITE_USE_LOCAL_AUTH=true          # → false cuando /auth/login esté listo
VITE_USE_PEDIDOS_SERVICE_CREATE=false    # → true cuando POST /pedidos esté listo
VITE_USE_PEDIDOS_SERVICE_UPDATE=false    # → true cuando PUT /pedidos/:id esté listo
VITE_USE_PEDIDOS_SERVICE_DELETE=false    # → true cuando DELETE /pedidos/:id esté listo
VITE_USE_INVENTARIO_SERVICE_CREATE=false # → true cuando POST /inventario esté listo
# ... (idem para update/delete + usuarios)
```

Esto permite:
- Desarrollar backend en paralelo sin romper frontend.
- Testear new endpoints sin afectar la UX.
- Rollback seguro si hay problemas.

---

## 📋 CHECKLIST PRÓXIMAS ACCIONES

### Backend (Esta semana)

- [ ] Crear proyecto Spring Boot 3.2
- [ ] Configurar MySQL / H2 en dev
- [ ] Crear entidades (Pedido, Inventario, ProductoFinal, Usuario)
- [ ] Implementar `/auth/login` (JWT)
- [ ] Implementar CRUD `/pedidos`
- [ ] Implementar CRUD `/inventario`
- [ ] Implementar CRUD `/productos-finales`
- [ ] Implementar CRUD `/usuarios`
- [ ] Tests básicos de integración
- [ ] Documentar setup + how-to-run

### Frontend (Cuando backend esté)

- [ ] Cambiar `.env` para activar flags de servicios
- [ ] Validar flujos end-to-end
- [ ] Ajustar manejo de errores si aplica
- [ ] Agregar loading states mejorados

---

## 🎁 RECURSOS DISPONIBLES

En el repositorio:

```
PROYECTO_REALPRINT/
├── BACKEND_SPECIFICATION.md          ← 📖 LEE ESTO PRIMERO
├── App-RealPrint/
│   ├── src/services/
│   │   ├── httpClient.ts             ← Cliente HTTP centralizado
│   │   ├── pedidosService.ts         ← Interfaz esperada
│   │   ├── inventarioService.ts      ← Interfaz esperada
│   │   ├── usuariosService.ts        ← Interfaz esperada
│   │   └── authService.ts            ← Gestiona login/token
│   ├── src/context/data/
│   │   ├── dataConfig.ts             ← Feature flags
│   │   └── pedidosDomain.ts          ← Lógica de negocio pedidos
│   └── .env                          ← Variables configurables
└── md/07_app_realprint/
    ├── REFERENCIA_RAPIDA.md          ← Guía de arquitectura frontend
    └── GUIA_FUNCIONAL_FRONTEND.md    ← Flujos detallados
```

---

## 💡 TIPS DE IMPLEMENTACIÓN

1. **Comienza por Auth**
   - JWT con expiración de 24h
   - Refresh token opcional (fase 2)

2. **Luego Pedidos**
   - Es el corazón del negocio
   - Necesita validaciones (stock, permisos cliente)

3. **Inventario en paralelo**
   - Sin dependencias críticas
   - Permite admin testear antes

4. **Productos Finales**
   - Más complejos (contienen materiales)
   - Implementar después de inventario

5. **Usuarios en ultimo**
   - Necesario para permisos
   - Puede ser muy simple al inicio (admin solo crea)

---

## 🚀 GO/NO-GO DECISION

### ✅ GO - Empezar Backend YA

Motivos:
- Frontend define contratos claros ✓
- API esperada bien documentada ✓
- Servicios HTTP preparados ✓
- Feature flags para activación segura ✓
- Equipo frontend en standby (puede iterar localmente) ✓

### Riesgos si esperas:

- 🔴 Perder contexto del proyecto
- 🔴 Frontend se queda sin evoluir
- 🔴 Integración tardía = bugs inesperados

---

## 📞 CONTACTO / DUDAS

Si necesitas:
- Clarificación de un endpoint → ver `BACKEND_SPECIFICATION.md`
- Entender flujo frontend → ver `md/07_app_realprint/GUIA_FUNCIONAL_FRONTEND.md`
- Probar servicios locales → cambiar `VITE_USE_LOCAL_AUTH=true` en `.env`

---

**Fecha de inicio recomendada:** INMEDIATAMENTE  
**Duración estimada MVP (Fase 1):** 1 semana  
**Prioridad:** 🔴 ALTA

¡Adelante! 🎯

