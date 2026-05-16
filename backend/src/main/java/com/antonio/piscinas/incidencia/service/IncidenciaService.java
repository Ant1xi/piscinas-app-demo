package com.antonio.piscinas.incidencia.service;

import com.antonio.piscinas.incidencia.dto.*;

import java.util.List;

public interface IncidenciaService {

    List<IncidenciaResponseDto> findAll();

    IncidenciaResponseDto findById(Long id);

    List<IncidenciaResponseDto> findByPiscinaId(Long piscinaId);

    IncidenciaResponseDto create(IncidenciaRequestDto dto);

    IncidenciaResponseDto update(Long id, IncidenciaUpdateDto dto);

    IncidenciaResponseDto cerrar(Long id, CerrarIncidenciaDto dto);

    IncidenciaResponseDto ponerEnRevision(Long id);
}