package com.antonio.piscinas.estructura.dto.calle;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalleRequestDto {

    @NotNull(message = "La urbanización es obligatoria")
    private Long urbanizacionId;

    @NotBlank(message = "El nombre de la calle es obligatorio")
    private String nombre;
}