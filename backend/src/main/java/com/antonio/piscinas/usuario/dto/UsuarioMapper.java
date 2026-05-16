package com.antonio.piscinas.usuario.dto;

import com.antonio.piscinas.usuario.entity.Rol;
import com.antonio.piscinas.usuario.entity.Usuario;
import com.antonio.piscinas.usuario.entity.UsuarioRol;

import java.util.Set;

public class UsuarioMapper {

    private UsuarioMapper() {
    }

    public static UsuarioResponseDto toDto(Usuario usuario, Set<UsuarioRol> roles) {
        Rol rol = null;

        if (roles != null && !roles.isEmpty()) {
            rol = roles.iterator().next().getId().getRol();
        }

        return UsuarioResponseDto.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .apellidos(usuario.getApellidos())
                .email(usuario.getEmail())
                .telefono(usuario.getTelefono())
                .fotoPerfil(usuario.getFotoPerfil())
                .activo(usuario.getActivo())
                .rol(rol)
                .createdAt(usuario.getCreatedAt())
                .build();
    }
}