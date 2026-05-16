package com.antonio.piscinas.persona.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroInvitadosEntradaRequestDto {

    @NotNull(message = "La piscina es obligatoria")
    private Long piscinaId;

    @NotNull(message = "La vivienda es obligatoria")
    private Long viviendaId;

    @NotNull(message = "La cantidad de invitados es obligatoria")
    @Min(value = 1, message = "Debe haber al menos 1 invitado")
    private Integer cantidadInvitados;

    private String comentario;
}
