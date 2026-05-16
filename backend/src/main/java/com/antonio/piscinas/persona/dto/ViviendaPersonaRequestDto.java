package com.antonio.piscinas.persona.dto;

import com.antonio.piscinas.persona.entity.RolVivienda;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ViviendaPersonaRequestDto {

    @NotNull(message = "La persona es obligatoria")
    private Long personaId;

    @NotNull(message = "La vivienda es obligatoria")
    private Long viviendaId;

    @NotNull(message = "El rol en la vivienda es obligatorio")
    private RolVivienda rolEnVivienda;

    private Boolean principal;

    private LocalDate fechaAlta;

    private LocalDate fechaBaja;
}