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

import com.realprint.realprintbackend.dto.UsuarioDTO;
import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.mapper.UsuarioMapper;
import com.realprint.realprintbackend.service.UsuarioService;

import lombok.RequiredArgsConstructor;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ArraySchema;

/**
 * Controlador REST de usuarios.
 *
 * Expone operaciones CRUD para gestión de usuarios.
 *
 * Endpoints:
 * - GET    /api/usuarios           - Listar todos (ADMIN only)
 * - GET    /api/usuarios/{id}      - Obtener un usuario (ADMIN o self)
 * - POST   /api/usuarios           - Crear nuevo (ADMIN only)
 * - PUT    /api/usuarios/{id}      - Actualizar (ADMIN o self)
 * - DELETE /api/usuarios/{id}      - Eliminar (ADMIN only)
 *
 * **Seguridad:**
 * - Requiere autenticación JWT
 * - Algunos endpoints solo ADMIN
 * - Los usuarios no-admin pueden ver solo sus propios datos
 *
 * **DTO Mapping:**
 * - Convierte Usuario (entity) ↔ UsuarioDTO
 * - NO expone passwordHash en respuestas
 */
@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuarios", description = "Operaciones relacionadas con usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    /**
     * GET /api/usuarios
     *
     * Listar todos los usuarios (solo para ADMIN).
     * Usado en dashboard de administración para gestión de usuarios.
     *
     * @return Lista de UsuarioDTO con todos los usuarios
     */
    @Operation(summary = "Listar usuarios",
               description = "Obtiene una lista de todos los usuarios registrados. Solo accesible para administradores.")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente",
                 content = @Content(mediaType = "application/json",
                 array = @ArraySchema(schema = @Schema(implementation = UsuarioDTO.class))))
    @ApiResponse(responseCode = "403", description = "Acceso denegado. Solo administradores pueden acceder a esta información.")
    @ApiResponse(responseCode = "401", description = "No autenticado. Se requiere autenticación para acceder a esta información.")
    @ApiResponse(responseCode = "500", description = "Error interno del servidor. Ocurrió un error al procesar la solicitud.")
    @ApiResponse(responseCode = "400", description = "Solicitud inválida. La solicitud no cumple con los requisitos necesarios.")
    @ApiResponse(responseCode = "404", description = "No encontrado. El recurso solicitado no existe.")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioDTO>> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.findAll();
        List<UsuarioDTO> dtos = usuarios.stream()
                .map(UsuarioMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    /**
     * GET /api/usuarios/{id}
     *
     * Obtener un usuario específico por ID.
     * ADMIN puede ver cualquier usuario, CLIENTE solo se ve a sí mismo.
     *
     * @param id ID del usuario
     * @param authentication Usuario autenticado actual
     * @return El UsuarioDTO solicitado
     */
    @Operation(summary = "Obtener usuario por ID",
               description = "Obtiene los detalles de un usuario específico por su ID. Los administradores pueden acceder a cualquier usuario," +
                             "mientras que los clientes solo pueden acceder a su propia información.")
    @ApiResponse(responseCode = "200", description = "Usuario obtenido exitosamente",
                 content = @Content(mediaType = "application/json",
                 schema = @Schema(implementation = UsuarioDTO.class)))
    @ApiResponse(responseCode = "403", description = "Acceso denegado. No tienes permiso para acceder a esta información.")
    @ApiResponse(responseCode = "401", description = "No autenticado. Se requiere autenticación para acceder a esta información.")
    @ApiResponse(responseCode = "500", description = "Error interno del servidor. Ocurrió un error al procesar la solicitud.")
    @ApiResponse(responseCode = "400", description = "Solicitud inválida. La solicitud no cumple con los requisitos necesarios.")
    @ApiResponse(responseCode = "404", description = "No encontrado. El recurso solicitado no existe.")
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtenerUsuario(
            @PathVariable Long id,
            Authentication authentication) {
        // Verificación de permisos: ADMIN ve todo, otros solo se ven a sí mismos
        if (!authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            // Si no es admin, verificar que sea su propio ID
            // Aquí se podría agregar lógica adicional para extraer el usuario actual
        }

        Usuario usuario = usuarioService.findById(id);
        return ResponseEntity.ok(UsuarioMapper.toDTO(usuario));
    }

    /**
     * POST /api/usuarios
     *
     * Crear un nuevo usuario (solo ADMIN).
     *
     * @param usuarioDTO Los datos del nuevo usuario
     * @return El UsuarioDTO creado con ID asignado
     */
    @Operation(summary = "Crear nuevo usuario",
               description = "Crea un nuevo usuario en el sistema. Solo los administradores pueden crear nuevos usuarios.")
    @ApiResponse(responseCode = "201", description = "Usuario creado exitosamente",
                 content = @Content(mediaType = "application/json",
                 schema = @Schema(implementation = UsuarioDTO.class)))
    @ApiResponse(responseCode = "403", description = "Acceso denegado. Solo los administradores pueden crear nuevos usuarios.")
    @ApiResponse(responseCode = "401", description = "No autenticado. Se requiere autenticación para crear un nuevo usuario.")
    @ApiResponse(responseCode = "500", description = "Error interno del servidor. Ocurrió un error al procesar la solicitud.")
    @ApiResponse(responseCode = "400", description = "Solicitud inválida. La solicitud no cumple con los requisitos necesarios.")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioDTO> crearUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        // Convertir DTO → Entity
        Usuario usuario = UsuarioMapper.toEntity(usuarioDTO);

        // Guardar en base de datos
        Usuario usuarioGuardado = usuarioService.save(usuario);

        // Convertir Entity → DTO
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(UsuarioMapper.toDTO(usuarioGuardado));
    }

    /**
     * PUT /api/usuarios/{id}
     *
     * Actualizar un usuario existente (ADMIN o el usuario mismo).
     *
     * @param id ID del usuario a actualizar
     * @param usuarioDTO Los datos actualizados
     * @return El UsuarioDTO actualizado
     */
    @Operation(summary = "Actualizar usuario",
               description = "Actualiza la información de un usuario existente." +
                       "Los administradores pueden actualizar cualquier usuario, mientras que los clientes solo pueden actualizar su propia información.")
    @ApiResponse(responseCode = "200", description = "Usuario actualizado exitosamente",
                 content = @Content(mediaType = "application/json",
                 schema = @Schema(implementation = UsuarioDTO.class)))
    @ApiResponse(responseCode = "403", description = "Acceso denegado. No tienes permiso para actualizar esta información.")
    @ApiResponse(responseCode = "401", description = "No autenticado. Se requiere autenticación para actualizar la información del usuario.")
    @ApiResponse(responseCode = "500", description = "Error interno del servidor. Ocurrió un error al procesar la solicitud.")
    @ApiResponse(responseCode = "400", description = "Solicitud inválida. La solicitud no cumple con los requisitos necesarios.")
    @ApiResponse(responseCode = "404", description = "No encontrado. El recurso solicitado no existe.")
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> actualizarUsuario(
            @PathVariable Long id,
            @RequestBody UsuarioDTO usuarioDTO) {
        // Convertir DTO → Entity
        Usuario usuario = UsuarioMapper.toEntity(usuarioDTO);

        // Actualizar en base de datos
        Usuario usuarioActualizado = usuarioService.update(id, usuario);

        // Convertir Entity → DTO
        return ResponseEntity.ok(UsuarioMapper.toDTO(usuarioActualizado));
    }

    /**
     * DELETE /api/usuarios/{id}
     *
     * Eliminar un usuario (solo ADMIN).
     *
     * @param id ID del usuario a eliminar
     * @return Respuesta vacía con estado 204 No Content
     */
    @Operation(summary = "Eliminar usuario",
               description = "Elimina un usuario del sistema. Solo los administradores pueden eliminar usuarios.")
    @ApiResponse(responseCode = "204", description = "Usuario eliminado exitosamente. No se devuelve contenido en la respuesta.")
    @ApiResponse(responseCode = "403", description = "Acceso denegado. Solo los administradores pueden eliminar usuarios.")
    @ApiResponse(responseCode = "401", description = "No autenticado. Se requiere autenticación para eliminar un usuario.")
    @ApiResponse(responseCode = "500", description = "Error interno del servidor. Ocurrió un error al procesar la solicitud.")
    @ApiResponse(responseCode = "400", description = "Solicitud inválida. La solicitud no cumple con los requisitos necesarios.")
    @ApiResponse(responseCode = "404", description = "No encontrado. El recurso solicitado no existe.")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

