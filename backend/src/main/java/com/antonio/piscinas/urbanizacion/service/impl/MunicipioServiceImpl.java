package com.antonio.piscinas.urbanizacion.service.impl;

import com.antonio.piscinas.common.exception.BadRequestException;
import com.antonio.piscinas.common.exception.ResourceNotFoundException;
import com.antonio.piscinas.urbanizacion.dto.MunicipioMapper;
import com.antonio.piscinas.urbanizacion.dto.MunicipioRequestDto;
import com.antonio.piscinas.urbanizacion.dto.MunicipioResponseDto;
import com.antonio.piscinas.urbanizacion.entity.Municipio;
import com.antonio.piscinas.urbanizacion.entity.Provincia;
import com.antonio.piscinas.urbanizacion.repository.MunicipioRepository;
import com.antonio.piscinas.urbanizacion.repository.ProvinciaRepository;
import com.antonio.piscinas.urbanizacion.service.MunicipioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MunicipioServiceImpl implements MunicipioService {

    private final MunicipioRepository municipioRepository;
    private final ProvinciaRepository provinciaRepository;

    @Override
    public List<MunicipioResponseDto> findAll() {
        return municipioRepository.findAll()
                .stream()
                .map(MunicipioMapper::toDto)
                .toList();
    }

    @Override
    public MunicipioResponseDto findById(Long id) {
        Municipio municipio = municipioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Municipio no encontrado con id: " + id));

        return MunicipioMapper.toDto(municipio);
    }

    @Override
    public List<MunicipioResponseDto> findByProvinciaId(Long provinciaId) {
        Provincia provincia = provinciaRepository.findById(provinciaId)
                .orElseThrow(() -> new ResourceNotFoundException("Provincia no encontrada con id: " + provinciaId));

        return municipioRepository.findByProvincia(provincia)
                .stream()
                .map(MunicipioMapper::toDto)
                .toList();
    }

}