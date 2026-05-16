package com.antonio.piscinas.estructura.dto.vivienda;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ViviendaResponseDto {

    private Long id;

    private Long urbanizacionId;
    private String urbanizacionNombre;

    private Long calleId;
    private String calleNombre;

    private Long bloqueId;
    private String bloqueCodigo;

    private String identificador;
    private String planta;
    private String observaciones;

    private Integer numVecinos;
}