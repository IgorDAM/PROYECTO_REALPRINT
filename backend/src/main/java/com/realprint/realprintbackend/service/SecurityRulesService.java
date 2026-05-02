package com.realprint.realprintbackend.service;

import java.util.Objects;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.realprint.realprintbackend.dto.PedidoDTO;
import com.realprint.realprintbackend.dto.UsuarioDTO;
import com.realprint.realprintbackend.entity.Usuario;
import com.realprint.realprintbackend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Component("securityRules")
@RequiredArgsConstructor
public class SecurityRulesService {

    private final UsuarioRepository usuarioRepository;

    public boolean canCreatePedido(Authentication authentication) {
        return hasAuthority(authentication, "ROLE_CLIENTE");
    }

    public boolean canUploadFile(Authentication authentication) {
        return canCreatePedido(authentication);
    }

    public boolean canReadPedido(Authentication authentication, PedidoDTO pedido) {
        if (pedido == null) {
            return false;
        }

        if (hasAuthority(authentication, "ROLE_ADMIN")) {
            return true;
        }

        Usuario currentUser = currentUser(authentication);
        return currentUser != null && Objects.equals(currentUser.getId(), pedido.getClienteId());
    }

    public boolean canReadUsuario(Authentication authentication, UsuarioDTO usuario) {
        if (usuario == null) {
            return false;
        }

        if (hasAuthority(authentication, "ROLE_ADMIN")) {
            return true;
        }

        Usuario currentUser = currentUser(authentication);
        return currentUser != null && Objects.equals(currentUser.getId(), usuario.getId());
    }

    public boolean canUpdateUsuario(Authentication authentication, Long usuarioId) {
        if (usuarioId == null) {
            return false;
        }

        if (hasAuthority(authentication, "ROLE_ADMIN")) {
            return true;
        }

        Usuario currentUser = currentUser(authentication);
        return currentUser != null && Objects.equals(currentUser.getId(), usuarioId);
    }

    private boolean hasAuthority(Authentication authentication, String authority) {
        return authentication != null
                && authentication.getAuthorities() != null
                && authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> authority.equals(grantedAuthority.getAuthority()));
    }

    private Usuario currentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return null;
        }

        return usuarioRepository.findByUsername(authentication.getName()).orElse(null);
    }
}
