package com.antonio.piscinas.acceso.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccesoEntradaRequestDto {

    @NotNull(message = "La piscina es obligatoria")
    private Long piscinaId;

    @NotNull(message = "La vivienda es obligatoria")
    private Long viviendaId;

    @NotNull(message = "La persona es obligatoria")
    private Long personaId;

    private String comentario;
}