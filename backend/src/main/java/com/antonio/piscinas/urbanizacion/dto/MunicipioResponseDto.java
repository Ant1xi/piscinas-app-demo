package com.antonio.piscinas.urbanizacion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MunicipioResponseDto {

    private Long id;
    private String nombre;
    private Long provinciaId;
    private String provinciaNombre;
    private Long comunidadAutonomaId;
    private String comunidadAutonomaNombre;
}