package com.antonio.piscinas.estructura.service.impl;

import com.antonio.piscinas.common.exception.BadRequestException;
import com.antonio.piscinas.common.exception.ResourceNotFoundException;
import com.antonio.piscinas.estructura.dto.calle.CalleMapper;
import com.antonio.piscinas.estructura.dto.calle.CalleRequestDto;
import com.antonio.piscinas.estructura.dto.calle.CalleResponseDto;
import com.antonio.piscinas.estructura.entity.Calle;
import com.antonio.piscinas.estructura.repository.CalleRepository;
import com.antonio.piscinas.estructura.repository.ViviendaRepository;
import com.antonio.piscinas.estructura.service.CalleService;
import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.piscina.repository.PiscinaRepository;
import com.antonio.piscinas.urbanizacion.entity.Urbanizacion;
import com.antonio.piscinas.urbanizacion.repository.UrbanizacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CalleServiceImpl implements CalleService {

    private final CalleRepository calleRepository;
    private final UrbanizacionRepository urbanizacionRepository;
    private final PiscinaRepository piscinaRepository;
    private final ViviendaRepository viviendaRepository;

    @Override
    public List<CalleResponseDto> findAll() {
        return calleRepository.findAll()
                .stream()
                .map(CalleMapper::toDto)
                .toList();
    }

    @Override
    public CalleResponseDto findById(Long id) {
        Calle calle = calleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Calle no encontrada con id: " + id));

        return CalleMapper.toDto(calle, viviendaRepository.countByCalle(calle));
    }

    @Override
    public List<CalleResponseDto> findByUrbanizacionId(Long urbanizacionId) {
        Urbanizacion urbanizacion = urbanizacionRepository.findById(urbanizacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Urbanización no encontrada con id: " + urbanizacionId));

        return calleRepository.findByUrbanizacion(urbanizacion)
                .stream()
                .map(c -> CalleMapper.toDto(c, viviendaRepository.countByCalle(c)))
                .toList();
    }

    @Override
    public List<CalleResponseDto> findByPiscinaId(Long piscinaId) {
        Piscina piscina = piscinaRepository.findByIdWithUrbanizacion(piscinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + piscinaId));

        Urbanizacion urbanizacion = piscina.getUrbanizacion();

        return calleRepository.findByUrbanizacion(urbanizacion)
                .stream()
                .map(c -> CalleMapper.toDto(c, viviendaRepository.countByCalle(c)))
                .toList();
    }

    @Override
    @Transactional
    public CalleResponseDto create(CalleRequestDto dto) {
        Urbanizacion urbanizacion = urbanizacionRepository.findById(dto.getUrbanizacionId())
                .orElseThrow(() -> new ResourceNotFoundException("Urbanización no encontrada con id: " + dto.getUrbanizacionId()));

        if (calleRepository.existsByNombreAndUrbanizacion(dto.getNombre(), urbanizacion)) {
            throw new BadRequestException("Ya existe una calle con ese nombre en la urbanización");
        }

        Calle calle = CalleMapper.toEntity(dto, urbanizacion);
        Calle guardada = calleRepository.save(calle);

        return CalleMapper.toDto(guardada, 0L);
    }

    @Override
    @Transactional
    public CalleResponseDto update(Long id, CalleRequestDto dto) {
        Calle calle = calleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Calle no encontrada con id: " + id));

        Urbanizacion urbanizacion = urbanizacionRepository.findById(dto.getUrbanizacionId())
                .orElseThrow(() -> new ResourceNotFoundException("Urbanización no encontrada con id: " + dto.getUrbanizacionId()));

        boolean existeOtra = calleRepository.findByNombreAndUrbanizacion(dto.getNombre(), urbanizacion)
                .map(c -> !c.getId().equals(id))
                .orElse(false);

        if (existeOtra) {
            throw new BadRequestException("Ya existe una calle con ese nombre en la urbanización");
        }

        CalleMapper.updateEntity(calle, dto, urbanizacion);
        calleRepository.save(calle);

        return CalleMapper.toDto(calle, viviendaRepository.countByCalle(calle));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Calle calle = calleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Calle no encontrada con id: " + id));

        if (viviendaRepository.existsByCalle(calle)) {
            throw new BadRequestException("No se puede eliminar la calle porque tiene viviendas asociadas");
        }

        calleRepository.delete(calle);
    }
}