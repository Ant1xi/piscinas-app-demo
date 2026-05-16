package com.antonio.piscinas.estructura.dto.bloque;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class BloqueResponseDto {

    private Long id;
    private Long urbanizacionId;
    private String urbanizacionNombre;
    private String codigo;
    private long numViviendas;
}