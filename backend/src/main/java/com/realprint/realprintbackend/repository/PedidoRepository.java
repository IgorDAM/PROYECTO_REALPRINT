package com.realprint.realprintbackend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.realprint.realprintbackend.entity.Pedido;
import com.realprint.realprintbackend.entity.PedidoEstado;

/**
 * Repositorio de pedidos.
 *
 * CAMBIOS:
 * - @EntityGraph carga automáticamente las relaciones cliente
 * - Esto previene problemas de lazy loading cuando se devuelven DTOs
 * - Override de findById para asegurar que siempre carga la relación cliente
 * - Override de findAll(Pageable) para soportar paginación con relaciones cargadas
 *
 * Con JpaRepository obtenemos operaciones CRUD básicas y luego podremos
 * añadir consultas específicas por cliente, estado o fecha.
 */
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

	// Override findById para cargar relaciones y prevenir LazyInitializationException
	@EntityGraph(attributePaths = {"cliente"})
	Optional<Pedido> findById(Long id);

	// Lista de pedidos de un cliente concreto, útil para "Mis pedidos".
	@EntityGraph(attributePaths = {"cliente"})
	List<Pedido> findByClienteId(Long clienteId);

	// Consulta por estado, útil en el dashboard de administración.
	@EntityGraph(attributePaths = {"cliente"})
	List<Pedido> findByEstado(PedidoEstado estado);

	// Override findAll para cargar relaciones (sin paginación)
	@EntityGraph(attributePaths = {"cliente"})
	List<Pedido> findAll();

	// Override findAll con paginación para cargar relaciones
	@EntityGraph(attributePaths = {"cliente"})
	Page<Pedido> findAll(Pageable pageable);

}
