package com.realprint.realprintbackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
    @NotBlank(message = "El username es obligatorio")
    @Size(min = 3, max = 50, message = "El username debe tener entre 3 y 50 caracteres")
    private String username;

    /** Nombre visible del usuario */
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;

    /** Email de contacto */
    @Email(message = "Email inválido")
    @Size(max = 100, message = "El email no puede exceder 100 caracteres")
    private String email;

    /** Rol funcional (admin, cliente) - en minúsculas para consistencia JSON */
    @Pattern(regexp = "admin|cliente", message = "Rol inválido. Valores permitidos: admin, cliente")
    private String role;

    /** Estado activo/inactivo (si es null, el backend asigna true por defecto) */
    private Boolean activo;
}

