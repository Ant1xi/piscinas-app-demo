package com.antonio.piscinas.piscina.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PiscinaRequestDto {

    @NotNull(message = "La urbanización es obligatoria")
    private Long urbanizacionId;

    @NotBlank(message = "El nombre de la piscina es obligatorio")
    private String nombre;

    private String descripcion;

    private String horaApertura;

    private String horaCierre;

    private String rutaImagen;

    private Boolean activa;

    private Integer maxInvitadosPorVivienda;
}