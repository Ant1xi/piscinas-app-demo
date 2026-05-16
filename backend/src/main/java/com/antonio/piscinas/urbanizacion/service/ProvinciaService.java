package com.antonio.piscinas.urbanizacion.service;

import com.antonio.piscinas.urbanizacion.dto.ProvinciaResponseDto;

import java.util.List;

public interface ProvinciaService {

    List<ProvinciaResponseDto> findAll();

    ProvinciaResponseDto findById(Long id);

    List<ProvinciaResponseDto> findByComunidadAutonomaId(Long comunidadAutonomaId);
}