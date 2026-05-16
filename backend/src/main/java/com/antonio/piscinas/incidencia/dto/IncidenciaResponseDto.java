package com.antonio.piscinas.incidencia.dto;

import com.antonio.piscinas.incidencia.entity.CategoriaIncidencia;
import com.antonio.piscinas.incidencia.entity.EstadoIncidencia;
import com.antonio.piscinas.incidencia.entity.PrioridadIncidencia;
import com.antonio.piscinas.incidencia.entity.TipoIncidencia;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidenciaResponseDto {

    private Long id;

    private Long piscinaId;
    private String piscinaNombre;

    private Long viviendaId;
    private String viviendaIdentificador;

    private Long personaId;
    private String personaNombreCompleto;

    private Long accesoId;

    private CategoriaIncidencia categoria;
    private TipoIncidencia tipo;
    private PrioridadIncidencia prioridad;
    private EstadoIncidencia estado;

    private String descripcion;

    private Long creadaPorId;
    private String creadaPorNombreCompleto;
    private String createdAt;

    private Long cerradaPorId;
    private String cerradaPorNombreCompleto;
    private String cerradaAt;
}