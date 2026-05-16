package com.antonio.piscinas.urbanizacion.service;

import com.antonio.piscinas.urbanizacion.dto.ComunidadAutonomaResponseDto;

import java.util.List;

public interface ComunidadAutonomaService {

    List<ComunidadAutonomaResponseDto> findAll();

    ComunidadAutonomaResponseDto findById(Long id);
}