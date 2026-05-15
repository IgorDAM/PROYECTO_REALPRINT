package com.realprint.realprintbackend.service;

import org.springframework.core.env.Environment;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.realprint.realprintbackend.dto.PedidoDTO;
import com.realprint.realprintbackend.dto.UsuarioDTO;
import com.realprint.realprintbackend.entity.Pedido;
import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.repository.PedidoRepository;
import com.realprint.realprintbackend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

import java.util.Objects;

@Component("securityRules")
@RequiredArgsConstructor
public class SecurityRulesService {

    private final UsuarioRepository usuarioRepository;
    private final PedidoRepository pedidoRepository;
    private final Environment environment;

    public boolean canCreatePedido(Authentication authentication) {
        return isDevelopment() || hasAuthority(authentication, "ROLE_CLIENTE");
    }

    public boolean canUploadFile(Authentication authentication) {
        return isDevelopment() || hasAuthority(authentication, "ROLE_CLIENTE");
    }

    public boolean canReadPedido(Authentication authentication, PedidoDTO pedido) {
        return isDevelopment() || (
                pedido != null && (
                        hasAuthority(authentication, "ROLE_ADMIN") ||
                        isOwner(authentication, pedido.getClienteId())
                )
        );
    }

    public boolean canReadUsuario(Authentication authentication, UsuarioDTO usuario) {
        return isDevelopment() || (
                usuario != null && (
                        hasAuthority(authentication, "ROLE_ADMIN") ||
                        isOwner(authentication, usuario.getId())
                )
        );
    }

    public boolean canUpdateUsuario(Authentication authentication, Long usuarioId) {
        return isDevelopment() || (
                usuarioId != null && (
                        hasAuthority(authentication, "ROLE_ADMIN") ||
                        isOwner(authentication, usuarioId)
                )
        );
    }

    public boolean canUpdatePedido(Authentication authentication, Long pedidoId) {
        if (isDevelopment()) return true;
        if (pedidoId == null || authentication == null) return false;

        // ADMIN puede actualizar cualquier pedido
        if (hasAuthority(authentication, "ROLE_ADMIN")) {
            return true;
        }

        // CLIENTE solo puede actualizar sus propios pedidos
        if (hasAuthority(authentication, "ROLE_CLIENTE")) {
            Usuario currentUser = usuarioRepository.findByUsername(authentication.getName()).orElse(null);
            if (currentUser == null) return false;

            Pedido pedido = pedidoRepository.findById(pedidoId).orElse(null);
            if (pedido == null || pedido.getCliente() == null) return false;

            return Objects.equals(pedido.getCliente().getId(), currentUser.getId());
        }

        return false;
    }

    private boolean isDevelopment() {
        return java.util.Arrays.asList(environment.getActiveProfiles()).contains("development");
    }

    private boolean hasAuthority(Authentication authentication, String authority) {
        return authentication != null
                && authentication.getAuthorities() != null
                && authentication.getAuthorities().stream()
                .anyMatch(ga -> authority.equals(ga.getAuthority()));
    }

    private boolean isOwner(Authentication authentication, Long userId) {
        if (authentication == null || userId == null) return false;
        Usuario currentUser = usuarioRepository.findByUsername(authentication.getName()).orElse(null);
        return currentUser != null && Objects.equals(currentUser.getId(), userId);
    }
}
