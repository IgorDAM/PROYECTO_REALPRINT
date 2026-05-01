package com.realprint.realprintbackend.mapper;

import com.realprint.realprintbackend.dto.PedidoDTO;
import com.realprint.realprintbackend.entity.Pedido;
import com.realprint.realprintbackend.entity.PedidoEstado;

/**
 * Mapper entre Pedido (Entity) y PedidoDTO.
 *
 * **CAMBIOS de diseño (mejorado):**
 * - Removidos creadoPorId y creadoPorNombre (cliente es quien crea)
 * - clienteId y clienteNombre vienen de la relación @ManyToOne usuario.cliente
 * - Los archivos se obtienen de la lista pedido.archivos
 *
 * **Responsabilidad principal:**
 * Convertir estados del enum PedidoEstado (MAYÚSCULAS)
 * a strings minúscula para sincronizar con el frontend.
 *
 * Ejemplo de conversión:
 * - "PENDIENTE" (enum) ↔ "pendiente" (DTO)
 * - "EN_PROCESO" (enum) ↔ "en_proceso" (DTO)
 * - "COMPLETADO" (enum) ↔ "completado" (DTO)
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
     * NOTA: creadoPorId y creadoPorNombre removidos (ya no existen en entity).
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
                // creadoPorId y creadoPorNombre: REMOVIDOS
                // Cliente es siempre quien crea sus propios pedidos
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
     * NOTA: El campo cliente debe ser asignado por el servicio/controller,
     * no por este mapper.
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
                // cliente debe ser asignado por el servicio (usuario autenticado)
                // creadoPor: REMOVIDO (no existe en nuevo diseño)
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
