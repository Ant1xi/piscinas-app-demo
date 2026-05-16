package com.antonio.piscinas.urbanizacion.dto;

import com.antonio.piscinas.urbanizacion.entity.ComunidadAutonoma;

public class ComunidadAutonomaMapper {

    private ComunidadAutonomaMapper() {
    }

    public static ComunidadAutonomaResponseDto toDto(ComunidadAutonoma comunidadAutonoma) {
        return ComunidadAutonomaResponseDto.builder()
                .id(comunidadAutonoma.getId())
                .nombre(comunidadAutonoma.getNombre())
                .build();
    }
}