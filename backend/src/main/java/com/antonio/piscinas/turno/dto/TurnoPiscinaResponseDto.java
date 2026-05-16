package com.antonio.piscinas.turno.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TurnoPiscinaResponseDto {

    private Long id;

    private Long piscinaId;
    private String piscinaNombre;

    private Long socorristaId;
    private String socorristaNombre;
    private String socorristaApellidos;
    private String socorristaFotoPerfil;

    private String fecha;
    private String horaInicio;
    private String horaFin;
    private String estado;
}
