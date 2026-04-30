package com.realprint.realprintbackend.exception;

/**
 * Excepción de negocio para indicar que un pedido no existe.
 *
 * La usaremos en el service para devolver errores claros cuando alguien
 * intente buscar o modificar un pedido que no está en base de datos.
 */
public class PedidoNoEncontradoException extends RuntimeException {

    public PedidoNoEncontradoException(String message) {
        super(message);
    }
}
