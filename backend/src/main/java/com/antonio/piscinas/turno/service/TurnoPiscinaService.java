package com.antonio.piscinas.turno.service;

import com.antonio.piscinas.turno.dto.TurnoPiscinaRequestDto;
import com.antonio.piscinas.turno.dto.TurnoPiscinaResponseDto;

import java.util.List;

public interface TurnoPiscinaService {

    List<TurnoPiscinaResponseDto> findByPiscinaIdAndRango(Long piscinaId, String desde, String hasta);

    List<TurnoPiscinaResponseDto> findBySocorristaIdAndRango(Long socorristaId, String desde, String hasta);

    List<TurnoPiscinaResponseDto> findMisTurnos(String desde, String hasta);

    TurnoPiscinaResponseDto crear(TurnoPiscinaRequestDto dto);

    void eliminar(Long id);
}
