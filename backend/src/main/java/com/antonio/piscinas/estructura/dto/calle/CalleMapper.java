package com.antonio.piscinas.estructura.dto.calle;

import com.antonio.piscinas.estructura.entity.Calle;
import com.antonio.piscinas.urbanizacion.entity.Urbanizacion;

public class CalleMapper {

    private CalleMapper() {
    }

    public static Calle toEntity(CalleRequestDto dto, Urbanizacion urbanizacion) {
        return Calle.builder()
                .urbanizacion(urbanizacion)
                .nombre(dto.getNombre())
                .build();
    }

    public static void updateEntity(Calle calle, CalleRequestDto dto, Urbanizacion urbanizacion) {
        calle.setUrbanizacion(urbanizacion);
        calle.setNombre(dto.getNombre());
    }

    public static CalleResponseDto toDto(Calle calle) {
        return toDto(calle, 0L);
    }

    public static CalleResponseDto toDto(Calle calle, long numViviendas) {
        return CalleResponseDto.builder()
                .id(calle.getId())
                .nombre(calle.getNombre())
                .urbanizacionId(calle.getUrbanizacion().getId())
                .urbanizacionNombre(calle.getUrbanizacion().getNombre())
                .numViviendas(numViviendas)
                .build();
    }
}