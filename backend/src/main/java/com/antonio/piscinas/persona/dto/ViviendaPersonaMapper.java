package com.antonio.piscinas.persona.dto;

import com.antonio.piscinas.estructura.entity.Vivienda;
import com.antonio.piscinas.persona.entity.Persona;
import com.antonio.piscinas.persona.entity.ViviendaPersona;

public class ViviendaPersonaMapper {

    private ViviendaPersonaMapper() {
    }

    public static ViviendaPersona toEntity(ViviendaPersonaRequestDto dto,
                                           Persona persona,
                                           Vivienda vivienda) {
        return ViviendaPersona.builder()
                .persona(persona)
                .vivienda(vivienda)
                .rolEnVivienda(dto.getRolEnVivienda())
                .principal(dto.getPrincipal() != null ? dto.getPrincipal() : false)
                .fechaAlta(dto.getFechaAlta())
                .fechaBaja(dto.getFechaBaja())
                .build();
    }

    public static void updateEntity(ViviendaPersona viviendaPersona,
                                    ViviendaPersonaRequestDto dto,
                                    Persona persona,
                                    Vivienda vivienda) {
        viviendaPersona.setPersona(persona);
        viviendaPersona.setVivienda(vivienda);
        viviendaPersona.setRolEnVivienda(dto.getRolEnVivienda());
        viviendaPersona.setPrincipal(dto.getPrincipal() != null ? dto.getPrincipal() : viviendaPersona.getPrincipal());
        viviendaPersona.setFechaAlta(dto.getFechaAlta());
        viviendaPersona.setFechaBaja(dto.getFechaBaja());
    }

    public static ViviendaPersonaResponseDto toDto(ViviendaPersona vp) {
        Vivienda vivienda = vp.getVivienda();

        return ViviendaPersonaResponseDto.builder()
                .id(vp.getId())
                .personaId(vp.getPersona().getId())
                .personaNombreCompleto(vp.getPersona().getNombre() + " " + vp.getPersona().getApellidos())
                .personaDni(vp.getPersona().getDni())
                .personaFotoPerfil(vp.getPersona().getFotoPerfil())
                .viviendaId(vivienda.getId())
                .viviendaIdentificador(vivienda.getIdentificador())
                .calleId(vivienda.getCalle() != null ? vivienda.getCalle().getId() : null)
                .calleNombre(vivienda.getCalle() != null ? vivienda.getCalle().getNombre() : null)
                .bloqueId(vivienda.getBloque() != null ? vivienda.getBloque().getId() : null)
                .bloqueCodigo(vivienda.getBloque() != null ? vivienda.getBloque().getCodigo() : null)
                .rolEnVivienda(vp.getRolEnVivienda())
                .principal(vp.getPrincipal())
                .fechaAlta(vp.getFechaAlta() != null ? vp.getFechaAlta().toString() : null)
                .fechaBaja(vp.getFechaBaja() != null ? vp.getFechaBaja().toString() : null)
                .build();
    }
}