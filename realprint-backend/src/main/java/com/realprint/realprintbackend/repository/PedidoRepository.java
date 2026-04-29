package com.realprint.realprintbackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.realprint.realprintbackend.entity.Pedido;
import com.realprint.realprintbackend.entity.PedidoEstado;

/**
 * Repositorio de pedidos.
 *
 * CAMBIOS:
 * - @EntityGraph carga automáticamente las relaciones cliente y creadoPor
 * - Esto previene problemas de lazy loading cuando se devuelven DTOs
 *
 * Con JpaRepository obtenemos operaciones CRUD básicas y luego podremos
 * añadir consultas específicas por cliente, estado o fecha.
 */
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

	// Lista de pedidos de un cliente concreto, útil para "Mis pedidos".
	// @EntityGraph carga cliente y creadoPor para evitar lazy loading
	@EntityGraph(attributePaths = {"cliente", "creadoPor"})
	List<Pedido> findByClienteId(Long clienteId);

	// Consulta por estado, muy útil en el dashboard de administración.
	// @EntityGraph carga cliente y creadoPor
	@EntityGraph(attributePaths = {"cliente", "creadoPor"})
	List<Pedido> findByEstado(PedidoEstado estado);

	// Override findAll para cargar relaciones
	@EntityGraph(attributePaths = {"cliente", "creadoPor"})
	List<Pedido> findAll();

	// Comentario didáctico: validamos si un archivo pertenece a un pedido de un cliente.
	// Usamos "Containing" porque fileUrlsJson se almacena como texto JSON simple.
	boolean existsByClienteIdAndFileUrlsJsonContaining(Long clienteId, String fileToken);
}
