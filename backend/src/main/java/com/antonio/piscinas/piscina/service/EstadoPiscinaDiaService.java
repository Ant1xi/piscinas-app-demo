package com.antonio.piscinas.piscina.service;

import com.antonio.piscinas.piscina.dto.EstadoPiscinaDiaRequestDto;
import com.antonio.piscinas.piscina.dto.EstadoPiscinaDiaResponseDto;

import java.util.List;

public interface EstadoPiscinaDiaService {

    List<EstadoPiscinaDiaResponseDto> findAll();

    EstadoPiscinaDiaResponseDto findById(Long id);

    List<EstadoPiscinaDiaResponseDto> findByPiscinaId(Long piscinaId);

    EstadoPiscinaDiaResponseDto create(EstadoPiscinaDiaRequestDto dto);

    EstadoPiscinaDiaResponseDto update(Long id, EstadoPiscinaDiaRequestDto dto);

    void delete(Long id);
}