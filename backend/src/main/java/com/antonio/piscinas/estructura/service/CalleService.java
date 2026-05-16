package com.antonio.piscinas.estructura.service;

import com.antonio.piscinas.estructura.dto.calle.CalleRequestDto;
import com.antonio.piscinas.estructura.dto.calle.CalleResponseDto;

import java.util.List;

public interface CalleService {

    List<CalleResponseDto> findAll();

    CalleResponseDto findById(Long id);

    List<CalleResponseDto> findByUrbanizacionId(Long urbanizacionId);

    List<CalleResponseDto> findByPiscinaId(Long piscinaId);

    CalleResponseDto create(CalleRequestDto dto);

    CalleResponseDto update(Long id, CalleRequestDto dto);

    void delete(Long id);
}