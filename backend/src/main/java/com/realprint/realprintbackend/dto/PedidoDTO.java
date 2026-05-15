package com.realprint.realprintbackend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para transferencia de datos de pedidos.
 *
 * CAMBIOS de diseño:
 * - Removidos: creadoPorId, creadoPorNombre, subservicio, opcion, productoFinalId,
 *   boxTotal, cajasCompletadas, fileUrlsJson
 * - Mantiene solo los campos usados en el frontend actual
 * - Incluye validaciones Jakarta Bean Validation
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoDTO {

    private Long id;

    // Propietario del pedido (asignado automáticamente por el backend desde Authentication)
    private Long clienteId;

    private String clienteNombre;

    // Tipo de servicio (serigrafía, planchado, etc.)
    @NotBlank(message = "El servicio es obligatorio")
    @Size(max = 100, message = "El servicio no puede exceder 100 caracteres")
    private String servicio;

    // Descripción del trabajo
    @Size(max = 2000, message = "La descripción no puede exceder 2000 caracteres")
    private String descripcion;

    // Cantidad a producir
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidad;

    // Fechas
    private LocalDate fecha;

    private LocalDate fechaEntrega;

    // Medidas del diseño (cm)
    @Min(value = 0, message = "El ancho debe ser positivo o cero")
    private Integer measurementWidthCm;

    @Min(value = 0, message = "El alto debe ser positivo o cero")
    private Integer measurementHeightCm;

    // Estado del pedido (pendiente, en_proceso, completado, enviado, cancelado)
    @Pattern(regexp = "pendiente|en_proceso|completado|enviado|cancelado",
             message = "Estado inválido. Valores permitidos: pendiente, en_proceso, completado, enviado, cancelado")
    private String estado;

    // Total a pagar
    @DecimalMin(value = "0.0", inclusive = true, message = "El total no puede ser negativo")
    private BigDecimal total;

    // Archivos asociados al pedido
    @Builder.Default
    private List<PedidoArchivoDTO> archivos = new ArrayList<>();
}
