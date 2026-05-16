package com.antonio.piscinas.estructura.service;


import com.antonio.piscinas.estructura.dto.vivienda.ViviendaRequestDto;
import com.antonio.piscinas.estructura.dto.vivienda.ViviendaResponseDto;

import java.util.List;

public interface ViviendaService {

    List<com.antonio.piscinas.estructura.dto.vivienda.ViviendaResponseDto> findAll();

    ViviendaResponseDto findById(Long id);

    List<ViviendaResponseDto> findByUrbanizacionId(Long urbanizacionId);

    List<ViviendaResponseDto> findByCalleId(Long calleId);

    List<ViviendaResponseDto> findByBloqueId(Long bloqueId);

    ViviendaResponseDto create(ViviendaRequestDto dto);

    ViviendaResponseDto update(Long id, ViviendaRequestDto dto);

    void delete(Long id);
}