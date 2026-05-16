package com.antonio.piscinas.security;

import com.antonio.piscinas.common.exception.ResourceNotFoundException;
import com.antonio.piscinas.usuario.entity.Usuario;
import com.antonio.piscinas.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticatedUserService {

    private final UsuarioRepository usuarioRepository;

    public Usuario getAuthenticatedUsuario() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof JwtUserPrincipal principal)) {
            throw new ResourceNotFoundException("No hay usuario autenticado");
        }

        return usuarioRepository.findById(principal.userId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario autenticado no encontrado"));
    }

    public Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof JwtUserPrincipal principal)) {
            throw new ResourceNotFoundException("No hay usuario autenticado");
        }

        return principal.userId();
    }

    public String getAuthenticatedEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof JwtUserPrincipal principal)) {
            throw new ResourceNotFoundException("No hay usuario autenticado");
        }

        return principal.email();
    }

    public String getAuthenticatedRol() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof JwtUserPrincipal principal)) {
            throw new ResourceNotFoundException("No hay usuario autenticado");
        }

        return principal.rol();
    }
}