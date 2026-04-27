package com.realprint.realprintbackend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.realprint.realprintbackend.entity.Pedido;
import com.realprint.realprintbackend.entity.PedidoEstado;
import com.realprint.realprintbackend.exception.PedidoNoEncontradoException;
import com.realprint.realprintbackend.repository.PedidoRepository;

import lombok.RequiredArgsConstructor;

/**
 * Servicio de pedidos.
 *
 * Aquí empezamos a poner la lógica de negocio encima del repositorio:
 * - listar pedidos
 * - buscar por id
 * - guardar pedidos nuevos
 * - actualizar pedidos existentes
 * - cambiar el estado
 * - eliminar cuando sea necesario
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PedidoService {

    private final PedidoRepository pedidoRepository;

    /**
     * Devuelve todos los pedidos. Lo usaremos sobre todo en el panel de admin.
     */
    @Transactional(readOnly = true)
    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }

    /**
     * Busca un pedido por id.
     * Si no existe, lanzamos una excepción de negocio clara.
     */
    @Transactional(readOnly = true)
    public Pedido findById(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new PedidoNoEncontradoException("Pedido no encontrado con id: " + id));
    }

    /**
     * Devuelve los pedidos de un cliente concreto.
     * Es la base de la pantalla "Mis pedidos".
     */
    @Transactional(readOnly = true)
    public List<Pedido> findByClienteId(Long clienteId) {
        return pedidoRepository.findByClienteId(clienteId);
    }

    /**
     * Devuelve los pedidos filtrados por estado.
     * Útil para el tablero de administración.
     */
    @Transactional(readOnly = true)
    public List<Pedido> findByEstado(PedidoEstado estado) {
        return pedidoRepository.findByEstado(estado);
    }

    /**
     * Guarda un pedido nuevo o actualizado.
     *
     * Si el pedido no tiene id, JPA lo interpreta como inserción.
     */
    public Pedido save(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    /**
     * Actualiza un pedido completo.
     * Primero comprobamos que exista para evitar guardar algo que no está en la base de datos.
     */
    public Pedido update(Long id, Pedido pedidoActualizado) {
        Pedido pedidoExistente = findById(id);

        pedidoActualizado.setId(pedidoExistente.getId());
        return pedidoRepository.save(pedidoActualizado);
    }

    /**
     * Cambia solo el estado del pedido.
     * Esto es muy útil cuando admin mueve un pedido de pendiente a en proceso o completado.
     */
    public Pedido updateEstado(Long id, PedidoEstado nuevoEstado) {
        Pedido pedido = findById(id);
        pedido.setEstado(nuevoEstado);
        return pedidoRepository.save(pedido);
    }

    /**
     * Elimina un pedido por id.
     * En una versión real podríamos preferir borrado lógico, pero de momento mantenemos CRUD simple.
     */
    public void deleteById(Long id) {
        if (!pedidoRepository.existsById(id)) {
            throw new PedidoNoEncontradoException("Pedido no encontrado con id: " + id);
        }
        pedidoRepository.deleteById(id);
    }
}

