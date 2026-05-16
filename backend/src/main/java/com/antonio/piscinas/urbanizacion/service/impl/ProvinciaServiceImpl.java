package com.antonio.piscinas.urbanizacion.service.impl;

import com.antonio.piscinas.common.exception.BadRequestException;
import com.antonio.piscinas.common.exception.ResourceNotFoundException;
import com.antonio.piscinas.urbanizacion.dto.ProvinciaMapper;
import com.antonio.piscinas.urbanizacion.dto.ProvinciaRequestDto;
import com.antonio.piscinas.urbanizacion.dto.ProvinciaResponseDto;
import com.antonio.piscinas.urbanizacion.entity.ComunidadAutonoma;
import com.antonio.piscinas.urbanizacion.entity.Provincia;
import com.antonio.piscinas.urbanizacion.repository.ComunidadAutonomaRepository;
import com.antonio.piscinas.urbanizacion.repository.ProvinciaRepository;
import com.antonio.piscinas.urbanizacion.service.ProvinciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProvinciaServiceImpl implements ProvinciaService {

    private final ProvinciaRepository provinciaRepository;
    private final ComunidadAutonomaRepository comunidadAutonomaRepository;

    @Override
    public List<ProvinciaResponseDto> findAll() {
        return provinciaRepository.findAll()
                .stream()
                .map(ProvinciaMapper::toDto)
                .toList();
    }

    @Override
    public ProvinciaResponseDto findById(Long id) {
        Provincia provincia = provinciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provincia no encontrada con id: " + id));

        return ProvinciaMapper.toDto(provincia);
    }

    @Override
    public List<ProvinciaResponseDto> findByComunidadAutonomaId(Long comunidadAutonomaId) {
        ComunidadAutonoma comunidad = comunidadAutonomaRepository.findById(comunidadAutonomaId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Comunidad autónoma no encontrada con id: " + comunidadAutonomaId
                ));

        return provinciaRepository.findByComunidad(comunidad)
                .stream()
                .map(ProvinciaMapper::toDto)
                .toList();
    }

}