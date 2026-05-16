package com.antonio.piscinas.urbanizacion.dto;

import com.antonio.piscinas.urbanizacion.entity.TipoUrbanizacion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UrbanizacionRequestDto {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "La dirección es obligatoria")
    private String direccion;

    private String googleMapsUrl;

    @NotNull(message = "El tipo de urbanización es obligatorio")
    private TipoUrbanizacion tipoUrbanizacion;

    @NotNull(message = "El municipio es obligatorio")
    private Long municipioId;

    private Boolean activa;
}