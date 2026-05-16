package com.antonio.piscinas.incidencia.dto;

import com.antonio.piscinas.incidencia.entity.CategoriaIncidencia;
import com.antonio.piscinas.incidencia.entity.PrioridadIncidencia;
import com.antonio.piscinas.incidencia.entity.TipoIncidencia;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidenciaRequestDto {

    @NotNull(message = "La piscina es obligatoria")
    private Long piscinaId;

    private Long viviendaId;

    private Long personaId;

    private Long accesoId;

    @NotNull(message = "La categoría es obligatoria")
    private CategoriaIncidencia categoria;

    @NotNull(message = "El tipo es obligatorio")
    private TipoIncidencia tipo;

    @NotNull(message = "La prioridad es obligatoria")
    private PrioridadIncidencia prioridad;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;
}