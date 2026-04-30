package com.realprint.realprintbackend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad para archivos asociados a un pedido.
 *
 * Reemplaza el campo fileUrlsJson de Pedido con una relación 1:N adecuada.
 * Permite consultar, filtrar y gestionar archivos de forma más eficiente.
 */
@Entity
@Table(name = "pedido_archivos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoArchivo {

    // Identificador autogenerado.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación: Pedido al que pertenece este archivo
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pedido_id", nullable = false, foreignKey = @jakarta.persistence.ForeignKey(name = "fk_archivo_pedido"))
    private Pedido pedido;

    // Nombre del archivo original subido.
    @Column(nullable = false)
    private String nombreArchivo;

    // URL o ruta donde se almacena el archivo.
    @Column(nullable = false, columnDefinition = "TEXT")
    private String urlArchivo;

    // Tipo MIME del archivo (image/png, application/pdf, etc).
    private String tipoMime;

    // Tamaño del archivo en bytes.
    @Column(name = "tamano_bytes")
    private Long tamaño;

    // Fecha/hora de carga del archivo.
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
