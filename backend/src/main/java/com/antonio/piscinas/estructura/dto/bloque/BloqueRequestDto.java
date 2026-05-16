package com.antonio.piscinas.estructura.dto.bloque;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BloqueRequestDto {

    @NotNull(message = "La urbanización es obligatoria")
    private Long urbanizacionId;

    @NotBlank(message = "El código del bloque es obligatorio")
    private String codigo;
}