package com.antonio.piscinas.acceso.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AccesoResponseDto {

    private Long id;

    private Long piscinaId;
    private String piscinaNombre;

    private Long viviendaId;
    private String viviendaIdentificador;
    private String calleNombre;
    private String bloqueCodigo;

    private Long personaId;
    private String personaNombreCompleto;

    private String horaEntrada;
    private String horaSalida;

    private Long registradoPorId;
    private String registradoPorNombreCompleto;

    private String comentario;
}