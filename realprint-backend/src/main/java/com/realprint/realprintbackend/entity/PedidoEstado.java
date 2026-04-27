package com.realprint.realprintbackend.entity;

/**
 * Estados posibles de un pedido.
 *
 * Ciclo de vida del pedido:
 * - PENDIENTE: Acaba de crearse, no se ha comenzado la producción
 * - EN_PROCESO: Se está trabajando en el pedido
 * - COMPLETADO: La producción ha terminado
 * - ENVIADO: El pedido ha sido despachado al cliente
 * - CANCELADO: El pedido ha sido cancelado por admin o cliente
 *
 * El frontend puede filtrar por estos estados para mostrar
 * vistas diferenciadas (activos, historial, cancelados, etc.).
 */
public enum PedidoEstado {
    PENDIENTE,
    EN_PROCESO,
    COMPLETADO,
    ENVIADO,
    CANCELADO
}

