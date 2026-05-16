package com.antonio.piscinas.persona.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RegistroInvitadosResponseDto {

    private Long id;

    private Long piscinaId;
    private Long viviendaId;
    private String viviendaIdentificador;

    private Integer cantidadInvitados;
    private String horaEntrada;
    private String horaSalida;

    private Boolean superaLimite;
}
