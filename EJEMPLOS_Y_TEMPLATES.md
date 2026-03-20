# PLANTILLAS Y EJEMPLOS PRÁCTICOS

## 1. TEMPLATE: Servicio API para el Frontend

**Archivo: src/services/pedidoService.js**

```javascript
import { apiClient } from './api';

export const pedidoService = {
  /**
   * Obtiene todos los pedidos del usuario autenticado
   */
  getPedidos: async (filtros = {}) => {
    const params = new URLSearchParams(filtros);
    const response = await apiClient.get(`/pedidos?${params}`);
    return response.data;
  },

  /**
   * Obtiene un pedido específico por ID
   */
  getPedidoById: async (id) => {
    const response = await apiClient.get(`/pedidos/${id}`);
    return response.data;
  },

  /**
   * Crea un nuevo pedido
   */
  createPedido: async (pedidoData) => {
    // Validación local básica
    if (!pedidoData.servicio) {
      throw new Error('El servicio es requerido');
    }

    const response = await apiClient.post('/pedidos', pedidoData);
    return response.data;
  },

  /**
   * Actualiza un pedido existente
   */
  updatePedido: async (id, pedidoData) => {
    const response = await apiClient.put(`/pedidos/${id}`, pedidoData);
    return response.data;
  },

  /**
   * Elimina un pedido
   */
  deletePedido: async (id) => {
    await apiClient.delete(`/pedidos/${id}`);
  },

  /**
   * Obtiene el historial de un pedido
   */
  getPedidoHistorial: async (id) => {
    const response = await apiClient.get(`/pedidos/${id}/historial`);
    return response.data;
  },

  /**
   * Cambia el estado de un pedido
   */
  changePedidoStatus: async (id, newStatus) => {
    const response = await apiClient.patch(`/pedidos/${id}/status`, {
      estado: newStatus
    });
    return response.data;
  }
};
```

**Archivo: src/services/api.js**

```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE;
    this.timeout = import.meta.env.VITE_API_TIMEOUT || 5000;
  }

  /**
   * Obtiene el token JWT del localStorage
   */
  getToken() {
    return localStorage.getItem('access_token');
  }

  /**
   * Configura headers con autenticación
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Método GET
   */
  async get(url) {
    return this.request(url, { method: 'GET' });
  }

  /**
   * Método POST
   */
  async post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Método PUT
   */
  async put(url, data) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Método PATCH
   */
  async patch(url, data) {
    return this.request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Método DELETE
   */
  async delete(url) {
    return this.request(url, { method: 'DELETE' });
  }

  /**
   * Método genérico para realizar requests
   */
  async request(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        ...options,
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        // Token expirado o no válido
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }

      throw new ApiError(error.message || 'Request failed', 500);
    }
  }
}

class ApiError extends Error {
  constructor(message, status = 500, data = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const apiClient = new ApiClient();
```

---

## 2. TEMPLATE: Entity de Pedido en SpringBoot

**Archivo: entity/Pedido.java**

```java
package com.realprint.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "pedidos", indexes = {
    @Index(name = "idx_cliente_id", columnList = "cliente_id"),
    @Index(name = "idx_estado", columnList = "estado"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operario_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario operario;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PedidoEstado estado = PedidoEstado.PENDIENTE;

    @Column(nullable = false)
    private String servicio; // "serigrafia", "rotulacion", etc.

    @Column(length = 1000)
    private String descripcion;

    @Column(nullable = false)
    private LocalDate fechaEntregaEstimada;

    @Column(name = "fecha_entrega")
    private LocalDateTime fechaEntrega;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleArtículo> detalles;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoHistorial> historial;

    @Column(nullable = false)
    private Double precioTotal = 0.0;

    @Column
    private Double descuento = 0.0;

    // Getters y Setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getCliente() { return cliente; }
    public void setCliente(Usuario cliente) { this.cliente = cliente; }

    public Usuario getOperario() { return operario; }
    public void setOperario(Usuario operario) { this.operario = operario; }

    public PedidoEstado getEstado() { return estado; }
    public void setEstado(PedidoEstado estado) { this.estado = estado; }

    public String getServicio() { return servicio; }
    public void setServicio(String servicio) { this.servicio = servicio; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDate getFechaEntregaEstimada() { return fechaEntregaEstimada; }
    public void setFechaEntregaEstimada(LocalDate fecha) { this.fechaEntregaEstimada = fecha; }

    public LocalDateTime getFechaEntrega() { return fechaEntrega; }
    public void setFechaEntrega(LocalDateTime fecha) { this.fechaEntrega = fecha; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Double getPrecioTotal() { return precioTotal; }
    public void setPrecioTotal(Double precio) { this.precioTotal = precio; }

    public Double getDescuento() { return descuento; }
    public void setDescuento(Double descuento) { this.descuento = descuento; }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

// Enumeración de estados de pedido
public enum PedidoEstado {
    PENDIENTE("Pendiente de aprobación"),
    APROBADO("Aprobado"),
    EN_PROGRESO("En progreso"),
    COMPLETADO("Completado"),
    ENTREGADO("Entregado"),
    CANCELADO("Cancelado");

    private final String descripcion;

    PedidoEstado(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
```

---

## 3. TEMPLATE: DAO (interface + implementación)

**Archivo: dao/PedidoDao.java**

```java
package com.realprint.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.realprint.entity.Pedido;
import com.realprint.entity.PedidoEstado;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PedidoDao {
    Page<Pedido> findByClienteId(Long clienteId, Pageable pageable);
    Optional<Pedido> findById(Long id);
    Pedido save(Pedido pedido);
    List<Pedido> findByEstado(PedidoEstado estado);
    List<Pedido> findPedidosAsignadosA(Long operarioId);
    List<Pedido> findByFechaEntregaEntre(LocalDate inicio, LocalDate fin);
    List<Pedido> findPedidosSinAsignar();
    Page<Pedido> findByServicio(String servicio, Pageable pageable);
    Long countPedidosPorCliente(Long clienteId, LocalDateTime inicio, LocalDateTime fin);
}
```

**Archivo: dao/impl/PedidoDaoImpl.java**

```java
package com.realprint.dao.impl;

import com.realprint.dao.PedidoDao;
import com.realprint.entity.Pedido;
import com.realprint.entity.PedidoEstado;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class PedidoDaoImpl implements PedidoDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Page<Pedido> findByClienteId(Long clienteId, Pageable pageable) {
        List<Pedido> content = em.createQuery(
                "SELECT p FROM Pedido p WHERE p.cliente.id = :clienteId ORDER BY p.createdAt DESC",
                Pedido.class
            )
            .setParameter("clienteId", clienteId)
            .setFirstResult((int) pageable.getOffset())
            .setMaxResults(pageable.getPageSize())
            .getResultList();

        Long total = em.createQuery(
                "SELECT COUNT(p) FROM Pedido p WHERE p.cliente.id = :clienteId",
                Long.class
            )
            .setParameter("clienteId", clienteId)
            .getSingleResult();

        return new PageImpl<>(content, pageable, total);
    }

    // ...resto de metodos DAO siguiendo el mismo patron
}
```

---

## 4. TEMPLATE: Service Layer

**Archivo: service/PedidoService.java**

```java
package com.realprint.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.realprint.entity.Pedido;
import com.realprint.entity.PedidoEstado;
import com.realprint.entity.Usuario;
import com.realprint.dao.PedidoDao;
import com.realprint.dao.UsuarioDao;
import com.realprint.dto.PedidoDTO;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class PedidoService {

    private final PedidoDao pedidoDao;
    private final UsuarioDao usuarioDao;

    public PedidoService(PedidoDao pedidoDao, UsuarioDao usuarioDao) {
        this.pedidoDao = pedidoDao;
        this.usuarioDao = usuarioDao;
    }

    /**
     * Obtiene todos los pedidos de un cliente
     */
    public Page<Pedido> obtenerPedidosDelCliente(Long clienteId, Pageable pageable) {
        return pedidoDao.findByClienteId(clienteId, pageable);
    }

    /**
     * Obtiene un pedido específico
     */
    public Optional<Pedido> obtenerPedido(Long id) {
        return pedidoDao.findById(id);
    }

    /**
     * Crea un nuevo pedido
     */
    public Pedido crearPedido(Long clienteId, PedidoDTO pedidoDTO) {
        Usuario cliente = usuarioDao.findById(clienteId)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setServicio(pedidoDTO.getServicio());
        pedido.setDescripcion(pedidoDTO.getDescripcion());
        pedido.setFechaEntregaEstimada(pedidoDTO.getFechaEntregaEstimada());
        pedido.setPrecioTotal(pedidoDTO.getPrecioTotal());
        pedido.setEstado(PedidoEstado.PENDIENTE);

        return pedidoDao.save(pedido);
    }

    /**
     * Actualiza un pedido
     */
    public Pedido actualizarPedido(Long id, PedidoDTO pedidoDTO) {
        Pedido pedido = pedidoDao.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        pedido.setServicio(pedidoDTO.getServicio());
        pedido.setDescripcion(pedidoDTO.getDescripcion());
        pedido.setFechaEntregaEstimada(pedidoDTO.getFechaEntregaEstimada());
        pedido.setPrecioTotal(pedidoDTO.getPrecioTotal());
        pedido.setUpdatedAt(LocalDateTime.now());

        return pedidoDao.save(pedido);
    }

    /**
     * Cambia el estado de un pedido
     */
    public Pedido cambiarEstado(Long id, PedidoEstado nuevoEstado) {
        Pedido pedido = pedidoDao.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // Validación de transiciones de estado (según lógica de negocio)
        if (!esTransicionValida(pedido.getEstado(), nuevoEstado)) {
            throw new RuntimeException("Transición de estado no permitida");
        }

        pedido.setEstado(nuevoEstado);
        pedido.setUpdatedAt(LocalDateTime.now());

        if (nuevoEstado == PedidoEstado.ENTREGADO) {
            pedido.setFechaEntrega(LocalDateTime.now());
        }

        return pedidoRepository.save(pedido);
    }

    /**
     * Asigna un pedido a un operario
     */
    public Pedido asignarOperario(Long pedidoId, Long operarioId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        Usuario operario = usuarioRepository.findById(operarioId)
            .orElseThrow(() -> new RuntimeException("Operario no encontrado"));

        pedido.setOperario(operario);
        pedido.setUpdatedAt(LocalDateTime.now());

        return pedidoRepository.save(pedido);
    }

    /**
     * Valida las transiciones de estado permitidas
     */
    private boolean esTransicionValida(PedidoEstado actual, PedidoEstado siguiente) {
        return switch (actual) {
            case PENDIENTE -> siguiente == PedidoEstado.APROBADO || siguiente == PedidoEstado.CANCELADO;
            case APROBADO -> siguiente == PedidoEstado.EN_PROGRESO || siguiente == PedidoEstado.CANCELADO;
            case EN_PROGRESO -> siguiente == PedidoEstado.COMPLETADO || siguiente == PedidoEstado.CANCELADO;
            case COMPLETADO -> siguiente == PedidoEstado.ENTREGADO;
            case ENTREGADO -> false;
            case CANCELADO -> false;
        };
    }
}
```

---

## 5. TEMPLATE: Controller REST

**Archivo: controller/PedidoController.java**

```java
package com.realprint.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.realprint.entity.Pedido;
import com.realprint.entity.PedidoEstado;
import com.realprint.dto.PedidoDTO;
import com.realprint.service.PedidoService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:5173}")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    /**
     * GET /pedidos?page=0&size=20
     * Obtiene los pedidos del cliente autenticado
     */
    @GetMapping
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<Page<Pedido>> obtenerPedidos(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestHeader("Authorization") String token
    ) {
        // Obtener ID del usuario del token (implementado en SecurityService)
        Long clienteId = extraerIdDelToken(token);
        Pageable pageable = PageRequest.of(page, size);
        Page<Pedido> pedidos = pedidoService.obtenerPedidosDelCliente(clienteId, pageable);
        return ResponseEntity.ok(pedidos);
    }

    /**
     * GET /pedidos/{id}
     * Obtiene un pedido específico
     */
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPedido(@PathVariable Long id) {
        return pedidoService.obtenerPedido(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * POST /pedidos
     * Crea un nuevo pedido
     */
    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<Pedido> crearPedido(
        @Valid @RequestBody PedidoDTO pedidoDTO,
        @RequestHeader("Authorization") String token
    ) {
        Long clienteId = extraerIdDelToken(token);
        Pedido pedido = pedidoService.crearPedido(clienteId, pedidoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(pedido);
    }

    /**
     * PUT /pedidos/{id}
     * Actualiza un pedido
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CLIENTE') or hasRole('ADMIN')")
    public ResponseEntity<Pedido> actualizarPedido(
        @PathVariable Long id,
        @Valid @RequestBody PedidoDTO pedidoDTO
    ) {
        Pedido pedido = pedidoService.actualizarPedido(id, pedidoDTO);
        return ResponseEntity.ok(pedido);
    }

    /**
     * PATCH /pedidos/{id}/status
     * Cambia el estado de un pedido
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERARIO')")
    public ResponseEntity<Pedido> cambiarEstado(
        @PathVariable Long id,
        @RequestBody Map<String, String> request
    ) {
        PedidoEstado nuevoEstado = PedidoEstado.valueOf(request.get("estado"));
        Pedido pedido = pedidoService.cambiarEstado(id, nuevoEstado);
        return ResponseEntity.ok(pedido);
    }

    /**
     * POST /pedidos/{id}/asignar/{operarioId}
     * Asigna un pedido a un operario
     */
    @PostMapping("/{id}/asignar/{operarioId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Pedido> asignarOperario(
        @PathVariable Long id,
        @PathVariable Long operarioId
    ) {
        Pedido pedido = pedidoService.asignarOperario(id, operarioId);
        return ResponseEntity.ok(pedido);
    }

    /**
     * DELETE /pedidos/{id}
     * Elimina un pedido (soft delete recomendado)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Long id) {
        // Implementar soft delete o cambiar estado a CANCELADO
        return ResponseEntity.noContent().build();
    }

    // Método auxiliar para extraer ID del token (simplificado)
    private Long extraerIdDelToken(String token) {
        // Implementación real deberá usar JwtProvider
        return 1L; // Placeholder
    }
}
```

---

## 6. DOCKER COMPOSE PARA DESARROLLO LOCAL

**Archivo: docker-compose.yml**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: realprint_postgres
    environment:
      POSTGRES_DB: realprint_db
      POSTGRES_USER: realprint_user
      POSTGRES_PASSWORD: realprint_pass_123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - realprint_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U realprint_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: realprint_pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@realprint.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    networks:
      - realprint_network
    depends_on:
      - postgres

  # Backend SpringBoot (opcional, si está en Docker)
  backend:
    build: ./realprint-backend
    container_name: realprint_backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/realprint_db
      SPRING_DATASOURCE_USERNAME: realprint_user
      SPRING_DATASOURCE_PASSWORD: realprint_pass_123
    networks:
      - realprint_network
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:

networks:
  realprint_network:
    driver: bridge
```

**Iniciar servicios:**

```bash
docker-compose up -d
```

---

## 7. VARIABLES DE ENTORNO (.env)

**Frontend: .env**

```env
VITE_API_URL=http://localhost:8080/api
VITE_API_TIMEOUT=5000
VITE_APP_NAME=RealPrint
VITE_APP_VERSION=1.0.0
```

**Backend: application-dev.properties**

```properties
# PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/realprint_db
spring.datasource.username=realprint_user
spring.datasource.password=realprint_pass_123
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# JWT
app.jwt.secret=your-super-secret-key-at-least-32-characters-long!!!!
app.jwt.expiration=86400000

# CORS
app.cors.allowed-origins=http://localhost:5173,http://localhost:3000

# Logging
logging.level.com.realprint=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

---

**Continúa en el siguiente archivo...**

