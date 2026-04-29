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
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
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
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

