package com.antonio.piscinas.piscina.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SocorristaPiscinaResponseDto {

    private Long id;

    private Long socorristaId;
    private String socorristaNombre;
    private String socorristaApellidos;
    private String socorristaEmail;
    private String socorristaFotoPerfil;

    private Long piscinaId;
    private String piscinaNombre;

    private Boolean activo;
    private String fechaAsignacion;
}
