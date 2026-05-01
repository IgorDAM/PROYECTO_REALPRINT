# Requisitos Funcionales - RealPrint

**Proyecto**: RealPrint - Sistema de Gestión de Órdenes de Trabajo para Taller de Impresión  
**Versión**: 1.0  
**Fecha**: 2026

---

## 📋 Tabla de Resumen

| ID | Nombre | Prioridad | Complejidad | Estado |
|---|---|---|---|---|
| RF-001 | Autenticación de Usuario (Login/Logout) | Alta | Simple | ✅ Implementado |
| RF-002 | Autorización por Roles (ADMIN/CLIENTE) | Alta | Simple | ✅ Implementado |
| RF-003 | Crear Usuario | Alta | Media | ✅ Implementado |
| RF-004 | Listar Usuarios | Alta | Simple | ✅ Implementado |
| RF-005 | Activar/Desactivar Usuario | Media | Simple | ✅ Implementado |
| RF-006 | Cliente Crea Nueva Orden | Alta | Media | ✅ Implementado |
| RF-007 | Cliente Visualiza Sus Órdenes | Alta | Simple | ✅ Implementado |
| RF-008 | Cliente Descarga Archivos de Orden | Alta | Media | ✅ Implementado |
| RF-009 | Admin Visualiza Todas las Órdenes | Alta | Simple | ✅ Implementado |
| RF-010 | Admin Filtra Órdenes por Estado | Alta | Media | ✅ Implementado |
| RF-011 | Admin Cambia Estado de Orden | Alta | Media | ✅ Implementado |
| RF-012 | Admin Asigna Precio a Orden | Alta | Media | ✅ Implementado |
| RF-013 | Admin Carga Archivos en Orden | Alta | Media | ✅ Implementado |
| RF-014 | Admin Cancela Orden | Media | Simple | ✅ Implementado |
| RF-015 | Validación de Datos de Entrada | Alta | Media | ✅ Implementado |
| RF-016 | Generación de Número Único de Orden | Alta | Simple | ✅ Implementado |
| RF-017 | Auditoría de Cambios | Media | Media | 🔄 Parcial |
| RF-018 | Notificaciones de Cambio de Estado | Media | Media | ⏳ Futuro |
| RF-019 | Descarga de Comprobante/Factura | Media | Media | ⏳ Futuro |
| RF-020 | Reporte de Órdenes | Media | Media | ⏳ Futuro |

---

## ✅ REQUISITOS FUNCIONALES DETALLADOS

### RF-001: Autenticación de Usuario (Login/Logout)

**Actor Principal**: Usuario (Cliente o Admin)

**Descripción**: 
El usuario ingresa su nombre de usuario y contraseña para acceder a la plataforma. El sistema valida las credenciales, genera un token JWT y mantiene la sesión activa.

**Prioridad**: Alta

**Complejidad**: Simple

**Precondiciones**:
- Usuario registrado en la base de datos
- Usuario activo (campo activo = true)

**Flujo Principal**:
1. Usuario accede a la página de login
2. Ingresa username y contraseña
3. Sistema valida que los campos no estén vacíos
4. Sistema consulta BD por username
5. Sistema compara hash de contraseña con BCrypt
6. Si coinciden: Sistema genera token JWT (expira en 24h)
7. Sistema almacena token en localStorage (frontend)
8. Sistema redirige a dashboard según rol (ADMIN vs CLIENTE)

**Flujos Alternativos**:
- 4.1: Username no existe → Mostrar error "Credenciales inválidas"
- 5.1: Contraseña incorrecta → Mostrar error "Credenciales inválidas"
- 2.1: Usuario inactivo → Mostrar "Usuario desactivado, contacte admin"
- Logout: Usuario hace clic en logout → Eliminar token localStorage → Redirigir a login

**Postcondiciones**:
- Usuario autenticado
- Token JWT válido en localStorage
- Sesión activa por 24 horas
- Acceso a endpoints protegidos

**Excepciones**:
- Campo vacío: Mostrar validación en tiempo real
- Contraseña olvidada: Mensaje "Contacte al administrador"
- Token expirado: Redirigir automático a login
- Error BD: Mostrar "Intenta más tarde"

---

### RF-002: Autorización por Roles (ADMIN/CLIENTE)

**Actor Principal**: Sistema (middleware de autorización)

**Descripción**: 
El sistema verifica el rol del usuario autenticado y controla el acceso a funciones específicas. Admin accede a todas las órdenes, Cliente solo a sus propias órdenes.

**Prioridad**: Alta

**Complejidad**: Simple

**Precondiciones**:
- Usuario autenticado (token JWT válido)
- Usuario tiene rol asignado (ADMIN o CLIENTE)

**Flujo Principal**:
1. Usuario intenta acceder a recurso protegido
2. Sistema extrae token JWT
3. Sistema decodifica token y obtiene rol
4. Sistema valida permisos según rol:
   - **ADMIN**: Acceso total a todas órdenes, usuarios, reportes
   - **CLIENTE**: Acceso solo a sus propias órdenes
5. Si autorizado: Permitir acceso
6. Si no autorizado: Retornar 403 Forbidden

**Flujos Alternativos**:
- Cliente intenta ver órdenes de otro cliente → 403 Forbidden
- Cliente intenta cambiar estado de orden → 403 Forbidden
- Admin intenta crear pedido como cliente → Permitir (puede crear para otros)

**Postcondiciones**:
- Usuario accede solo a recursos permitidos
- Logs de intento de acceso no autorizado

**Excepciones**:
- Token inválido: 401 Unauthorized
- Rol ausente: 403 Forbidden

---

### RF-003: Crear Usuario

**Actor Principal**: Administrador

**Descripción**: 
El admin crea una nueva cuenta de usuario (Cliente o Admin) en el sistema con username, password y datos personales.

**Prioridad**: Alta

**Complejidad**: Media

**Precondiciones**:
- Usuario admin autenticado
- Acceso a formulario "Crear Usuario"

**Flujo Principal**:
1. Admin accede a "Gestión de Usuarios" → "Crear Usuario"
2. Completa formulario:
   - Username (único)
   - Nombre completo
   - Email (opcional)
   - Contraseña (validar fortaleza)
   - Rol (ADMIN o CLIENTE)
   - Estado (activo/inactivo)
3. Sistema valida:
   - Username no exista (unique constraint)
   - Contraseña mínimo 8 caracteres
   - Email formato válido
4. Sistema hashea contraseña con BCrypt
5. Sistema guarda usuario en BD
6. Sistema retorna mensaje "Usuario creado exitosamente"
7. Sistema genera número único de usuario

**Flujos Alternativos**:
- 3.1: Username ya existe → Mostrar error "Username duplicado"
- 3.2: Contraseña débil → Sugerir más caracteres, números, símbolos
- 3.3: Email inválido → Mostrar error de formato

**Postcondiciones**:
- Usuario nuevo en BD
- Usuario puede autenticarse
- Email confirmado (si aplica)
- Logs de creación registrados

**Excepciones**:
- Error BD: Rollback transacción, mostrar error genérico
- Permisos insuficientes: Solo admin puede hacer esto

---

### RF-004: Listar Usuarios

**Actor Principal**: Administrador

**Descripción**: 
El admin visualiza un listado de todos los usuarios del sistema con opción de filtrar, buscar y paginar.

**Prioridad**: Alta

**Complejidad**: Simple

**Precondiciones**:
- Usuario admin autenticado
- Al menos 1 usuario existe en la BD

**Flujo Principal**:
1. Admin accede a "Gestión de Usuarios"
2. Sistema carga lista paginada (20 usuarios por página)
3. Muestra: ID, Username, Nombre, Email, Rol, Estado, Acciones
4. Admin puede:
   - Filtrar por rol (ADMIN/CLIENTE)
   - Filtrar por estado (activo/inactivo)
   - Buscar por username o nombre
   - Ordenar por columnas (nombre, fecha creación)
5. Admin hace clic en usuario para ver detalles o editar

**Flujos Alternativos**:
- No hay usuarios: Mostrar "No hay usuarios registrados"
- Búsqueda sin resultados: Mostrar "No coincide búsqueda"

**Postcondiciones**:
- Lista actualizada mostrada
- Admin puede ejecutar acciones (editar, desactivar)

---

### RF-005: Activar/Desactivar Usuario

**Actor Principal**: Administrador

**Descripción**: 
El admin puede desactivar un usuario (soft delete) sin borrar sus datos. Usuario desactivado no puede autenticarse.

**Prioridad**: Media

**Complejidad**: Simple

**Precondiciones**:
- Usuario admin autenticado
- Usuario objetivo existe en BD

**Flujo Principal**:
1. Admin ve listado de usuarios
2. Admin hace clic en usuario
3. Sistema muestra detalles
4. Admin hace clic en "Desactivar" o "Activar"
5. Sistema cambia campo activo (true/false)
6. Sistema guarda cambio
7. Sistema muestra confirmación

**Flujos Alternativos**:
- Desactivar último admin: Mostrar advertencia (dejaría sistema sin admin)

**Postcondiciones**:
- Usuario desactivado no puede hacer login
- Órdenes del usuario aún visibles (no se borran)

---

### RF-006: Cliente Crea Nueva Orden

**Actor Principal**: Cliente

**Descripción**: 
El cliente crea una nueva orden de trabajo especificando servicio, cantidad, medidas, descripción y archivos de diseño.

**Prioridad**: Alta

**Complejidad**: Media

**Precondiciones**:
- Cliente autenticado
- Acceso a formulario "Nueva Orden"

**Flujo Principal**:
1. Cliente hace clic en "Nueva Orden"
2. Sistema muestra formulario con campos:
   - Servicio (dropdown): Serigrafía, Planchado, Diseño, Otro
   - Subservicio (opcional): Variante específica
   - Opción (opcional): Flujo particular
   - Cantidad: Número de unidades
   - Medidas: Ancho (cm) × Alto (cm)
   - Descripción: Detalles del trabajo (máx 2000 caracteres)
   - Archivos: Cargar designs (PNG, PDF, JPG, máx 10MB c/u)
   - Fecha entrega (opcional): Sugerida por sistema
3. Cliente completa campos
4. Sistema valida:
   - Servicio seleccionado
   - Cantidad > 0
   - Medidas > 0
   - Archivo < 10MB
   - Formatos permitidos (PNG, PDF, JPG, SVG)
5. Cliente hace clic "Crear Orden"
6. Sistema genera ID único de orden (formato: ORD-20260115-0001)
7. Sistema asigna estado: PENDIENTE
8. Sistema registra fecha/hora creación
9. Sistema asigna usuario creador (cliente mismo)
10. Sistema guarda en BD
11. Sistema muestra confirmación con número de orden
12. Sistema notifica Admin de nueva orden

**Flujos Alternativos**:
- 3.1: Cliente olvida archivo → Permitir crear sin archivo
- 4.1: Cantidad > 1000 → Mostrar advertencia, pedir confirmación
- 4.2: Archivo inválido → Mostrar error, permitir reintentar
- 4.3: Formato archivo no permitido → Mostrar formatos válidos

**Postcondiciones**:
- Orden creada con estado PENDIENTE
- Orden visible en "Mis Órdenes" para cliente
- Orden visible en bandeja trabajo para admin
- Archivos almacenados en servidor

**Excepciones**:
- Session expirada: Redirigir a login
- Error BD: Mostrar "Error al crear orden, intenta más tarde"
- Almacenamiento lleno: Mostrar "Espacio insuficiente"

---

### RF-007: Cliente Visualiza Sus Órdenes

**Actor Principal**: Cliente

**Descripción**: 
El cliente ve un listado de todas sus órdenes con filtros, búsqueda y paginación.

**Prioridad**: Alta

**Complejidad**: Simple

**Precondiciones**:
- Cliente autenticado
- Al menos 1 orden creada por cliente

**Flujo Principal**:
1. Cliente accede a "Mis Órdenes"
2. Sistema consulta BD: SELECT * FROM pedidos WHERE cliente_id = ? ORDER BY fecha DESC
3. Sistema muestra tabla paginada (10-20 órdenes/página):
   - ID Orden (ORD-YYYYMMDD-0001)
   - Servicio
   - Cantidad
   - Fecha Creación
   - Estado (PENDIENTE, CONFIRMADO, ENVIADO, ENTREGADO, CANCELADO)
   - Precio (si asignado)
   - Acciones: Ver, Descargar
4. Cliente puede:
   - Filtrar por estado
   - Buscar por ID orden o servicio
   - Ver detalles de orden
5. Estado mostrado con color: Rojo (PENDIENTE), Amarillo (CONFIRMADO), Azul (ENVIADO), Verde (ENTREGADO), Gris (CANCELADO)

**Flujos Alternativos**:
- No hay órdenes: "No tienes órdenes. ¡Crea una!"
- Búsqueda sin resultados: "No coincide búsqueda"

**Postcondiciones**:
- Cliente ve sus órdenes organizadas
- Cliente puede acceder a detalles

---

### RF-008: Cliente Descarga Archivos de Orden

**Actor Principal**: Cliente

**Descripción**: 
El cliente descarga los archivos (diseños) asociados a su orden de trabajo.

**Prioridad**: Alta

**Complejidad**: Media

**Precondiciones**:
- Cliente autenticado
- Orden tiene archivos asociados
- Cliente es propietario de la orden

**Flujo Principal**:
1. Cliente visualiza orden
2. Sistema muestra sección "Archivos":
   - Lista de archivos (nombre, tipo, tamaño, fecha carga)
3. Cliente hace clic en archivo o botón "Descargar"
4. Sistema valida:
   - Cliente es propietario
   - Archivo existe
5. Sistema sirve archivo como descarga (Content-Disposition: attachment)
6. Navegador inicia descarga del archivo
7. Sistema registra log de descarga

**Flujos Alternativos**:
- No hay archivos: Mostrar "Esta orden no tiene archivos"
- Archivo no encontrado: Mostrar error

**Postcondiciones**:
- Archivo descargado
- Log de descarga registrado

---

### RF-009: Admin Visualiza Todas las Órdenes

**Actor Principal**: Administrador

**Descripción**: 
El admin ve un listado completo de todas las órdenes del taller, independientemente del cliente.

**Prioridad**: Alta

**Complejidad**: Simple

**Precondiciones**:
- Admin autenticado
- Al menos 1 orden existe

**Flujo Principal**:
1. Admin accede a "Bandeja de Trabajo" o "Todas las Órdenes"
2. Sistema consulta: SELECT * FROM pedidos ORDER BY fecha DESC
3. Sistema muestra tabla paginada:
   - ID Orden
   - Cliente (nombre)
   - Servicio
   - Cantidad
   - Medidas
   - Estado
   - Fecha Creación
   - Fecha Entrega
   - Total Asignado
   - Acciones: Ver, Editar, Cambiar Estado, Descargar, Eliminar
4. Admin puede filtrar por:
   - Estado (PENDIENTE, CONFIRMADO, ENVIADO, ENTREGADO, CANCELADO)
   - Rango fechas
   - Cliente
   - Servicio
5. Admin puede ordenar por cualquier columna

**Flujos Alternativos**:
- No hay órdenes: "Bandeja vacía"
- Filtro sin resultados: "No hay órdenes que coincidan"

**Postcondiciones**:
- Admin visualiza estado completo del taller
- Admin puede ejecutar acciones sobre órdenes

---

### RF-010: Admin Filtra Órdenes por Estado

**Actor Principal**: Administrador

**Descripción**: 
El admin filtra las órdenes según su estado actual en el flujo de producción.

**Prioridad**: Alta

**Complejidad**: Media

**Precondiciones**:
- Admin autenticado
- Órdenes existen en diferentes estados

**Flujo Principal**:
1. Admin ve listado de órdenes
2. Sistema muestra dropdown "Filtrar por Estado":
   - PENDIENTE (no procesada)
   - CONFIRMADO (aceptada, en producción)
   - ENVIADO (completada, en transporte)
   - ENTREGADO (finalizada)
   - CANCELADO (rechazada)
3. Admin selecciona estado(s)
4. Sistema filtra: SELECT * FROM pedidos WHERE estado IN (?)
5. Tabla actualiza mostrando solo órdenes de ese estado
6. Sistema muestra contador: "45 órdenes PENDIENTE"

**Flujos Alternativos**:
- Seleccionar múltiples estados: Mostrar órdenes que coincidan cualquiera
- Sin órdenes en estado: "No hay órdenes en estado CANCELADO"

**Postcondiciones**:
- Lista filtrada mostrada
- Admin ve prioritario (ej: PENDIENTE primero)

---

### RF-011: Admin Cambia Estado de Orden

**Actor Principal**: Administrador

**Descripción**: 
El admin transiciona el estado de una orden según el flujo de producción: PENDIENTE → CONFIRMADO → ENVIADO → ENTREGADO (o CANCELADO en cualquier momento).

**Prioridad**: Alta

**Complejidad**: Media

**Precondiciones**:
- Admin autenticado
- Orden existe
- Estado actual es válido para transición

**Flujo Principal**:
1. Admin ve listado de órdenes
2. Admin hace clic en orden → Ver detalles
3. Sistema muestra estado actual y opciones de transición disponibles
4. Admin selecciona nuevo estado del dropdown:
   - Si PENDIENTE → Opciones: CONFIRMADO, CANCELADO
   - Si CONFIRMADO → Opciones: ENVIADO, PENDIENTE, CANCELADO
   - Si ENVIADO → Opciones: ENTREGADO, CONFIRMADO, CANCELADO
   - Si ENTREGADO → Opciones: Ninguna (estado final)
   - Si CANCELADO → Opciones: Ninguna (estado final, pero puede reactivar a PENDIENTE)
5. Admin selecciona nuevo estado
6. Sistema (opcional) pide motivo del cambio (comentario)
7. Admin hace clic "Cambiar Estado"
8. Sistema valida transición válida
9. Sistema actualiza campo estado en BD
10. Sistema registra cambio en auditoría: usuario, estado anterior, estado nuevo, timestamp
11. Sistema muestra confirmación
12. (Futuro) Sistema envía notificación al cliente del cambio

**Flujos Alternativos**:
- 8.1: Transición inválida → Mostrar "No puedes cambiar a este estado"
- Admin agrega comentario → Registrar nota en BD

**Postcondiciones**:
- Estado de orden actualizado
- Auditoría registrada
- Cliente notificado (futuro)
- Listado actualizado

---

### RF-012: Admin Asigna Precio a Orden

**Actor Principal**: Administrador

**Descripción**: 
El admin calcula e ingresa el precio total de producción de una orden. Cliente puede ver el precio si se asigna.

**Prioridad**: Alta

**Complejidad**: Media

**Precondiciones**:
- Admin autenticado
- Orden en estado PENDIENTE o CONFIRMADO
- Orden tiene cantidad y servicio definidos

**Flujo Principal**:
1. Admin visualiza orden
2. Sistema muestra sección "Precio":
   - Campo cantidad (pre-llenado)
   - Campo servicio (pre-llenado)
   - Campo precio unitario (admin ingresa)
   - Sistema calcula: Subtotal = cantidad × precio_unitario
   - Campo descuento (opcional, %)
   - Campo impuesto (si aplica, %)
   - Campo total (auto-calculado)
3. Admin ingresa precio unitario (ej: $5.00)
4. Sistema calcula automáticamente totales
5. Admin (opcional) ingresa descuento o aplica descuento por volumen
6. Admin hace clic "Asignar Precio"
7. Sistema valida:
   - Precio > 0
   - Precio es número válido
8. Sistema actualiza BD: UPDATE pedidos SET total = ? WHERE id = ?
9. Sistema registra auditoría del cambio de precio
10. Sistema muestra confirmación
11. Cliente puede ahora ver el precio en su orden

**Flujos Alternativos**:
- Admin ingresa precio inválido: Mostrar validación
- Descuento mayor a total: Mostrar advertencia
- Orden ya tiene precio: Permitir editar con confirmación

**Postcondiciones**:
- Precio asignado a orden
- Auditoría registrada
- Cliente ve precio en su portal

---

### RF-013: Admin Carga Archivos en Orden

**Actor Principal**: Administrador

**Descripción**: 
El admin sube archivos a una orden (especificaciones técnicas, artes finales, instrucciones adicionales, etc).

**Prioridad**: Alta

**Complejidad**: Media

**Precondiciones**:
- Admin autenticado
- Orden existe
- Archivos < 10MB c/u

**Flujo Principal**:
1. Admin visualiza orden → Sección "Archivos"
2. Sistema muestra botón "Cargar Archivo"
3. Admin hace clic
4. Sistema abre diálogo "Seleccionar Archivo"
5. Admin selecciona archivo(s) del PC
6. Sistema valida:
   - Tamaño < 10MB
   - Formato permitido (PNG, PDF, JPG, SVG, DOC, DOCX)
   - No es duplicado (mismo nombre)
7. Sistema sube archivo(s) a servidor (directorio: /uploads/pedidos/{pedido_id}/)
8. Sistema crea registro en BD (tabla: pedido_archivos)
   - nombreArchivo
   - urlArchivo
   - tipoMime
   - tamaño
   - createdAt
9. Sistema muestra confirmación "Archivo(s) cargado(s)"
10. Tabla de archivos actualiza automáticamente
11. Sistema registra auditoría: quién cargó, cuándo

**Flujos Alternativos**:
- Archivo > 10MB: Mostrar error de tamaño
- Formato no permitido: Mostrar formatos válidos
- Error almacenamiento: Mostrar error genérico

**Postcondiciones**:
- Archivos almacenados en servidor
- Registros en BD
- Cliente y admin pueden descargar

---

### RF-014: Admin Cancela Orden

**Actor Principal**: Administrador

**Descripción**: 
El admin cancela una orden, cambiando su estado a CANCELADO y registrando el motivo.

**Prioridad**: Media

**Complejidad**: Simple

**Precondiciones**:
- Admin autenticado
- Orden no está en estado ENTREGADO o CANCELADO

**Flujo Principal**:
1. Admin visualiza orden
2. Admin hace clic en botón "Cancelar Orden"
3. Sistema muestra diálogo de confirmación
4. Sistema pide motivo de cancelación (dropdown):
   - Cliente solicitó
   - Error de especificaciones
   - Problema de producción
   - Otro (libre)
5. Admin selecciona motivo e ingresa comentario (opcional)
6. Admin confirma "Sí, cancelar"
7. Sistema cambia estado a CANCELADO
8. Sistema registra auditoría: usuario, motivo, timestamp
9. Sistema muestra confirmación
10. (Futuro) Sistema notifica cliente de cancelación

**Flujos Alternativos**:
- Orden ya cancelada: Mostrar "Orden ya cancelada"
- Orden ya entregada: Mostrar "No puedes cancelar orden entregada"

**Postcondiciones**:
- Orden en estado CANCELADO
- Auditoría registrada
- Cliente notificado (futuro)

---

### RF-015: Validación de Datos de Entrada

**Actor Principal**: Sistema

**Descripción**: 
El sistema valida todos los datos ingresados por usuarios (frontend + backend) para asegurar integridad y seguridad.

**Prioridad**: Alta

**Complejidad**: Media

**Precondiciones**:
- Usuario intenta crear o actualizar recurso

**Validaciones Implementadas**:

**Frontend (React + Zod)**:
- Campos vacíos: Requeridos
- Cantidad: Número > 0
- Medidas: Números válidos, > 0
- Email: Formato válido
- Contraseña: Mínimo 8 caracteres
- Precio: Número positivo, máximo 2 decimales
- Archivos: Tamaño < 10MB, formato permitido
- Descripción: Máximo 2000 caracteres
- Feedback en tiempo real (rojo si error)

**Backend (Spring Boot + Bean Validation)**:
- @NotNull, @NotBlank en campos requeridos
- @Positive para cantidades y precios
- @Size para strings
- @Email para emails
- @Max, @Min para rangos
- Custom validators para lógica compleja
- SQL Injection prevention: Prepared statements (JPA automático)

**Flujo de Validación**:
1. Usuario ingresa datos
2. Frontend valida (feedback inmediato)
3. Usuario envía formulario
4. Backend valida nuevamente (nunca confiar en frontend)
5. Si error: Retornar 400 Bad Request con detalles
6. Si válido: Procesar datos

**Excepciones**:
- Datos inválidos: 400 Bad Request
- Tipo de dato incorrecto: Rechazar
- Inyección SQL/XSS: Sanitizar/Rechazar

---

### RF-016: Generación de Número Único de Orden

**Actor Principal**: Sistema

**Descripción**: 
El sistema genera automáticamente un número único e identificable para cada orden creada.

**Prioridad**: Alta

**Complejidad**: Simple

**Precondiciones**:
- Orden se crea

**Formato de Número**:
```
ORD-YYYYMMDD-NNNN

Ejemplo: ORD-20260115-0042
- ORD: Prefijo fijo
- YYYYMMDD: Fecha creación (20260115 = 15 enero 2026)
- NNNN: Número secuencial del día (0001, 0002, ..., 9999)
```

**Flujo**:
1. Cliente crea orden
2. Sistema obtiene fecha actual: 2026-01-15
3. Sistema consulta BD: SELECT MAX(numero_orden) FROM pedidos WHERE fecha = '2026-01-15'
4. Si existen órdenes hoy: número_secuencial = max + 1 (ej: 0043)
5. Si no existen: número_secuencial = 0001
6. Sistema genera: ORD-20260115-0043
7. Sistema almacena en campo id (o número_orden) en BD
8. Sistema retorna número al cliente

**Postcondiciones**:
- Número único generado
- No hay duplicados
- Fácilmente identificable por fecha y secuencia

---

### RF-017: Auditoría de Cambios

**Actor Principal**: Sistema

**Descripción**: 
El sistema registra todos los cambios importantes (estado, precio, archivos) con detalles de quién, qué, cuándo.

**Prioridad**: Media

**Complejidad**: Media

**Precondiciones**:
- Cambio ocurre en orden (estado, precio, archivo)

**Eventos Auditados**:
- Creación de orden
- Cambio de estado
- Asignación de precio
- Cambio de precio
- Carga de archivo
- Descarga de archivo
- Cambio de usuario

**Datos Registrados** (tabla: auditoria_logs o similar):
```
- id: Long (PK)
- usuario_id: Long (FK) → Usuario que hizo el cambio
- accion: String (CREAR_ORDEN, CAMBIAR_ESTADO, ASIGNAR_PRECIO, etc)
- tabla_afectada: String (pedidos, pedido_archivos)
- registro_id: Long (ID del pedido afectado)
- cambios_anteriores: JSON (valores antes)
- cambios_nuevos: JSON (valores después)
- timestamp: LocalDateTime (cuándo)
- ip_address: String (de dónde, opcional)
```

**Ejemplo de Registro**:
```json
{
  "usuario_id": 5,
  "accion": "CAMBIAR_ESTADO",
  "tabla_afectada": "pedidos",
  "registro_id": 42,
  "cambios_anteriores": {
    "estado": "PENDIENTE"
  },
  "cambios_nuevos": {
    "estado": "CONFIRMADO"
  },
  "timestamp": "2026-01-15T10:30:45"
}
```

**Flujo**:
1. Admin cambia estado de orden
2. Sistema realiza cambio en BD
3. Sistema crea registro en tabla auditoria_logs
4. Sistema registra: quién (usuario_id), qué (acción), cuándo (timestamp)
5. Admin puede ver historial de cambios en "Historial de Orden"

**Acceso**:
- Admin: Ver historial completo
- Cliente: Ver historial de sus órdenes (sin usuario_id de admin)
- Auditoría: Acceso a report de auditoria para compliance

---

### RF-018: Notificaciones de Cambio de Estado

**Actor Principal**: Sistema

**Descripción**: 
El sistema notifica al cliente cuando su orden cambia de estado (PENDIENTE → CONFIRMADO, etc).

**Prioridad**: Media

**Complejidad**: Media

**Estado**: Futuro (opcional)

**Canales**:
- Email
- Notificación en app (badge/ícono)
- SMS (futuro, opcional)

**Flujo**:
1. Admin cambia estado de orden (ej: PENDIENTE → CONFIRMADO)
2. Sistema dispara evento "OrdenEstadoCambiado"
3. Sistema envía email a cliente:
   ```
   Subject: Tu orden ORD-20260115-0042 fue confirmada
   
   Hola [NombreCliente],
   
   Tu orden ORD-20260115-0042 ha sido confirmada.
   Nuevo estado: CONFIRMADO
   Fecha estimada de entrega: 2026-01-20
   
   Ver más detalles: [link]
   ```
4. Sistema registra notificación enviada en BD

**Notificaciones Automáticas**:
- PENDIENTE → CONFIRMADO: "Tu orden fue confirmada"
- CONFIRMADO → ENVIADO: "Tu orden está siendo enviada"
- ENVIADO → ENTREGADO: "Tu orden fue entregada"
- Cualquier estado → CANCELADO: "Tu orden fue cancelada. Motivo: [motivo]"

---

### RF-019: Descarga de Comprobante/Factura

**Actor Principal**: Cliente

**Descripción**: 
El cliente descarga un PDF con comprobante o factura de su orden cuando está completada.

**Prioridad**: Media

**Complejidad**: Media

**Estado**: Futuro (opcional)

**Precondiciones**:
- Orden tiene precio asignado
- Orden en estado ENVIADO, ENTREGADO o CANCELADO

**Flujo**:
1. Cliente visualiza orden
2. Sistema muestra botón "Descargar Comprobante"
3. Cliente hace clic
4. Sistema genera PDF en memoria con:
   - Número de orden
   - Fecha
   - Cliente (nombre, email)
   - Servicio, cantidad, medidas
   - Precio unitario, subtotal, descuento, impuesto, total
   - Estado actual
   - Número de factura (si aplica)
5. Sistema descarga PDF al navegador
6. Nombre archivo: ORD-20260115-0042.pdf

---

### RF-020: Reporte de Órdenes

**Actor Principal**: Administrador

**Descripción**: 
El admin genera reportes de órdenes con filtros por rango fechas, estado, cliente, servicio y exporta a CSV/PDF.

**Prioridad**: Media

**Complejidad**: Media

**Estado**: Futuro (opcional)

**Filtros Disponibles**:
- Rango fechas (desde - hasta)
- Estado(s)
- Cliente
- Servicio
- Rango precio (mín - máx)

**Columnas del Reporte**:
- ID Orden
- Cliente
- Servicio
- Cantidad
- Fecha Creación
- Fecha Entrega
- Estado
- Total
- Observaciones

**Estadísticas**:
- Total órdenes
- Total ingresos
- Promedio por orden
- Órdenes por estado
- Órdenes por servicio
- Tasa cancelación

**Exportación**:
- CSV: Abrir en Excel
- PDF: Imprimible, con gráficos

---

## 📊 Dependencias entre Requisitos

```
RF-001 (Login)
  ├─→ RF-002 (Autorización)
  ├─→ RF-006 (Crear Orden) [Cliente]
  ├─→ RF-007 (Ver Mis Órdenes) [Cliente]
  ├─→ RF-009 (Ver Todas Órdenes) [Admin]
  └─→ RF-003, RF-004, RF-005 (Gestionar Usuarios) [Admin]

RF-006 (Crear Orden)
  ├─→ RF-015 (Validación)
  ├─→ RF-016 (Número Único)
  ├─→ RF-017 (Auditoría)
  └─→ RF-018 (Notificación) [Futuro]

RF-011 (Cambiar Estado)
  ├─→ RF-017 (Auditoría)
  └─→ RF-018 (Notificación) [Futuro]

RF-012 (Asignar Precio)
  ├─→ RF-017 (Auditoría)
  └─→ RF-019 (Comprobante) [Futuro]
```

---

## 🎯 Cobertura de Requisitos

- ✅ **Implementados**: RF-001 a RF-017 (17/20)
- 🔄 **Parcialmente**: RF-017 (auditoría básica)
- ⏳ **Futuro**: RF-018, RF-019, RF-020

