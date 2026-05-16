package com.antonio.piscinas.turno.dto;

import com.antonio.piscinas.turno.entity.TurnoPiscina;

public class TurnoPiscinaMapper {

    private TurnoPiscinaMapper() {}

    public static TurnoPiscinaResponseDto toDto(TurnoPiscina t) {
        return TurnoPiscinaResponseDto.builder()
                .id(t.getId())
                .piscinaId(t.getPiscina().getId())
                .piscinaNombre(t.getPiscina().getNombre())
                .socorristaId(t.getSocorrista().getId())
                .socorristaNombre(t.getSocorrista().getNombre())
                .socorristaApellidos(t.getSocorrista().getApellidos())
                .socorristaFotoPerfil(t.getSocorrista().getFotoPerfil())
                .fecha(t.getFecha().toString())
                .horaInicio(t.getHoraInicio() != null ? t.getHoraInicio().toString() : null)
                .horaFin(t.getHoraFin() != null ? t.getHoraFin().toString() : null)
                .estado(t.getEstado() != null ? t.getEstado().name() : null)
                .build();
    }
}
