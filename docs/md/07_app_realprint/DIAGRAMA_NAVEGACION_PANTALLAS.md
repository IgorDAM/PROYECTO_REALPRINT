# Diagrama de navegacion por pantallas (sitemap) - RealPrint

Fecha: 2026-03-29  
Alcance: vista visual por pantallas agrupadas por area funcional (Publico, Admin, Cliente, Operario).

## 1) Sitemap visual

```mermaid
flowchart LR
    %% Publico
    subgraph PUB[Publico]
        P1[/]
        P2[/login]
    end

    %% Admin
    subgraph ADM[Admin]
        A0[/admin]
        A1[/admin/pedidos]
        A2[/admin/historial]
        A3[/admin/inventario]
        A4[/admin/usuarios]
        A5[/admin/productos-finales]
        A6[/admin/reportes]
        A7[/admin/configuracion]
    end

    %% Cliente
    subgraph CLI[Cliente]
        C0[/cliente]
        C1[/cliente/nuevo-pedido]
        C2[/cliente/editar-pedido/:id]
        C3[/cliente/historial]
        C4[/cliente/configuracion]
    end

    %% Operario
    subgraph OPE[Operario]
        O0[/operario]
        O1[/operario/tareas]
        O2[/operario/pedidos]
        O3[/operario/configuracion]
    end

    %% Entrada publica
    P1 --> P2

    %% Login hacia dashboard por rol
    P2 -->|rol admin| A0
    P2 -->|rol cliente| C0
    P2 -->|rol operario| O0

    %% Navegacion interna Admin
    A0 --> A1
    A0 --> A2
    A0 --> A3
    A0 --> A4
    A0 --> A5
    A0 --> A6
    A0 --> A7

    %% Navegacion interna Cliente
    C0 --> C1
    C0 --> C3
    C0 --> C4
    C1 --> C2

    %% Navegacion interna Operario
    O0 --> O1
    O0 --> O2
    O0 --> O3
```

## 2) Nota de lectura

- Este diagrama muestra estructura visual de pantallas.
- Las reglas de seguridad/redireccion por rol se documentan en `md/07_app_realprint/DIAGRAMA_NAVEGACION_RUTAS.md`.

## Referencias

- `App-RealPrint/src/App.tsx`
- `App-RealPrint/src/components/layout/ProtectedRoute.tsx`
- `App-RealPrint/src/components/layout/Sidebar.tsx`
- `md/07_app_realprint/DIAGRAMA_NAVEGACION_RUTAS.md`

