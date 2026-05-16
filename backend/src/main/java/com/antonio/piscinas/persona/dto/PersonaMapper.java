package com.antonio.piscinas.persona.dto;

import com.antonio.piscinas.estructura.entity.Vivienda;
import com.antonio.piscinas.persona.entity.Persona;

public class PersonaMapper {

    private PersonaMapper() {
    }

    public static Persona toEntity(PersonaRequestDto dto) {
        return Persona.builder()
                .nombre(dto.getNombre())
                .apellidos(dto.getApellidos())
                .dni(dto.getDni())
                .telefono(dto.getTelefono())
                .email(dto.getEmail())
                .activo(dto.getActivo())
                .build();
    }

    public static void updateEntity(Persona persona, PersonaRequestDto dto) {
        persona.setNombre(dto.getNombre());
        persona.setApellidos(dto.getApellidos());
        persona.setDni(dto.getDni());
        persona.setTelefono(dto.getTelefono());
        persona.setEmail(dto.getEmail());
        persona.setActivo(dto.getActivo() != null ? dto.getActivo() : persona.getActivo());
    }

    public static PersonaResponseDto toDto(Persona persona) {
        return PersonaResponseDto.builder()
                .id(persona.getId())
                .nombre(persona.getNombre())
                .apellidos(persona.getApellidos())
                .dni(persona.getDni())
                .telefono(persona.getTelefono())
                .email(persona.getEmail())
                .fotoPerfil(persona.getFotoPerfil())
                .activo(persona.getActivo())
                .build();
    }

    public static PersonaResponseDto toDto(Persona persona, Vivienda vivienda) {
        return PersonaResponseDto.builder()
                .id(persona.getId())
                .nombre(persona.getNombre())
                .apellidos(persona.getApellidos())
                .dni(persona.getDni())
                .telefono(persona.getTelefono())
                .email(persona.getEmail())
                .fotoPerfil(persona.getFotoPerfil())
                .activo(persona.getActivo())
                .viviendaId(vivienda != null ? vivienda.getId() : null)
                .viviendaIdentificador(vivienda != null ? vivienda.getIdentificador() : null)
                .calleNombre(vivienda != null && vivienda.getCalle() != null ? vivienda.getCalle().getNombre() : null)
                .bloqueCodigo(vivienda != null && vivienda.getBloque() != null ? vivienda.getBloque().getCodigo() : null)
                .planta(vivienda != null ? vivienda.getPlanta() : null)
                .build();
    }
}