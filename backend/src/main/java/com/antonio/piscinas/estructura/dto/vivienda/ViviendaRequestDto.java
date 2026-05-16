package com.antonio.piscinas.estructura.dto.vivienda;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ViviendaRequestDto {

    @NotNull(message = "La urbanización es obligatoria")
    private Long urbanizacionId;

    private Long calleId;

    private Long bloqueId;

    @NotBlank(message = "El identificador es obligatorio")
    private String identificador;

    private String planta;

    private String observaciones;
}