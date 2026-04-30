package com.realprint.realprintbackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.realprint.realprintbackend.entity.PedidoArchivo;

@Repository
public interface PedidoArchivoRepository extends JpaRepository<PedidoArchivo, Long> {
    
    // Obtener todos los archivos de un pedido
    List<PedidoArchivo> findByPedidoId(Long pedidoId);
}
