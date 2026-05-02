package com.realprint.realprintbackend.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad principal de pedidos.
 *
 * Cambios de diseño:
 * - clienteId ahora es @ManyToOne → Usuario (relación JPA explícita)
 * - Se elimina clienteNombre (se obtiene de usuario.getNombre())
 * - Campos removidos (legacy): subservicio, opcion, productoFinalId, boxTotal, cajasCompletadas, fileUrlsJson
 * - Se usa PedidoArchivo para gestionar archivos en lugar de fileUrlsJson
 */
@Entity
@Table(name = "pedidos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pedido {

    // Identificador autogenerado del pedido.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación: Cliente propietario del pedido
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false, foreignKey = @jakarta.persistence.ForeignKey(name = "fk_pedido_cliente"))
    private Usuario cliente;

    // Relación: Archivos asociados al pedido
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<PedidoArchivo> archivos = new ArrayList<>();

    // Tipo general de servicio: serigrafía, planchado, etc.
    @Column(nullable = false)
    private String servicio;

    // Descripción libre del trabajo a realizar.
    @Column(length = 2000)
    private String descripcion;

    // Cantidad base del pedido.
    private Integer cantidad;

    // Fecha en la que se crea o se registra el pedido.
    private LocalDate fecha;

    // Fecha estimada de entrega.
    private LocalDate fechaEntrega;

    // Medida del diseño en centímetros (ancho).
    private Integer measurementWidthCm;

    // Medida del diseño en centímetros (alto).
    private Integer measurementHeightCm;

    // Estado del pedido, por defecto pendiente.
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PedidoEstado estado = PedidoEstado.PENDIENTE;

    // Precio total calculado para este pedido.
    @Column(precision = 10, scale = 2)
    private BigDecimal total;

    // Fecha/hora de creación técnica del registro.
    private LocalDateTime createdAt;

    // Fecha/hora de última actualización.
    private LocalDateTime updatedAt;

    /**
     * Se ejecuta antes de insertar el pedido.
     * Sirve para rellenar datos automáticos sin depender del frontend.
     */
    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        if (this.fecha == null) {
            this.fecha = LocalDate.now();
        }

        if (this.estado == null) {
            this.estado = PedidoEstado.PENDIENTE;
        }
    }

    /**
     * Se ejecuta antes de cada actualización para mantener el sello de tiempo al día.
     */
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
