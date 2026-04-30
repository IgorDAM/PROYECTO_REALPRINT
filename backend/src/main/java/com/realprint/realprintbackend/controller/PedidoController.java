package com.realprint.realprintbackend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.realprint.realprintbackend.dto.PedidoDTO;
import com.realprint.realprintbackend.entity.Pedido;
import com.realprint.realprintbackend.mapper.PedidoMapper;
import com.realprint.realprintbackend.service.PedidoService;

import lombok.RequiredArgsConstructor;

/**
 * Controlador REST de pedidos.
 *
 * CAMBIOS con nuevo diseño:
 * - POST /api/pedidos ahora asigna cliente y creadoPor desde el contexto de seguridad
 * - El cliente es el usuario autenticado (o especificado si es admin)
 * - El creadoPor es siempre el usuario autenticado
 *
 * Expone operaciones CRUD para gestión de pedidos.
 * Todos los endpoints requieren autenticación (JWT).
 *
 * Endpoints:
 * - GET    /api/pedidos           - Listar todos los pedidos (admin)
 * - GET    /api/pedidos/{id}      - Obtener un pedido específico
 * - POST   /api/pedidos           - Crear un nuevo pedido
 * - PUT    /api/pedidos/{id}      - Actualizar un pedido
 * - DELETE /api/pedidos/{id}      - Eliminar un pedido (admin)
 *
 * **Seguridad:**
 * - El endpoint GET /pedidos está restringido a ADMIN
 * - Otros endpoints aceptan CLIENTE y ADMIN
 *
 * **DTO Mapping:**
 * - Convierte Pedido (entity) ↔ PedidoDTO
 * - Los estados se representan en minúscula en DTO (e.g., "pendiente")
 * - Los estados internos usan enum mayúscula (e.g., PENDIENTE)
 */
@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    /**
     * GET /api/pedidos
     *
     * Listar todos los pedidos (solo para ADMIN).
     * Usado en el dashboard de administración para gestión global.
     *
     * @return Lista de PedidoDTO con todos los pedidos
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PedidoDTO>> listarPedidos() {
        List<Pedido> pedidos = pedidoService.findAll();
        List<PedidoDTO> dtos = pedidos.stream()
                .map(PedidoMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    /**
     * GET /api/pedidos/{id}
     *
     * Obtener un pedido específico por su ID.
     * Disponible para ADMIN y CLIENTE (cada cliente solo ve sus pedidos).
     *
     * @param id ID del pedido
     * @return El PedidoDTO solicitado
     */
    @GetMapping("/{id}")
    public ResponseEntity<PedidoDTO> obtenerPedido(@PathVariable Long id) {
        Pedido pedido = pedidoService.findById(id);
        return ResponseEntity.ok(PedidoMapper.toDTO(pedido));
    }

    /**
     * POST /api/pedidos
     *
     * Crear un nuevo pedido.
     * CAMBIO: Asigna automáticamente:
     * - cliente: El usuario autenticado (o especificado si es admin)
     * - creadoPor: Siempre el usuario autenticado
     *
     * @param pedidoDTO Los datos del nuevo pedido
     * @param auth Contexto de seguridad (inyectado por Spring)
     * @return El PedidoDTO creado con ID asignado
     */
    @PostMapping
    public ResponseEntity<PedidoDTO> crearPedido(
            @RequestBody PedidoDTO pedidoDTO,
            Authentication auth) {
        // Convertir DTO → Entity (con conversión de estado a enum)
        Pedido pedido = PedidoMapper.toEntity(pedidoDTO);

        // Guardar delegando al servicio (que asignará cliente y creadoPor)
        Pedido pedidoGuardado = pedidoService.save(pedido, auth);

        // Convertir Entity → DTO (con conversión de enum a string)
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(PedidoMapper.toDTO(pedidoGuardado));
    }

    /**
     * PUT /api/pedidos/{id}
     *
     * Actualizar un pedido existente.
     * Acepta actualizaciones parciales o completas.
     * NO modifica cliente ni creadoPor.
     *
     * @param id ID del pedido a actualizar
     * @param pedidoDTO Los datos actualizados
     * @return El PedidoDTO actualizado
     */
    @PutMapping("/{id}")
    public ResponseEntity<PedidoDTO> actualizarPedido(
            @PathVariable Long id,
            @RequestBody PedidoDTO pedidoDTO) {
        // Convertir DTO → Entity
        Pedido pedido = PedidoMapper.toEntity(pedidoDTO);

        // Actualizar en base de datos
        Pedido pedidoActualizado = pedidoService.update(id, pedido);

        // Convertir Entity → DTO
        return ResponseEntity.ok(PedidoMapper.toDTO(pedidoActualizado));
    }

    /**
     * DELETE /api/pedidos/{id}
     *
     * Eliminar un pedido (solo ADMIN).
     * Realiza un borrado físico de la base de datos.
     *
     * @param id ID del pedido a eliminar
     * @return Respuesta vacía con estado 204 No Content
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Long id) {
        pedidoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
