package com.antonio.piscinas.urbanizacion.service.impl;

import com.antonio.piscinas.common.exception.ResourceNotFoundException;
import com.antonio.piscinas.urbanizacion.dto.ComunidadAutonomaMapper;
import com.antonio.piscinas.urbanizacion.dto.ComunidadAutonomaResponseDto;
import com.antonio.piscinas.urbanizacion.entity.ComunidadAutonoma;
import com.antonio.piscinas.urbanizacion.repository.ComunidadAutonomaRepository;
import com.antonio.piscinas.urbanizacion.service.ComunidadAutonomaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComunidadAutonomaServiceImpl implements ComunidadAutonomaService {

    private final ComunidadAutonomaRepository comunidadAutonomaRepository;

    @Override
    public List<ComunidadAutonomaResponseDto> findAll() {
        return comunidadAutonomaRepository.findAll()
                .stream()
                .map(ComunidadAutonomaMapper::toDto)
                .toList();
    }

    @Override
    public ComunidadAutonomaResponseDto findById(Long id) {
        ComunidadAutonoma comunidadAutonoma = comunidadAutonomaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comunidad autónoma no encontrada con id: " + id));

        return ComunidadAutonomaMapper.toDto(comunidadAutonoma);
    }
}