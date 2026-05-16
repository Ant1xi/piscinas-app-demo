package com.antonio.piscinas.piscina.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocorristaPiscinaRequestDto {

    @NotNull(message = "El socorrista es obligatorio")
    private Long socorristaId;

    @NotNull(message = "La piscina es obligatoria")
    private Long piscinaId;
}
