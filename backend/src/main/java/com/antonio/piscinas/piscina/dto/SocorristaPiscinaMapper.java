package com.antonio.piscinas.piscina.dto;

import com.antonio.piscinas.piscina.entity.SocorristaPiscina;

public class SocorristaPiscinaMapper {

    private SocorristaPiscinaMapper() {
    }

    public static SocorristaPiscinaResponseDto toDto(SocorristaPiscina sp) {
        return SocorristaPiscinaResponseDto.builder()
                .id(sp.getId())
                .socorristaId(sp.getSocorrista().getId())
                .socorristaNombre(sp.getSocorrista().getNombre())
                .socorristaApellidos(sp.getSocorrista().getApellidos())
                .socorristaEmail(sp.getSocorrista().getEmail())
                .socorristaFotoPerfil(sp.getSocorrista().getFotoPerfil())
                .piscinaId(sp.getPiscina().getId())
                .piscinaNombre(sp.getPiscina().getNombre())
                .activo(sp.getActivo())
                .fechaAsignacion(sp.getFechaAsignacion() != null ? sp.getFechaAsignacion().toString() : null)
                .build();
    }
}
