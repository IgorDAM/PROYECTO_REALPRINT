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
 * CAMBIOS de diseño (mejorado):
 * - Removidos creadoPorId y creadoPorNombre
 *   (cliente siempre es quien crea sus propios pedidos)
 * - Los estados se representan como strings minúsculas (e.g., "pendiente")
 *   para compatibilidad con frontend
 * - Propietario del pedido: clienteId (único, no hay creadoPor)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoDTO {

    private Long id;

    // Propietario del pedido (quién lo creó)
    private Long clienteId;

    private String clienteNombre;

    // NOTA: creadoPorId y creadoPorNombre removidos
    // El cliente es siempre quien crea el pedido
    // Auditoría: createdAt timestamp es suficiente

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
    // Sincroniza con lo que el frontend espera
    private String estado;

    private String fileUrlsJson;

    private BigDecimal total;

    private Integer boxTotal;

    private Integer cajasCompletadas;

    private Integer tamanoCaja;
}
