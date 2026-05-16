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
public class MunicipioRequestDto {

    @NotBlank(message = "El nombre del municipio es obligatorio")
    private String nombre;

    @NotNull(message = "La provincia es obligatoria")
    private Long provinciaId;
}