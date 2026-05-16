package com.antonio.piscinas.persona.dto;

import com.antonio.piscinas.persona.entity.RolVivienda;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ViviendaPersonaResponseDto {

    private Long id;

    private Long personaId;
    private String personaNombreCompleto;
    private String personaDni;
    private String personaFotoPerfil;

    private Long viviendaId;
    private String viviendaIdentificador;

    private Long calleId;
    private String calleNombre;

    private Long bloqueId;
    private String bloqueCodigo;

    private RolVivienda rolEnVivienda;
    private Boolean principal;

    private String fechaAlta;
    private String fechaBaja;
}