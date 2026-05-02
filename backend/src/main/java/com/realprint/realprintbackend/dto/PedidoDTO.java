package com.realprint.realprintbackend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

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
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoDTO {

    private Long id;

    // Propietario del pedido
    private Long clienteId;

    private String clienteNombre;

    // Tipo de servicio (serigrafía, planchado, etc.)
    private String servicio;

    // Descripción del trabajo
    private String descripcion;

    // Cantidad a producir
    private Integer cantidad;

    // Fechas
    private LocalDate fecha;

    private LocalDate fechaEntrega;

    // Medidas del diseño (cm)
    private Integer measurementWidthCm;

    private Integer measurementHeightCm;

    // Estado del pedido (pendiente, en_proceso, completado, enviado, cancelado)
    private String estado;

    // Total a pagar
    private BigDecimal total;
}
