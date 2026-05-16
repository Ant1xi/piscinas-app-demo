package com.antonio.piscinas.piscina.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PiscinaResponseDto {

    private Long id;
    private String nombre;
    private String descripcion;
    private String horaApertura;
    private String horaCierre;
    private String rutaImagen;
    private Boolean activa;

    private Long urbanizacionId;
    private String urbanizacionNombre;
    private Long municipioId;
    private String municipioNombre;

    private Integer maxInvitadosPorVivienda;
    private String tipoUrbanizacion;
    private String googleMapsUrl;
}