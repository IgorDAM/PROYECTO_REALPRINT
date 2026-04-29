package com.realprint.realprintbackend.mapper;

import com.realprint.realprintbackend.dto.UsuarioDTO;
import com.realprint.realprintbackend.entity.RolUsuario;
import com.realprint.realprintbackend.entity.Usuario;

/**
 * Mapper entre Usuario (Entity) y UsuarioDTO.
 *
 * **Responsabilidad principal:**
 * Convertir Usuario entity a DTO sin exponer sensibilidades como passwordHash.
 *
 * **Conversiones especiales:**
 * - role: RolUsuario enum → String minúscula para JSON
 * - passwordHash: Excluido intencionalmente
 */
public class UsuarioMapper {

    /**
     * Convierte rol enum a string minúscula.
     *
     * @param rol El enum RolUsuario
     * @return String en minúsculas: "admin", "cliente"
     */
    public static String rolEnumToString(RolUsuario rol) {
        if (rol == null) {
            return "cliente"; // Default
        }
        return rol.name().toLowerCase();
    }

    /**
     * Convierte string minúscula a rol enum.
     *
     * @param role String en minúsculas: "admin", "cliente"
     * @return El enum RolUsuario correspondiente
     * @throws IllegalArgumentException Si el rol no es válido
     */
    public static RolUsuario stringToRolEnum(String role) {
        if (role == null || role.trim().isEmpty()) {
            return RolUsuario.CLIENTE;
        }
        try {
            return RolUsuario.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Rol inválido: " + role, e);
        }
    }

    /**
     * Convierte una Entidad Usuario a UsuarioDTO.
     *
     * **Exclusiones de seguridad:**
     * - passwordHash: Nunca se expone
     *
     * @param usuario La entidad del usuario
     * @return El DTO del usuario limpio y seguro
     */
    public static UsuarioDTO toDTO(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        return UsuarioDTO.builder()
                .id(usuario.getId())
                .username(usuario.getUsername())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                // SEGURIDAD: Convertir enum a minúsculas
                .role(rolEnumToString(usuario.getRol()))
                .activo(usuario.isActivo())
                // INTENCIONALMENTE EXCLUIDO: passwordHash
                .build();
    }

    /**
     * Convierte un UsuarioDTO a Entidad Usuario.
     *
     * Útil para operaciones de creación/actualización desde el frontend.
     * **Nota**: El passwordHash debe establecerse por separado en el controller.
     *
     * @param dto El DTO del usuario
     * @return La entidad del usuario
     */
    public static Usuario toEntity(UsuarioDTO dto) {
        if (dto == null) {
            return null;
        }

        return Usuario.builder()
                .id(dto.getId())
                .username(dto.getUsername())
                .nombre(dto.getNombre())
                .email(dto.getEmail())
                // SEGURIDAD: Convertir string minúscula a enum
                .rol(stringToRolEnum(dto.getRole()))
                .activo(dto.isActivo())
                // passwordHash: NO SE COPIA (debe venir del login/crear)
                .build();
    }
}

