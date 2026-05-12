package com.realprint.realprintbackend.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utilidad para generar hashes BCrypt desde línea de comandos.
 * Uso: java PasswordHashGenerator <contraseña>
 */
public class PasswordHashGenerator {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("Uso: java PasswordHashGenerator <contraseña>");
            System.exit(1);
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = args[0];
        String hash = encoder.encode(password);

        System.out.println("Contraseña: " + password);
        System.out.println("Hash BCrypt: " + hash);
    }
}
