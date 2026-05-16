package com.antonio.piscinas.urbanizacion.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProvinciaRequestDto {

    @NotBlank(message = "El nombre de la provincia es obligatorio")
    private String nombre;

    @NotNull(message = "La comunidad autónoma es obligatoria")
    private Long comunidadAutonomaId;
}