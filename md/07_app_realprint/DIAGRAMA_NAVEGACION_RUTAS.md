# Diagrama de navegacion de rutas - RealPrint

Fecha: 2026-03-29  
Alcance: rutas del frontend React segun `App-RealPrint/src/App.tsx` y reglas de `ProtectedRoute`.

## 1) Vista global de navegacion

```mermaid
flowchart TD
    A[Usuario entra a la app] --> B{Ruta solicitada}

    B -->|/| C[Redirect a /login]
    B -->|/login| D[Pantalla Login]
    B -->|/admin/*| E[ProtectedRoute admin]
    B -->|/cliente/*| F[ProtectedRoute cliente]
    B -->|/operario/*| G[ProtectedRoute operario]
    B -->|*| H[Fallback: redirect a /login]

    D --> I{Login correcto?}
    I -->|No| D
    I -->|Si, rol=admin| J[/admin]
    I -->|Si, rol=cliente| K[/cliente]
    I -->|Si, rol=operario| L[/operario]

    E --> M{Sesion valida y rol admin?}
    F --> N{Sesion valida y rol cliente?}
    G --> O{Sesion valida y rol operario?}

    M -->|No sesion| D
    N -->|No sesion| D
    O -->|No sesion| D

    M -->|Sesion + rol ok| P[Modulo Admin]
    N -->|Sesion + rol ok| Q[Modulo Cliente]
    O -->|Sesion + rol ok| R[Modulo Operario]

    M -->|Rol distinto| S[Redirect a /{user.role}]
    N -->|Rol distinto| S
    O -->|Rol distinto| S
```

## 2) Rutas por rol

### Publicas

- `/login`
- `/` -> redirect a `/login`
- `*` -> redirect a `/login`

### Admin (`/admin`)

- `/admin`
- `/admin/pedidos`
- `/admin/historial`
- `/admin/inventario`
- `/admin/usuarios`
- `/admin/productos-finales`
- `/admin/reportes`
- `/admin/configuracion`

### Cliente (`/cliente`)

- `/cliente`
- `/cliente/nuevo-pedido`
- `/cliente/editar-pedido/:id`
- `/cliente/historial`
- `/cliente/configuracion`

### Operario (`/operario`)

- `/operario`
- `/operario/tareas`
- `/operario/pedidos`
- `/operario/configuracion`

## 3) Reglas de redireccion clave

- Sin sesion en ruta protegida -> `/login`.
- Con sesion pero rol no permitido -> `/{user.role}`.
- Login exitoso -> dashboard base por rol (`/admin`, `/cliente`, `/operario`).

## Referencias

- `App-RealPrint/src/App.tsx`
- `App-RealPrint/src/components/layout/ProtectedRoute.tsx`
- `App-RealPrint/src/hooks/useLogin.ts`
- `App-RealPrint/e2e/specs/auth-roles.spec.js`
- `App-RealPrint/e2e/specs/protected-routes.spec.js`

