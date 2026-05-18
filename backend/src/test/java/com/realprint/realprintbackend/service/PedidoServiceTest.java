package com.realprint.realprintbackend.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.realprint.realprintbackend.dto.PedidoDTO;
import com.realprint.realprintbackend.entity.Pedido;
import com.realprint.realprintbackend.entity.RolUsuario;
import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.repository.PedidoRepository;
import com.realprint.realprintbackend.repository.UsuarioRepository;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class PedidoServiceTest {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Pedido pedidoCreado;
    private Usuario cliente;

    @BeforeEach
    void setUp() {
        // Crear un usuario cliente con timestamp único para evitar restricción unique
        long timestamp = System.currentTimeMillis();
        cliente = Usuario.builder()
                .username("testcliente" + timestamp)
                .nombre("Test Cliente")
                .email("test" + timestamp + "@example.com")
                .rol(RolUsuario.CLIENTE)
                .passwordHash("hash")
                .build();
        usuarioRepository.save(cliente);

        // Crear un pedido
        pedidoCreado = Pedido.builder()
                .cliente(cliente)
                .servicio("serigrafía")
                .descripcion("Pedido de prueba")
                .cantidad(10)
                .build();
        pedidoCreado = pedidoRepository.save(pedidoCreado);
    }

    @Test
    void testFindAllDTOIncluirArchivos() {
        // Subir un archivo
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                "test content".getBytes()
        );
        pedidoService.addArchivo(pedidoCreado.getId(), file);

        // Obtener la página de pedidos con DTO
        Pageable pageable = PageRequest.of(0, 20);
        Page<PedidoDTO> pageDTO = pedidoService.findAllDTO(pageable);

        assertNotNull(pageDTO);
        assertTrue(pageDTO.getContent().size() > 0);

        PedidoDTO pedidoDTO = pageDTO.getContent().stream()
                .filter(p -> p.getId().equals(pedidoCreado.getId()))
                .findFirst()
                .orElse(null);

        assertNotNull(pedidoDTO, "Pedido DTO debería encontrarse");
        assertNotNull(pedidoDTO.getArchivos(), "Archivos no debería ser null");
        assertEquals(1, pedidoDTO.getArchivos().size(), "Debería haber 1 archivo");
        assertEquals("test.pdf", pedidoDTO.getArchivos().get(0).getNombreArchivo());
    }

    @Test
    void testFindByIdDTOIncluirArchivos() {
        // Subir un archivo
        MultipartFile file = new MockMultipartFile(
                "file",
                "documento.pdf",
                "application/pdf",
                "contenido".getBytes()
        );
        pedidoService.addArchivo(pedidoCreado.getId(), file);

        // Obtener el pedido individual con DTO
        PedidoDTO pedidoDTO = pedidoService.findByIdDTO(pedidoCreado.getId());

        assertNotNull(pedidoDTO);
        assertEquals(pedidoCreado.getId(), pedidoDTO.getId());
        assertNotNull(pedidoDTO.getArchivos());
        assertEquals(1, pedidoDTO.getArchivos().size());
        assertEquals("documento.pdf", pedidoDTO.getArchivos().get(0).getNombreArchivo());
    }

    @Test
    void testFindByClienteIdDTOIncluirArchivos() {
        // Subir un archivo
        MultipartFile file = new MockMultipartFile(
                "file",
                "archivo.pdf",
                "application/pdf",
                "data".getBytes()
        );
        pedidoService.addArchivo(pedidoCreado.getId(), file);

        // Obtener pedidos del cliente
        List<PedidoDTO> pedidos = pedidoService.findByClienteIdDTO(cliente.getId());

        assertNotNull(pedidos);
        assertTrue(pedidos.size() > 0);

        PedidoDTO pedidoDTO = pedidos.stream()
                .filter(p -> p.getId().equals(pedidoCreado.getId()))
                .findFirst()
                .orElse(null);

        assertNotNull(pedidoDTO);
        assertNotNull(pedidoDTO.getArchivos());
        assertEquals(1, pedidoDTO.getArchivos().size());
        assertEquals("archivo.pdf", pedidoDTO.getArchivos().get(0).getNombreArchivo());
    }
}

