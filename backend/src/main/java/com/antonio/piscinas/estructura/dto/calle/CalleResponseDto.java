package com.antonio.piscinas.estructura.dto.calle;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalleResponseDto {

    private Long id;
    private String nombre;
    private Long urbanizacionId;
    private String urbanizacionNombre;
    private long numViviendas;
}