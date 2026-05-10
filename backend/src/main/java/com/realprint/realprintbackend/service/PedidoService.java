package com.realprint.realprintbackend.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.realprint.realprintbackend.entity.Pedido;
import com.realprint.realprintbackend.entity.PedidoEstado;
import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.exception.PedidoNoEncontradoException;
import com.realprint.realprintbackend.repository.PedidoRepository;
import com.realprint.realprintbackend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

/**
 * Servicio de pedidos.
 *
 * Servicio de pedidos:
 * - save(Pedido, Authentication) asigna el cliente automáticamente desde el contexto de seguridad
 * - Solo clientes pueden crear pedidos (validado en el controller)
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
    private final UsuarioRepository usuarioRepository;

    /**
     * Devuelve todos los pedidos. Lo usaremos sobre todo en el panel de admin.
     */
    @Transactional(readOnly = true)
    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }

    /**
     * Devuelve todos los pedidos paginados.
     * Usado en el panel de admin con paginación para mejorar rendimiento.
     */
    @Transactional(readOnly = true)
    public Page<Pedido> findAll(Pageable pageable) {
        return pedidoRepository.findAll(pageable);
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
     * Guarda un pedido nuevo asignando automáticamente el cliente desde el contexto de seguridad.
     * Solo CLIENTE puede invocar este método (validado en el controller con @PreAuthorize).
     */
    public Pedido save(Pedido pedido, Authentication auth) {
        if (auth != null && auth.getName() != null) {
            String username = auth.getName();
            Usuario usuarioAutenticado = usuarioRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));

            if (pedido.getCliente() == null) {
                pedido.setCliente(usuarioAutenticado);
            }
        }

        return pedidoRepository.save(pedido);
    }

    /**
     * Guarda un pedido sin contexto de autenticación.
     * Usado internamente, no debe exponerse en Controllers.
     */
    public Pedido save(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    /**
     * Actualiza un pedido existente.
     * Primero comprobamos que exista para evitar guardar algo que no está en la base de datos.
     * NO modifica cliente (owner del pedido).
     */
    public Pedido update(Long id, Pedido pedidoActualizado) {
        Pedido pedidoExistente = findById(id);

        pedidoActualizado.setId(pedidoExistente.getId());
        // NO modificar cliente (propietario)
        pedidoActualizado.setCliente(pedidoExistente.getCliente());

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
