package com.antonio.piscinas.urbanizacion.service.impl;

import com.antonio.piscinas.common.exception.BadRequestException;
import com.antonio.piscinas.common.exception.ResourceNotFoundException;
import com.antonio.piscinas.urbanizacion.dto.UrbanizacionMapper;
import com.antonio.piscinas.urbanizacion.dto.UrbanizacionRequestDto;
import com.antonio.piscinas.urbanizacion.dto.UrbanizacionResponseDto;
import com.antonio.piscinas.urbanizacion.entity.Municipio;
import com.antonio.piscinas.urbanizacion.entity.Urbanizacion;
import com.antonio.piscinas.urbanizacion.repository.MunicipioRepository;
import com.antonio.piscinas.urbanizacion.repository.UrbanizacionRepository;
import com.antonio.piscinas.urbanizacion.service.UrbanizacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UrbanizacionServiceImpl implements UrbanizacionService {

    private final UrbanizacionRepository urbanizacionRepository;
    private final MunicipioRepository municipioRepository;

    @Override
    public List<UrbanizacionResponseDto> findAll() {
        return urbanizacionRepository.findAll()
                .stream()
                .map(UrbanizacionMapper::toDto)
                .toList();
    }

    @Override
    public UrbanizacionResponseDto findById(Long id) {
        Urbanizacion urbanizacion = urbanizacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Urbanización no encontrada con id: " + id));

        return UrbanizacionMapper.toDto(urbanizacion);
    }

    @Override
    public UrbanizacionResponseDto create(UrbanizacionRequestDto dto) {
        Municipio municipio = municipioRepository.findById(dto.getMunicipioId())
                .orElseThrow(() -> new ResourceNotFoundException("Municipio no encontrado con id: " + dto.getMunicipioId()));

        if (urbanizacionRepository.existsByNombreAndMunicipio(dto.getNombre(), municipio)) {
            throw new BadRequestException("Ya existe una urbanización con ese nombre en el municipio seleccionado");
        }

        Urbanizacion urbanizacion = UrbanizacionMapper.toEntity(dto, municipio);
        Urbanizacion guardada = urbanizacionRepository.save(urbanizacion);

        return UrbanizacionMapper.toDto(guardada);
    }

    @Override
    public UrbanizacionResponseDto update(Long id, UrbanizacionRequestDto dto) {
        Urbanizacion urbanizacion = urbanizacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Urbanización no encontrada con id: " + id));

        Municipio municipio = municipioRepository.findById(dto.getMunicipioId())
                .orElseThrow(() -> new ResourceNotFoundException("Municipio no encontrado con id: " + dto.getMunicipioId()));

        boolean existeOtraConMismoNombre = urbanizacionRepository.findByNombreAndMunicipio(dto.getNombre(), municipio)
                .map(u -> !u.getId().equals(id))
                .orElse(false);

        if (existeOtraConMismoNombre) {
            throw new BadRequestException("Ya existe una urbanización con ese nombre en el municipio seleccionado");
        }

        UrbanizacionMapper.updateEntity(urbanizacion, dto, municipio);

        Urbanizacion actualizada = urbanizacionRepository.save(urbanizacion);
        return UrbanizacionMapper.toDto(actualizada);
    }

    @Override
    public void delete(Long id) {
        if (!urbanizacionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Urbanización no encontrada con id: " + id);
        }

        urbanizacionRepository.deleteById(id);
    }
}