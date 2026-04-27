package com.realprint.realprintbackend.exception;

/**
 * Excepción de negocio para indicar que el login no es válido.
 *
 * La lanzamos cuando el usuario no existe, la contraseña es incorrecta
 * o el usuario está desactivado.
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}