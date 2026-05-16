package com.antonio.piscinas.auth.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto {

    private String token;
    private String tokenType;

    private Long usuarioId;
    private String nombre;
    private String apellidos;
    private String email;
    private String telefono;
    private Boolean activo;
    private String rol;
    private String fotoPerfil;
}