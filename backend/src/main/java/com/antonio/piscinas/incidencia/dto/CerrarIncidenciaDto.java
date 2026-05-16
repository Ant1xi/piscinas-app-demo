package com.antonio.piscinas.incidencia.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CerrarIncidenciaDto {

    @NotBlank(message = "La nota de cierre es obligatoria")
    private String notaCierre;
}