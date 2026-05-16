package com.antonio.piscinas.persona.service;

import com.antonio.piscinas.persona.dto.AsignarViviendaPersonaResponseDto;
import com.antonio.piscinas.persona.dto.ViviendaPersonaRequestDto;
import com.antonio.piscinas.persona.dto.ViviendaPersonaResponseDto;

import java.util.List;

public interface ViviendaPersonaService {

    List<ViviendaPersonaResponseDto> findAll();

    ViviendaPersonaResponseDto findById(Long id);

    List<ViviendaPersonaResponseDto> findByViviendaId(Long viviendaId);

    List<ViviendaPersonaResponseDto> findByPersonaId(Long personaId);

    ViviendaPersonaResponseDto create(ViviendaPersonaRequestDto dto);

    AsignarViviendaPersonaResponseDto asignar(ViviendaPersonaRequestDto dto);

    ViviendaPersonaResponseDto update(Long id, ViviendaPersonaRequestDto dto);

    void delete(Long id);
}