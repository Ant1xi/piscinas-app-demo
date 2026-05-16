package com.antonio.piscinas.urbanizacion.service;

import com.antonio.piscinas.urbanizacion.dto.UrbanizacionRequestDto;
import com.antonio.piscinas.urbanizacion.dto.UrbanizacionResponseDto;

import java.util.List;

public interface UrbanizacionService {

    List<UrbanizacionResponseDto> findAll();

    UrbanizacionResponseDto findById(Long id);

    UrbanizacionResponseDto create(UrbanizacionRequestDto dto);

    UrbanizacionResponseDto update(Long id, UrbanizacionRequestDto dto);

    void delete(Long id);
}