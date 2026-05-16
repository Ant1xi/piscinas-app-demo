package com.antonio.piscinas.piscina.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstadoPiscinaDiaRequestDto {

    @NotNull(message = "La piscina es obligatoria")
    private Long piscinaId;

    private String fecha;

    private Boolean abierta;

    private Boolean confirmacionOk;

    private String nota;
}