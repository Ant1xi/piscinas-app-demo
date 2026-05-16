package com.antonio.piscinas.urbanizacion.dto;

import com.antonio.piscinas.urbanizacion.entity.Municipio;
import com.antonio.piscinas.urbanizacion.entity.Provincia;

public class MunicipioMapper {

    private MunicipioMapper() {
    }

    public static MunicipioResponseDto toDto(Municipio municipio) {
        Provincia provincia = municipio.getProvincia();

        return MunicipioResponseDto.builder()
                .id(municipio.getId())
                .nombre(municipio.getNombre())
                .provinciaId(provincia != null ? provincia.getId() : null)
                .provinciaNombre(provincia != null ? provincia.getNombre() : null)
                .comunidadAutonomaId(
                        provincia != null && provincia.getComunidad() != null
                                ? provincia.getComunidad().getId()
                                : null
                )
                .comunidadAutonomaNombre(
                        provincia != null && provincia.getComunidad() != null
                                ? provincia.getComunidad().getNombre()
                                : null
                )
                .build();
    }

    public static Municipio toEntity(MunicipioRequestDto dto, Provincia provincia) {
        return Municipio.builder()
                .nombre(dto.getNombre())
                .provincia(provincia)
                .build();
    }

    public static void updateEntity(Municipio municipio, MunicipioRequestDto dto, Provincia provincia) {
        municipio.setNombre(dto.getNombre());
        municipio.setProvincia(provincia);
    }
}