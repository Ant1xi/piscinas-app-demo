package com.antonio.piscinas.acceso.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccesoSalidaRequestDto {

    @NotNull(message = "El acceso es obligatorio")
    private Long accesoId;

    private String comentario;
}