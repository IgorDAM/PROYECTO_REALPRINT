# REALPRINT - PUNTO DE PARTIDA PARA BACKEND
Fecha: 2026-04-19
Estado: Frontend COMPLETO | Backend POR INICIAR
COMPLETADO:
- Flujo de creacion de pedidos (3 tipos)
- Multiarchivo por pedido + medidas en 2D
- Precios dinamicos por rangos editables
- Estados de pedido (pendiente -> en_proceso -> completado)
- Visibilidad cliente/admin con permisos
- Admin de inventario, productos finales y usuarios
DOCUMENTO PRINCIPAL: BACKEND_SPECIFICATION.md
RECOMENDACION: Spring Boot 3.2+ con MySQL
ESTRUCTURA BD BASICA:
- Usuarios
- Inventario  
- Productos Finales
- Pedidos
- Precios Config (opcional)
FEATURE FLAGS (.env):
VITE_USE_LOCAL_AUTH=true (cambiar a false)
VITE_USE_PEDIDOS_SERVICE_CREATE=false (cambiar a true)
VITE_USE_PEDIDOS_SERVICE_UPDATE=false (cambiar a true)
VITE_USE_PEDIDOS_SERVICE_DELETE=false (cambiar a true)
VITE_USE_INVENTARIO_SERVICE_CREATE=false (cambiar a true)
PLAN IMPLEMENTACION:
1. Crear proyecto Spring Boot 3.2
2. Configurar MySQL/H2 en dev
3. Crear entidades
4. Implementar /auth/login (JWT)
5. Implementar CRUD /pedidos
6. Implementar CRUD /inventario
7. Implementar CRUD /productos-finales
8. Implementar CRUD /usuarios
PRIORIDAD: ALTA
DURACION MVP: 1 semana
RECURSOS EN REPOSITORIO:
- BACKEND_SPECIFICATION.md (contractos exactos)
- App-RealPrint/src/services/ (clientes HTTP preparados)
- App-RealPrint/.env (feature flags)
- md/07_app_realprint/ (documentacion frontend)
¡Adelante!
