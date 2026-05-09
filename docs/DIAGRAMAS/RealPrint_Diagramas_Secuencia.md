# Diagramas de secuencia minimos (RealPrint)

## 1) Login (flujo actual)

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario
    participant L as LoginForm/useLogin
    participant A as AuthContext
    participant S as authService
    participant LS as localStorage
    participant API as Backend /api/auth/login

    U->>L: Enviar credenciales
    L->>A: login(username, password)
    A->>S: authService.login()

    alt Modo actual (VITE_USE_LOCAL_AUTH=true)
        S->>LS: Validar usuario demo
        S->>LS: Guardar user + token local
        S-->>A: Respuesta local (user + token)
    else API real (VITE_USE_LOCAL_AUTH=false)
        S->>API: POST /api/auth/login
        API-->>S: { token, user }
        S->>LS: Guardar user + token
        S-->>A: Respuesta API (user + token)
    end

    A-->>L: Resultado login
    L-->>U: Redirigir a /admin o /cliente
```

## 2) Creacion de pedido (flujo actual)

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente
    participant F as CreateOrderForm
    participant O as orderService
    participant D as pedidosDomain
    participant API as Backend /api
    participant MEM as Estado local (React)

    C->>F: Completar formulario
    F->>O: uploadFile(file)

    alt Upload OK
        O->>API: POST /api/files
        API-->>O: { url }
        O-->>F: url archivo
    else Upload falla
        O-->>F: error
        F->>F: Usar nombre de archivo local
    end

    C->>F: Confirmar pedido
    F->>D: createPedidoSafe(payload)

    alt Modo actual (VITE_USE_PEDIDOS_SERVICE_CREATE=false)
        D->>MEM: addPedido() en memoria/local
        D-->>F: Pedido creado local
    else API real (VITE_USE_PEDIDOS_SERVICE_CREATE=true)
        D->>API: POST /api/pedidos (fileUrls -> fileUrlsJson)
        API-->>D: 201 Created + pedido
        D-->>F: Pedido creado remoto
    end

    F-->>C: Toast de éxito + navegar a /cliente
```

## Nota

- Estos diagramas reflejan el comportamiento por defecto actual en desarrollo.
- Las ramas de API real se activan al cambiar los flags en `frontend/.env`.

