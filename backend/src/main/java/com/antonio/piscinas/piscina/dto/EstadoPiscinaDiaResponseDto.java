package com.antonio.piscinas.piscina.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstadoPiscinaDiaResponseDto {

    private Long id;
    private String fecha;
    private Boolean abierta;
    private Boolean confirmacionOk;
    private String nota;

    private Long piscinaId;
    private String piscinaNombre;

    private Long actualizadoPorId;
    private String actualizadoPorNombreCompleto;

    private String updatedAt;
}