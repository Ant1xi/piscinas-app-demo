package com.antonio.piscinas.usuario.dto;

import com.antonio.piscinas.usuario.entity.Rol;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponseDto {

    private Long id;
    private String nombre;
    private String apellidos;
    private String email;
    private String telefono;
    private String fotoPerfil;
    private Boolean activo;
    private Rol rol;
    private LocalDateTime createdAt;
}