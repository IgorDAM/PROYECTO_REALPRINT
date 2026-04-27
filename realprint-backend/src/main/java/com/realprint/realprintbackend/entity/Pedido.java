package com.realprint.realprintbackend.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
 * Aquí guardaremos la información base que luego verá el admin y el cliente:
 * cliente, servicio, estado, precio, fechas y datos técnicos del pedido.
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

    // ID del cliente propietario del pedido.
    @Column(nullable = false)
    private Long clienteId;

    // Nombre visible del cliente, útil para administración y listados.
    @Column(nullable = false)
    private String clienteNombre;

    // Tipo general de servicio: serigrafía, planchado, etc.
    @Column(nullable = false)
    private String servicio;

    // Subservicio o variante concreta del trabajo.
    private String subservicio;

    // Opción elegida dentro del flujo del formulario.
    private String opcion;

    // Si el pedido depende de un producto final del admin, guardamos su id.
    private Long productoFinalId;

    // Descripción libre del trabajo a realizar.
    @Column(length = 2000)
    private String descripcion;

    // Cantidad base del pedido.
    private Integer cantidad;

    // Cantidad de unidades finales si el formulario la separa.
    private Integer cantidadUnidades;

    // Fecha en la que se crea o se registra el pedido.
    private LocalDate fecha;

    // Fecha estimada de entrega.
    private LocalDate fechaEntrega;

    // Medida del diseño en centímetros (ancho).
    private Integer measurementWidthCm;

    // Medida del diseño en centímetros (alto).
    private Integer measurementHeightCm;

    // URLs o nombres de archivos subidos, almacenados como texto JSON simple.
    @Column(columnDefinition = "TEXT")
    private String fileUrlsJson;

    // Estado del pedido, por defecto pendiente.
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PedidoEstado estado = PedidoEstado.PENDIENTE;

    // Precio total calculado para este pedido.
    @Column(precision = 10, scale = 2)
    private BigDecimal total;

    // Total de cajas si el flujo de negocio las usa.
    private Integer boxTotal;

    // Cajas ya completadas en el proceso.
    @Builder.Default
    private Integer cajasCompletadas = 0;

    // Tamaño de caja usado por algunos trabajos del taller.
    private Integer tamanoCaja;

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

        if (this.cajasCompletadas == null) {
            this.cajasCompletadas = 0;
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

