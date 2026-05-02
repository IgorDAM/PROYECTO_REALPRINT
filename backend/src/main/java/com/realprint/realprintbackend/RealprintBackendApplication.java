package com.realprint.realprintbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableMethodSecurity
public class RealprintBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(RealprintBackendApplication.class, args);
    }

}
