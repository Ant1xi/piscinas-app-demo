package com.antonio.piscinas.urbanizacion.dto;

import com.antonio.piscinas.urbanizacion.entity.TipoUrbanizacion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UrbanizacionResponseDto {
    private Long id;
    private String nombre;
    private String direccion;
    private String googleMapsUrl;
    private TipoUrbanizacion tipoUrbanizacion;
    private Boolean activa;

    private Long municipioId;
    private String municipioNombre;

    private Long provinciaId;
    private String provinciaNombre;

    private Long comunidadAutonomaId;
    private String comunidadAutonomaNombre;
}