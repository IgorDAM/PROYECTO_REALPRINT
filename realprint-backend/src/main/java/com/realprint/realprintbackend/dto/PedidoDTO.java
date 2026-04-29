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
 * CAMBIOS de diseño mejorado:
 * - Agrega creadoPorId y creadoPorNombre (quién creó el pedido)
 * - Convierte la entidad Pedido a un formato serializable para el frontend.
 * - Los estados se representan como strings minúsculas (e.g., "pendiente")
 *   en lugar del enum en mayúsculas para compatibilidad con el frontend.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoDTO {

    private Long id;

    private Long clienteId;

    private String clienteNombre;

    // Quién creó el pedido (admin o el mismo cliente)
    private Long creadoPorId;

    private String creadoPorNombre;

    private String servicio;

    private String subservicio;

    private String opcion;

    private Long productoFinalId;

    private String descripcion;

    private Integer cantidad;

    private Integer cantidadUnidades;

    private LocalDate fecha;

    private LocalDate fechaEntrega;

    private Integer measurementWidthCm;

    private Integer measurementHeightCm;

    // Estado representado como string minúscula (e.g., "pendiente", "en_proceso")
    // Esto sincroniza con lo que el frontend espera
    private String estado;

    private String fileUrlsJson;

    private BigDecimal total;

    private Integer boxTotal;

    private Integer cajasCompletadas;

    private Integer tamanoCaja;
}
