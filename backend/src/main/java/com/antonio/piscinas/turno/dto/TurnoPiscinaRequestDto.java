package com.antonio.piscinas.turno.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TurnoPiscinaRequestDto {

    @NotNull(message = "La piscina es obligatoria")
    private Long piscinaId;

    @NotNull(message = "El socorrista es obligatorio")
    private Long socorristaId;

    @NotBlank(message = "La fecha es obligatoria")
    private String fecha;

    @NotBlank(message = "La hora de inicio es obligatoria")
    private String horaInicio;

    @NotBlank(message = "La hora de fin es obligatoria")
    private String horaFin;
}
