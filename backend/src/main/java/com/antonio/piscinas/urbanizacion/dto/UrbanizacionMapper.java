package com.antonio.piscinas.urbanizacion.dto;

import com.antonio.piscinas.urbanizacion.entity.Municipio;
import com.antonio.piscinas.urbanizacion.entity.Urbanizacion;

public class UrbanizacionMapper {

    private UrbanizacionMapper() {
    }

    public static UrbanizacionResponseDto toDto(Urbanizacion urbanizacion) {
        Municipio municipio = urbanizacion.getMunicipio();

        return UrbanizacionResponseDto.builder()
                .id(urbanizacion.getId())
                .nombre(urbanizacion.getNombre())
                .direccion(urbanizacion.getDireccion())
                .googleMapsUrl(urbanizacion.getGoogleMapsUrl())
                .tipoUrbanizacion(urbanizacion.getTipoUrbanizacion())
                .activa(urbanizacion.getActiva())
                .municipioId(municipio != null ? municipio.getId() : null)
                .municipioNombre(municipio != null ? municipio.getNombre() : null)
                .provinciaId(municipio != null && municipio.getProvincia() != null ? municipio.getProvincia().getId() : null)
                .provinciaNombre(municipio != null && municipio.getProvincia() != null ? municipio.getProvincia().getNombre() : null)
                .comunidadAutonomaId(
                        municipio != null && municipio.getProvincia() != null && municipio.getProvincia().getComunidad() != null
                                ? municipio.getProvincia().getComunidad().getId()
                                : null
                )
                .comunidadAutonomaNombre(
                        municipio != null && municipio.getProvincia() != null && municipio.getProvincia().getComunidad() != null
                                ? municipio.getProvincia().getComunidad().getNombre()
                                : null
                )
                .build();
    }

    public static Urbanizacion toEntity(UrbanizacionRequestDto dto, Municipio municipio) {
        return Urbanizacion.builder()
                .nombre(dto.getNombre())
                .direccion(dto.getDireccion())
                .googleMapsUrl(dto.getGoogleMapsUrl())
                .tipoUrbanizacion(dto.getTipoUrbanizacion())
                .activa(dto.getActiva() != null ? dto.getActiva() : true)
                .municipio(municipio)
                .build();
    }

    public static void updateEntity(Urbanizacion urbanizacion, UrbanizacionRequestDto dto, Municipio municipio) {
        urbanizacion.setNombre(dto.getNombre());
        urbanizacion.setDireccion(dto.getDireccion());
        urbanizacion.setGoogleMapsUrl(dto.getGoogleMapsUrl());
        urbanizacion.setTipoUrbanizacion(dto.getTipoUrbanizacion());
        urbanizacion.setActiva(dto.getActiva() != null ? dto.getActiva() : urbanizacion.getActiva());
        urbanizacion.setMunicipio(municipio);
    }
}