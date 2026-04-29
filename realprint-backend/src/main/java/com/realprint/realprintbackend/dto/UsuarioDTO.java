package com.realprint.realprintbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para transferencia de datos de usuario.
 *
 * **Responsabilidad:**
 * Exponer información pública del usuario sin sensibilidades como passwordHash.
 *
 * **Campos excluidos intencionalmente:**
 * - passwordHash (nunca exponemos contraseña hasheada)
 *
 * **Consumidores:**
 * - UsuarioController en endpoints /api/usuarios
 * - Frontend cuando consume datos de usuario
 * - Logs y auditoría
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDTO {

    /** ID técnico del usuario en BD */
    private Long id;

    /** Username único para login */
    private String username;

    /** Nombre visible del usuario */
    private String nombre;

    /** Email de contacto */
    private String email;

    /** Rol funcional (admin, cliente) - en minúsculas para consistencia JSON */
    private String role;

    /** Estado activo/inactivo */
    private boolean activo;
}

