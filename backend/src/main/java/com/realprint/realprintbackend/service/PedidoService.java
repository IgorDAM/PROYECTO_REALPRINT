package com.realprint.realprintbackend.service;

import java.util.List;

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
 * CAMBIOS con nuevo diseño:
 * - save(Pedido, Authentication) asigna cliente y creadoPor automáticamente
 * - cliente: El usuario autenticado (o el especificado en DTO si es admin)
 * - creadoPor: Siempre el usuario autenticado
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
     * Guarda un pedido nuevo.
     * NOTA: Solo CLIENTE puede crear pedidos (validado en controller).
     * 
     * Asigna cliente al usuario autenticado.
     * El campo creadoPor fue removido: cliente es siempre quien crea.
     *
     * @param pedido El pedido a guardar
     * @param auth Contexto de seguridad con el usuario autenticado
     * @return El pedido guardado
     * @throws RuntimeException si usuario no encontrado
     */
    public Pedido save(Pedido pedido, Authentication auth) {
        // Obtener el usuario autenticado (DEBE ser CLIENTE)
        String username = auth.getName();
        Usuario usuarioAutenticado = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));

        // Asignar cliente: siempre el usuario autenticado
        // (creadoPor fue removido, cliente_id es suficiente)
        if (pedido.getCliente() == null) {
            pedido.setCliente(usuarioAutenticado);
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
