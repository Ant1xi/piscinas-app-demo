package com.antonio.piscinas.urbanizacion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProvinciaDto {
    private Long id;
    private String nombre;
    private Long comunidadAutonomaId;
    private String comunidadAutonomaNombre;
}