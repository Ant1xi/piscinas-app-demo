package com.antonio.piscinas.persona.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PersonaResponseDto {

    private Long id;
    private String nombre;
    private String apellidos;
    private String dni;
    private String telefono;
    private String email;
    private String fotoPerfil;
    private Boolean activo;

    private Long viviendaId;
    private String viviendaIdentificador;
    private String calleNombre;
    private String bloqueCodigo;
    private String planta;
}