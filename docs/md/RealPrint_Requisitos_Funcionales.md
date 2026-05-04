# 📋 REQUISITOS FUNCIONALES - RealPrint

**Proyecto**: RealPrint - Sistema de gestión de órdenes para taller de impresión  
**Versión**: 2.1 (resumen breve)  
**Fecha**: 2024

---

## 1. Resumen ejecutivo

Este documento resume los requisitos funcionales principales de RealPrint según el backend actual.

### Alineación con el backend
- `Pedido` usa la relación `cliente` (`@ManyToOne`) y `PedidoArchivo` para los adjuntos.
- `clienteNombre` existe como dato derivado en `PedidoDTO` / `PedidoMapper`, no como campo persistente.
- Ya no se usan campos obsoletos como `creadoPorId`, `creadoPorNombre`, `subservicio`, `opcion`, `productoFinalId`, `boxTotal`, `cajasCompletadas` ni `fileUrlsJson`.
- Solo el cliente crea pedidos; el administrador los consulta, actualiza, asigna precio y elimina.
- Los clientes suben archivos y los administradores los descargan.

---

## 2. Tabla resumen de requisitos

| ID | Módulo | Requisito | Estado |
|---|---|---|---|
| RF-001 | Autenticación | Login / Logout con JWT | ✅ Implementado |
| RF-002 | Seguridad | Autorización por roles | ✅ Implementado |
| RF-003 | Usuarios | Crear usuario | ✅ Implementado |
| RF-004 | Usuarios | Listar usuarios | ✅ Implementado |
| RF-005 | Usuarios | Actualizar usuario | ✅ Implementado |
| RF-006 | Usuarios | Desactivar usuario | ✅ Implementado |
| RF-007 | Usuarios | Cambiar contraseña | ⚠️ Parcial |
| RF-008 | Pedidos | Crear pedido | ✅ Implementado |
| RF-009 | Pedidos | Ver mis pedidos | ✅ Implementado |
| RF-010 | Pedidos | Ver pedidos de todos | ✅ Implementado |
| RF-011 | Pedidos | Filtrar por estado | ✅ Implementado |
| RF-012 | Pedidos | Cambiar estado | ✅ Implementado |
| RF-013 | Pedidos | Asignar precio | ✅ Implementado |
| RF-014 | Pedidos | Eliminar pedido | ✅ Implementado |
| RF-015 | Archivos | Subir archivo | ✅ Implementado |
| RF-016 | Archivos | Descargar archivo | ✅ Implementado |
| RF-017 | Archivos | Listar archivos del pedido | ✅ Implementado |
| RF-018 | Validación | Validación de datos | ✅ Implementado |
| RF-019 | Auditoría | Registro básico de cambios | ⚠️ Parcial |
| RF-020 | Notificaciones | Notificar cambio de estado | ⏳ Futuro |
| RF-021 | Reportes | Generar reporte de pedidos | ⏳ Futuro |
| RF-022 | Reportes | Descargar comprobante | ⏳ Futuro |

**Resumen**: 17 implementados, 2 parciales y 3 futuros.

---

## 3. Requisitos por módulo

### RF-001 y RF-002: autenticación y seguridad
- El usuario inicia sesión con `username` y `password`.
- El sistema devuelve un JWT válido durante 24 horas.
- Los roles son `ADMIN` y `CLIENTE`.
- `ADMIN` gestiona usuarios y pedidos; `CLIENTE` crea pedidos y sube archivos.
- El acceso a rutas protegidas se controla con Spring Security y `@PreAuthorize`.

### RF-003 a RF-006: gestión de usuarios
- El administrador puede crear, listar, editar y desactivar usuarios.
- La desactivación es lógica (`activo = false`).
- Las contraseñas se almacenan con BCrypt.
- La respuesta no debe exponer `passwordHash`.

### RF-007: cambiar contraseña
- El servicio existe, pero aún no hay endpoint REST dedicado.
- El cambio debe validar la contraseña actual antes de guardar la nueva.

### RF-008 a RF-014: gestión de pedidos
- El cliente crea un pedido con servicio, cantidad, medidas, descripción y fechas.
- El backend asigna automáticamente el cliente autenticado al pedido.
- El DTO puede devolver `clienteNombre` como dato derivado.
- El administrador ve todos los pedidos, filtra por estado, cambia estado, asigna precio y elimina pedidos.
- Los estados manejados son: `PENDIENTE`, `EN_PROCESO`, `COMPLETADO`, `ENVIADO` y `CANCELADO`.

### RF-015 a RF-017: gestión de archivos
- El cliente sube archivos al pedido.
- Se admiten archivos PDF, JPG, JPEG y PNG con límite de 10 MB.
- El administrador puede descargar archivos.
- Los archivos se listan dentro del pedido mediante la relación `PedidoArchivo`.

### RF-018 y RF-019: validación y auditoría
- El backend valida los datos con Bean Validation.
- El frontend también valida para mejorar la experiencia de usuario.
- El proyecto guarda timestamps de creación y actualización.
- La auditoría completa de cambios sigue siendo una mejora pendiente.

### RF-020 a RF-022: funcionalidades futuras
- Notificaciones al cambiar el estado del pedido.
- Reportes exportables de pedidos.
- Descarga de comprobantes para el cliente.

---

## 4. Casos de prueba clave

- Login correcto devuelve JWT.
- Login con usuario inactivo devuelve error.
- Cliente no puede acceder a rutas de administración.
- Cliente crea pedido y queda asociado a su usuario.
- Administrador ve todos los pedidos.
- Administrador cambia estado y asigna precio.
- Cliente sube archivo correctamente.
- Administrador descarga archivo correctamente.
- Validaciones erróneas devuelven `400 Bad Request`.

---

## 5. Conclusión

RealPrint cubre los requisitos funcionales principales del sistema: autenticación, usuarios, pedidos, archivos y validación.

**Estado general**: base funcional completa, con algunas mejoras pendientes en auditoría, notificaciones y reportes.
