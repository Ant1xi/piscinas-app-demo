package com.antonio.piscinas.urbanizacion.dto;

import com.antonio.piscinas.urbanizacion.entity.ComunidadAutonoma;
import com.antonio.piscinas.urbanizacion.entity.Provincia;

public class ProvinciaMapper {

    private ProvinciaMapper() {
    }

    public static ProvinciaResponseDto toDto(Provincia provincia) {
        ComunidadAutonoma comunidad = provincia.getComunidad();

        return ProvinciaResponseDto.builder()
                .id(provincia.getId())
                .nombre(provincia.getNombre())
                .comunidadAutonomaId(comunidad != null ? comunidad.getId() : null)
                .comunidadAutonomaNombre(comunidad != null ? comunidad.getNombre() : null)
                .build();
    }

    public static Provincia toEntity(ProvinciaRequestDto dto, ComunidadAutonoma comunidad) {
        return Provincia.builder()
                .nombre(dto.getNombre())
                .comunidad(comunidad)
                .build();
    }

    public static void updateEntity(Provincia provincia, ProvinciaRequestDto dto, ComunidadAutonoma comunidad) {
        provincia.setNombre(dto.getNombre());
        provincia.setComunidad(comunidad);
    }
}