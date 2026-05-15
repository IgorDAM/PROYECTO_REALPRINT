package com.realprint.realprintbackend.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.realprint.realprintbackend.entity.Pedido;
import com.realprint.realprintbackend.entity.PedidoArchivo;
import com.realprint.realprintbackend.entity.PedidoEstado;
import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.exception.PedidoNoEncontradoException;
import com.realprint.realprintbackend.repository.PedidoArchivoRepository;
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
    private final PedidoArchivoRepository pedidoArchivoRepository;
    private final FileStorageService fileStorageService;

    /**
     * Devuelve todos los pedidos. Lo usaremos sobre todo en el panel de admin.
     */
    @Transactional(readOnly = true)
    public List<Pedido> findAll() {
        return pedidoRepository.findAllWithCliente();
    }

    /**
     * Devuelve todos los pedidos paginados.
     * Usado en el panel de admin con paginación para mejorar rendimiento.
     */
    @Transactional(readOnly = true)
    public Page<Pedido> findAll(Pageable pageable) {
        return pedidoRepository.findAllWithCliente(pageable);
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
     * Busca un usuario por username.
     * Usado para obtener el ID del usuario autenticado.
     */
    @Transactional(readOnly = true)
    public Usuario findUsuarioByUsername(String username) {
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));
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
     *
     * En desarrollo, DevAuthenticationFilter inyecta automáticamente un usuario mock.
     */
    public Pedido save(Pedido pedido, Authentication auth) {
        if (pedido.getCliente() == null && auth != null) {
            String username = auth.getName();
            Usuario usuarioAutenticado = usuarioRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));
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
     *
     * 1. Obtiene el pedido con sus archivos asociados
     * 2. Elimina los archivos físicos del sistema de archivos
     * 3. Elimina el pedido (cascade eliminará automáticamente pedido_archivos)
     *
     * En una versión real podríamos preferir borrado lógico, pero de momento mantenemos CRUD simple.
     */
    public void deleteById(Long id) {
        // Obtener pedido con archivos para eliminar físicamente
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new PedidoNoEncontradoException("Pedido no encontrado con id: " + id));

        // Eliminar archivos físicos del sistema de archivos
        if (pedido.getArchivos() != null && !pedido.getArchivos().isEmpty()) {
            for (var archivo : pedido.getArchivos()) {
                try {
                    fileStorageService.delete(archivo.getUrlArchivo());
                } catch (Exception e) {
                    // Log error pero continuar con la eliminación del pedido
                    System.err.println("Error al eliminar archivo físico: " + archivo.getUrlArchivo() + " - " + e.getMessage());
                }
            }
        }

        // Eliminar pedido (cascade eliminará registros en pedido_archivos)
        pedidoRepository.deleteById(id);
    }

    /**
     * Añade un archivo a un pedido existente.
     *
     * 1. Verifica que el pedido existe
     * 2. Guarda el archivo físicamente usando FileStorageService
     * 3. Crea el registro PedidoArchivo asociado al pedido
     * 4. Devuelve el PedidoArchivo guardado
     *
     * @param pedidoId ID del pedido al que asociar el archivo
     * @param file Archivo a subir
     * @return PedidoArchivo creado con toda la información
     */
    public PedidoArchivo addArchivo(Long pedidoId, MultipartFile file) {
        // Verificar que el pedido existe
        Pedido pedido = findById(pedidoId);

        // Guardar archivo físicamente
        String storedFileName = fileStorageService.store(file);

        // Crear registro de archivo asociado al pedido
        PedidoArchivo pedidoArchivo = PedidoArchivo.builder()
                .pedido(pedido)
                .nombreArchivo(file.getOriginalFilename())
                .urlArchivo(storedFileName)
                .tipoMime(file.getContentType())
                .tamaño(file.getSize())
                .build();

        return pedidoArchivoRepository.save(pedidoArchivo);
    }
}
