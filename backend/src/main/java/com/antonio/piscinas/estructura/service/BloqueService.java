package com.antonio.piscinas.estructura.service;

import com.antonio.piscinas.estructura.dto.bloque.BloqueRequestDto;
import com.antonio.piscinas.estructura.dto.bloque.BloqueResponseDto;

import java.util.List;

public interface BloqueService {

    List<BloqueResponseDto> findAll();

    BloqueResponseDto findById(Long id);

    List<BloqueResponseDto> findByUrbanizacionId(Long urbanizacionId);

    List<BloqueResponseDto> findByPiscinaId(Long piscinaId);

    BloqueResponseDto create(BloqueRequestDto dto);

    BloqueResponseDto update(Long id, BloqueRequestDto dto);

    void delete(Long id);
}