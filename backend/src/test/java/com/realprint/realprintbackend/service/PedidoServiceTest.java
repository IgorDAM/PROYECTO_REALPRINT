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

import java.math.BigDecimal;

import com.realprint.realprintbackend.dto.PedidoDTO;
import com.realprint.realprintbackend.entity.Pedido;
import com.realprint.realprintbackend.entity.PedidoEstado;
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

    // --- Tests de autorizacion: un CLIENTE (isAdmin = false) no puede fijar
    // ni estado ni total de un pedido, aunque los mande en el cuerpo de la
    // peticion. Ver UsuarioController/PedidoController, que calculan isAdmin
    // a partir del rol real del usuario autenticado, nunca de lo que diga el
    // cliente en el DTO. ---

    @Test
    void testUpdateSinSerAdminIgnoraEstadoYTotal() {
        // El pedido nace PENDIENTE y sin total (ver save()); nos aseguramos de partir de ahi.
        assertEquals(PedidoEstado.PENDIENTE, pedidoCreado.getEstado());
        assertNull(pedidoCreado.getTotal());

        Pedido cambiosMaliciosos = Pedido.builder()
                .servicio("serigrafía actualizada")
                .descripcion("Intento de cliente")
                .cantidad(20)
                .estado(PedidoEstado.COMPLETADO)
                .total(new BigDecimal("9999.99"))
                .build();

        Pedido resultado = pedidoService.update(pedidoCreado.getId(), cambiosMaliciosos, false);

        // Los campos "normales" SI se actualizan (el propietario puede tocarlos).
        assertEquals("serigrafía actualizada", resultado.getServicio());
        assertEquals(20, resultado.getCantidad());

        // estado y total deben IGNORARSE por completo cuando quien llama no es ADMIN.
        assertEquals(PedidoEstado.PENDIENTE, resultado.getEstado(),
                "Un CLIENTE no deberia poder cambiar el estado de su propio pedido");
        assertNull(resultado.getTotal(),
                "Un CLIENTE no deberia poder fijar el total/precio de su propio pedido");
    }

    @Test
    void testUpdateComoAdminSiPermiteCambiarEstadoYTotal() {
        Pedido cambiosAdmin = Pedido.builder()
                .servicio(pedidoCreado.getServicio())
                .descripcion(pedidoCreado.getDescripcion())
                .cantidad(pedidoCreado.getCantidad())
                .estado(PedidoEstado.EN_PROCESO)
                .total(new BigDecimal("150.00"))
                .build();

        Pedido resultado = pedidoService.update(pedidoCreado.getId(), cambiosAdmin, true);

        assertEquals(PedidoEstado.EN_PROCESO, resultado.getEstado());
        assertEquals(new BigDecimal("150.00"), resultado.getTotal());
    }

    @Test
    void testUpdatePermitePrecioSugeridoSinSerAdmin() {
        // precioSugerido es solo informativo (lo recalcula el propio cliente al
        // editar su pedido), asi que el propietario SI puede actualizarlo aunque
        // no sea ADMIN.
        Pedido cambios = Pedido.builder()
                .servicio(pedidoCreado.getServicio())
                .descripcion(pedidoCreado.getDescripcion())
                .cantidad(pedidoCreado.getCantidad())
                .precioSugerido(new BigDecimal("42.50"))
                .build();

        Pedido resultado = pedidoService.update(pedidoCreado.getId(), cambios, false);

        assertEquals(new BigDecimal("42.50"), resultado.getPrecioSugerido());
        // Y sigue sin poder tocar el total real.
        assertNull(resultado.getTotal());
    }

    @Test
    void testSaveIgnoraEstadoYTotalEnviadosPorElCliente() {
        Pedido pedidoMalicioso = Pedido.builder()
                .cliente(cliente)
                .servicio("serigrafía")
                .descripcion("Intento de fijar mi propio precio")
                .cantidad(5)
                .estado(PedidoEstado.COMPLETADO)
                .total(new BigDecimal("1.00"))
                .build();

        Pedido guardado = pedidoService.save(pedidoMalicioso, null);

        assertEquals(PedidoEstado.PENDIENTE, guardado.getEstado());
        assertNull(guardado.getTotal());
    }
}

