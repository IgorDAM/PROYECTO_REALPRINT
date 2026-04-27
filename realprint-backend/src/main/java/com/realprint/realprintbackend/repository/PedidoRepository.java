package com.realprint.realprintbackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.realprint.realprintbackend.entity.Pedido;
import com.realprint.realprintbackend.entity.PedidoEstado;

/**
 * Repositorio de pedidos.
 *
 * Con JpaRepository obtenemos operaciones CRUD básicas y luego podremos
 * añadir consultas específicas por cliente, estado o fecha.
 */
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

	// Lista de pedidos de un cliente concreto, útil para "Mis pedidos".
	List<Pedido> findByClienteId(Long clienteId);

	// Consulta por estado, muy útil en el dashboard de administración.
	List<Pedido> findByEstado(PedidoEstado estado);

	// Comentario didáctico: validamos si un archivo pertenece a un pedido de un cliente.
	// Usamos "Containing" porque fileUrlsJson se almacena como texto JSON simple.
	boolean existsByClienteIdAndFileUrlsJsonContaining(Long clienteId, String fileToken);
}

