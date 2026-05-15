package com.realprint.realprintbackend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para archivos asociados a pedidos.
 * Se usa para devolver información de archivos subidos.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoArchivoDTO {

    private Long id;

    private Long pedidoId;

    private String nombreArchivo;

    private String urlArchivo;

    private String tipoMime;

    private Long tamaño;

    private LocalDateTime createdAt;
}
