package com.realprint.realprintbackend.mapper;

import com.realprint.realprintbackend.dto.PedidoDTO;
import com.realprint.realprintbackend.entity.Pedido;
import com.realprint.realprintbackend.entity.PedidoEstado;

/**
 * Mapper entre Pedido (Entity) y PedidoDTO.
 *
 * **CAMBIOS de diseño mejorado:**
 * - clienteId y clienteNombre ahora vienen de la relación @ManyToOne usuario.cliente
 * - Se agrega creador (usuario.creadoPor)
 * - Los archivos se obtienen de la lista pedido.archivos
 *
 * **Responsabilidad principal:**
 * Convertir estados del enum PedidoEstado (MAYÚSCULAS)
 * a strings minúscula_con_guion para sincronizar con el frontend.
 *
 * Ejemplo:
 * - "PENDIENTE" (enum) → "pendiente" (DTO)
 * - "EN_PROCESO" (enum) → "en_proceso" (DTO)
 * - "COMPLETADO" (enum) → "completado" (DTO)
 * - "ENVIADO" (enum) → "enviado" (DTO)
 * - "CANCELADO" (enum) → "cancelado" (DTO)
 */
public class PedidoMapper {

    /**
     * Convierte un enum PedidoEstado a su representación en string minúscula.
     *
     * @param estado El enum de estado del pedido
     * @return String en minúsculas: "pendiente", "en_proceso", etc.
     */
    public static String estadoEnumToString(PedidoEstado estado) {
        if (estado == null) {
            return "pendiente"; // Default
        }
        return estado.name().toLowerCase();
    }

    /**
     * Convierte un string minúscula (desde frontend/DTO) al enum PedidoEstado.
     *
     * @param estado String en minúsculas: "pendiente", "en_proceso", etc.
     * @return El enum PedidoEstado correspondiente
     * @throws IllegalArgumentException Si el estado no es válido
     */
    public static PedidoEstado stringToEstadoEnum(String estado) {
        if (estado == null || estado.trim().isEmpty()) {
            return PedidoEstado.PENDIENTE;
        }
        try {
            return PedidoEstado.valueOf(estado.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Estado inválido: " + estado, e);
        }
    }

    /**
     * Convierte una Entidad Pedido a PedidoDTO.
     *
     * @param pedido La entidad del pedido
     * @return El DTO del pedido con estados en formato minúscula
     */
    public static PedidoDTO toDTO(Pedido pedido) {
        if (pedido == null) {
            return null;
        }

        return PedidoDTO.builder()
                .id(pedido.getId())
                // Obtener datos del cliente desde la relación
                .clienteId(pedido.getCliente() != null ? pedido.getCliente().getId() : null)
                .clienteNombre(pedido.getCliente() != null ? pedido.getCliente().getNombre() : "")
                // Obtener datos de quién creó el pedido
                .creadoPorId(pedido.getCreadoPor() != null ? pedido.getCreadoPor().getId() : null)
                .creadoPorNombre(pedido.getCreadoPor() != null ? pedido.getCreadoPor().getNombre() : "")
                // Resto de campos
                .servicio(pedido.getServicio())
                .subservicio(pedido.getSubservicio())
                .opcion(pedido.getOpcion())
                .productoFinalId(pedido.getProductoFinalId())
                .descripcion(pedido.getDescripcion())
                .cantidad(pedido.getCantidad())
                .cantidadUnidades(pedido.getCantidadUnidades())
                .fecha(pedido.getFecha())
                .fechaEntrega(pedido.getFechaEntrega())
                .measurementWidthCm(pedido.getMeasurementWidthCm())
                .measurementHeightCm(pedido.getMeasurementHeightCm())
                // CRÍTICO: Convertir enum a minúsculas
                .estado(estadoEnumToString(pedido.getEstado()))
                .fileUrlsJson(pedido.getFileUrlsJson())
                .total(pedido.getTotal())
                .boxTotal(pedido.getBoxTotal())
                .cajasCompletadas(pedido.getCajasCompletadas())
                .tamanoCaja(pedido.getTamanoCaja())
                .build();
    }

    /**
     * Convierte un PedidoDTO a Entidad Pedido.
     *
     * Útil para operaciones de creación/actualización desde el frontend.
     * NOTA: Los campos de relación (cliente, creadoPor) deben ser asignados
     * por el servicio/controller, no por este mapper.
     *
     * @param dto El DTO del pedido
     * @return La entidad del pedido con enums correctos
     */
    public static Pedido toEntity(PedidoDTO dto) {
        if (dto == null) {
            return null;
        }

        return Pedido.builder()
                .id(dto.getId())
                // cliente y creadoPor deben ser asignados por el servicio
                .servicio(dto.getServicio())
                .subservicio(dto.getSubservicio())
                .opcion(dto.getOpcion())
                .productoFinalId(dto.getProductoFinalId())
                .descripcion(dto.getDescripcion())
                .cantidad(dto.getCantidad())
                .cantidadUnidades(dto.getCantidadUnidades())
                .fecha(dto.getFecha())
                .fechaEntrega(dto.getFechaEntrega())
                .measurementWidthCm(dto.getMeasurementWidthCm())
                .measurementHeightCm(dto.getMeasurementHeightCm())
                // CRÍTICO: Convertir string minúscula a enum MAYÚSCULA
                .estado(stringToEstadoEnum(dto.getEstado()))
                .fileUrlsJson(dto.getFileUrlsJson())
                .total(dto.getTotal())
                .boxTotal(dto.getBoxTotal())
                .cajasCompletadas(dto.getCajasCompletadas())
                .tamanoCaja(dto.getTamanoCaja())
                .build();
    }
}
