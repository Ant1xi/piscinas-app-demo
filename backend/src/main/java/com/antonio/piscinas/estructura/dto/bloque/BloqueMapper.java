package com.antonio.piscinas.estructura.dto.bloque;

import com.antonio.piscinas.estructura.entity.Bloque;
import com.antonio.piscinas.urbanizacion.entity.Urbanizacion;

public class BloqueMapper {

    private BloqueMapper() {
    }

    public static BloqueResponseDto toDto(Bloque bloque) {
        return toDto(bloque, 0L);
    }

    public static BloqueResponseDto toDto(Bloque bloque, long numViviendas) {
        return BloqueResponseDto.builder()
                .id(bloque.getId())
                .urbanizacionId(bloque.getUrbanizacion().getId())
                .urbanizacionNombre(bloque.getUrbanizacion().getNombre())
                .codigo(bloque.getCodigo())
                .numViviendas(numViviendas)
                .build();
    }

    public static Bloque toEntity(BloqueRequestDto dto, Urbanizacion urbanizacion) {
        return Bloque.builder()
                .urbanizacion(urbanizacion)
                .codigo(dto.getCodigo().trim())
                .build();
    }
}