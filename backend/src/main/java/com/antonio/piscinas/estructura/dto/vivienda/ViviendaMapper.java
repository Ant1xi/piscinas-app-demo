package com.antonio.piscinas.estructura.dto.vivienda;

import com.antonio.piscinas.estructura.entity.Bloque;
import com.antonio.piscinas.estructura.entity.Calle;
import com.antonio.piscinas.estructura.entity.Vivienda;
import com.antonio.piscinas.urbanizacion.entity.Urbanizacion;

public class ViviendaMapper {

    private ViviendaMapper() {
    }

    public static Vivienda toEntity(ViviendaRequestDto dto,
                                    Urbanizacion urbanizacion,
                                    Calle calle,
                                    Bloque bloque) {
        return Vivienda.builder()
                .urbanizacion(urbanizacion)
                .calle(calle)
                .bloque(bloque)
                .identificador(dto.getIdentificador())
                .planta(dto.getPlanta())
                .observaciones(dto.getObservaciones())
                .build();
    }

    public static void updateEntity(Vivienda vivienda,
                                    ViviendaRequestDto dto,
                                    Urbanizacion urbanizacion,
                                    Calle calle,
                                    Bloque bloque) {
        vivienda.setUrbanizacion(urbanizacion);
        vivienda.setCalle(calle);
        vivienda.setBloque(bloque);
        vivienda.setIdentificador(dto.getIdentificador());
        vivienda.setPlanta(dto.getPlanta());
        vivienda.setObservaciones(dto.getObservaciones());
    }

    public static ViviendaResponseDto toDto(Vivienda vivienda) {
        return ViviendaResponseDto.builder()
                .id(vivienda.getId())
                .urbanizacionId(vivienda.getUrbanizacion().getId())
                .urbanizacionNombre(vivienda.getUrbanizacion().getNombre())
                .calleId(vivienda.getCalle() != null ? vivienda.getCalle().getId() : null)
                .calleNombre(vivienda.getCalle() != null ? vivienda.getCalle().getNombre() : null)
                .bloqueId(vivienda.getBloque() != null ? vivienda.getBloque().getId() : null)
                .bloqueCodigo(vivienda.getBloque() != null ? vivienda.getBloque().getCodigo() : null)
                .identificador(vivienda.getIdentificador())
                .planta(vivienda.getPlanta())
                .observaciones(vivienda.getObservaciones())
                .build();
    }

    public static ViviendaResponseDto toDto(Vivienda vivienda, int numVecinos) {
        ViviendaResponseDto dto = toDto(vivienda);
        dto.setNumVecinos(numVecinos);
        return dto;
    }
}