package com.antonio.piscinas.persona.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroInvitadosSalidaRequestDto {

    @NotNull(message = "El ID del registro es obligatorio")
    private Long registroId;
}
