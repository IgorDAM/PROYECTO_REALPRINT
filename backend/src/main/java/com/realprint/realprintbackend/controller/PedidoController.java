package com.realprint.realprintbackend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.realprint.realprintbackend.dto.PedidoDTO;
import com.realprint.realprintbackend.entity.Pedido;
import com.realprint.realprintbackend.mapper.PedidoMapper;
import com.realprint.realprintbackend.service.PedidoService;

import lombok.RequiredArgsConstructor;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses; // ✅ faltaba este
// Content, Schema, ArraySchema eliminados — no se usan en este controller

/**
 * Controlador REST de pedidos.
 *
 * CAMBIOS con nuevo diseño (mejorado):
 * - Campo creadoPor removido (cliente siempre crea sus propios pedidos)
 * - POST /pedidos: SOLO CLIENTE puede crear (ADMIN rechazado con 403)
 * - Admin puede: ver todos, cambiar estado, asignar precio, descargar archivos
 * - Admin NO puede: crear pedidos, cargar archivos
 *
 * Expone operaciones CRUD para gestión de pedidos.
 * Todos los endpoints requieren autenticación (JWT).
 *
 * Endpoints:
 * - GET    /pedidos           - Listar todos los pedidos (ADMIN only)
 * - GET    /pedidos/{id}      - Obtener un pedido específico
 * - POST   /pedidos           - Crear un nuevo pedido (CLIENTE only)
 * - PUT    /pedidos/{id}      - Actualizar un pedido (ADMIN only, gestionar)
 * - DELETE /pedidos/{id}      - Eliminar un pedido (ADMIN only)
 */
@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
@Tag(name = "Pedidos", description = "Operaciones relacionadas con la gestión de pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    /**
     * GET /pedidos
     *
     * Listar todos los pedidos (solo para ADMIN).
     * Usado en el dashboard de administración para gestión global.
     *
     * @return Lista de PedidoDTO con todos los pedidos
     */
    @Operation(summary = "Listar todos los pedidos",
                description = "Obtiene una lista de todos los pedidos registrados en el sistema. Solo accesible para usuarios con rol ADMIN.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de pedidos obtenida exitosamente"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado. Solo ADMIN puede acceder a esta información.")
    })
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
     * GET /pedidos/{id}
     *
     * Obtener un pedido específico por su ID.
     * Disponible para ADMIN (ve todos) y CLIENTE (solo ve sus propios).
     *
     * @param id ID del pedido
     * @return El PedidoDTO solicitado
     */
    @Operation  (summary = "Obtener un pedido por ID",
                description = "Obtiene los detalles de un pedido específico. Los administradores pueden acceder a cualquier pedido," +
                                "mientras que los clientes solo pueden acceder a sus propios pedidos.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pedido obtenido exitosamente"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado. Solo ADMIN puede acceder a cualquier pedido, los clientes solo a los suyos."),
        @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    })
    @GetMapping("/{id}")
    @PostAuthorize("@securityRules.canReadPedido(authentication, returnObject.body)")
    public ResponseEntity<PedidoDTO> obtenerPedido(@PathVariable Long id) {
        Pedido pedido = pedidoService.findById(id);
        return ResponseEntity.ok(PedidoMapper.toDTO(pedido));
    }

    /**
     * POST /pedidos
     *
     * Crear un nuevo pedido.
     * RESTRICCIÓN: Solo CLIENTE puede crear pedidos.
     * Admin intentando crear → 403 Forbidden
     *
     * Asigna automáticamente:
     * - cliente_id = usuario autenticado
     * - createdAt = ahora
     * - estado = PENDIENTE
     *
     * @param pedidoDTO Los datos del nuevo pedido
     * @param auth Contexto de seguridad (inyectado por Spring)
     * @return El PedidoDTO creado con ID asignado
     * @throws ResponseStatusException 403 si es ADMIN
     */
    @Operation  (summary = "Crear un nuevo pedido",
                description = "Permite a los clientes crear un nuevo pedido. Los administradores no pueden crear pedidos y recibirán un error 403 si intentan hacerlo." +
                                 "El sistema asignará automáticamente el cliente, la fecha de creación y el estado inicial del pedido.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Pedido creado exitosamente"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado. Solo los clientes pueden crear pedidos.")
    })
    @PostMapping
    @PreAuthorize("@securityRules.canCreatePedido(authentication)")
    public ResponseEntity<PedidoDTO> crearPedido(
            @RequestBody PedidoDTO pedidoDTO,
            Authentication auth) {
        // Convertir DTO → Entity
        Pedido pedido = PedidoMapper.toEntity(pedidoDTO);

        // Guardar delegando al servicio (asignará cliente automáticamente)
        Pedido pedidoGuardado = pedidoService.save(pedido, auth);

        // Convertir Entity → DTO
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(PedidoMapper.toDTO(pedidoGuardado));
    }

    /**
     * PUT /pedidos/{id}
     *
     * Actualizar un pedido existente (gestión de admin).
     * Acepta actualizaciones de estado, precio, etc.
     * NO modifica cliente (propietario del pedido).
     *
     * @param id ID del pedido a actualizar
     * @param pedidoDTO Los datos actualizados
     * @return El PedidoDTO actualizado
     */
    @Operation  (summary = "Actualizar un pedido",
                description = "Permite a los administradores actualizar los detalles de un pedido existente," +
                            "como su estado o precio. No se permite modificar el cliente asociado al pedido.")
    @ApiResponses (value = {
        @ApiResponse(responseCode = "200", description = "Pedido actualizado exitosamente"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado. Solo los administradores pueden actualizar pedidos."),
        @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")  // Solo ADMIN actualiza
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
     * DELETE /pedidos/{id}
     *
     * Eliminar un pedido (solo ADMIN).
     * Realiza un borrado físico de la base de datos.
     *
     * @param id ID del pedido a eliminar
     * @return Respuesta vacía con estado 204 No Content
     */
    @Operation (summary = "Eliminar un pedido",
            description = "Permite a los administradores eliminar un pedido existente." +
                        "Esta operación realiza un borrado físico del registro en la base de datos.")
    @ApiResponses (value = {
        @ApiResponse(responseCode = "204", description = "Pedido eliminado exitosamente"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado. Solo los administradores pueden eliminar pedidos."),
        @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Long id) {
        pedidoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
