# E2E - Flujos Críticos

Este directorio contiene pruebas E2E con Playwright para flujos críticos:

- Login por rol (`admin`, `cliente`, `operario`)
- Rutas protegidas por rol
- CRUD crítico de inventario en admin

## Estructura

- `specs/auth-roles.spec.js`: autenticación y redirección por rol
- `specs/protected-routes.spec.js`: control de acceso por rol
- `specs/admin-inventario-crud.spec.js`: crear/editar/eliminar producto
- `support/auth.js`: helper de login y limpieza de estado

## Ejecutar

```bash
npm run test:e2e
npm run test:e2e:headed
npm run test:e2e:ui
```

## Notas de estabilidad

- Las pruebas limpian `localStorage` y `sessionStorage` antes de ejecutar.
- El flujo de inventario usa un nombre único por timestamp para evitar colisiones.
- Configuración en `playwright.config.js` levanta Vite en `http://127.0.0.1:4173`.

