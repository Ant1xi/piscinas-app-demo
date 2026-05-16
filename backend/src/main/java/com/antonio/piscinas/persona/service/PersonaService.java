package com.antonio.piscinas.persona.service;

import com.antonio.piscinas.persona.dto.PersonaRequestDto;
import com.antonio.piscinas.persona.dto.PersonaResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PersonaService {

    List<PersonaResponseDto> findAll();

    PersonaResponseDto findById(Long id);

    PersonaResponseDto create(PersonaRequestDto dto);

    PersonaResponseDto update(Long id, PersonaRequestDto dto);

    PersonaResponseDto saveFoto(Long id, MultipartFile file);

    List<PersonaResponseDto> buscarPorPiscinaYTexto(Long piscinaId, String texto);

    List<PersonaResponseDto> findByViviendaId(Long viviendaId);

    void delete(Long id);
}