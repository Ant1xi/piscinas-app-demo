package com.antonio.piscinas.piscina.service.impl;

import com.antonio.piscinas.common.exception.BadRequestException;
import com.antonio.piscinas.common.exception.ResourceNotFoundException;
import com.antonio.piscinas.piscina.dto.EstadoPiscinaDiaMapper;
import com.antonio.piscinas.piscina.dto.EstadoPiscinaDiaRequestDto;
import com.antonio.piscinas.piscina.dto.EstadoPiscinaDiaResponseDto;
import com.antonio.piscinas.piscina.entity.EstadoPiscinaDia;
import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.piscina.repository.EstadoPiscinaDiaRepository;
import com.antonio.piscinas.piscina.repository.PiscinaRepository;
import com.antonio.piscinas.piscina.service.EstadoPiscinaDiaService;
import com.antonio.piscinas.security.AuthenticatedUserService;
import com.antonio.piscinas.usuario.entity.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EstadoPiscinaDiaServiceImpl implements EstadoPiscinaDiaService {

    private final EstadoPiscinaDiaRepository estadoPiscinaDiaRepository;
    private final PiscinaRepository piscinaRepository;
    private final AuthenticatedUserService authenticatedUserService;

    @Override
    public List<EstadoPiscinaDiaResponseDto> findAll() {
        return estadoPiscinaDiaRepository.findAllWithRelations()
                .stream()
                .map(EstadoPiscinaDiaMapper::toDto)
                .toList();
    }

    @Override
    public EstadoPiscinaDiaResponseDto findById(Long id) {
        EstadoPiscinaDia estado = estadoPiscinaDiaRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estado de piscina no encontrado con id: " + id));

        return EstadoPiscinaDiaMapper.toDto(estado);
    }

    @Override
    public List<EstadoPiscinaDiaResponseDto> findByPiscinaId(Long piscinaId) {
        Piscina piscina = piscinaRepository.findById(piscinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + piscinaId));

        return estadoPiscinaDiaRepository.findByPiscinaWithRelations(piscina)
                .stream()
                .map(EstadoPiscinaDiaMapper::toDto)
                .toList();
    }

    @Override
    public EstadoPiscinaDiaResponseDto create(EstadoPiscinaDiaRequestDto dto) {
        Piscina piscina = piscinaRepository.findById(dto.getPiscinaId())
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + dto.getPiscinaId()));

        Usuario usuario = authenticatedUserService.getAuthenticatedUsuario();

        LocalDate fecha = (dto.getFecha() == null || dto.getFecha().isBlank())
                ? LocalDate.now()
                : LocalDate.parse(dto.getFecha());

        if (estadoPiscinaDiaRepository.existsByPiscinaAndFecha(piscina, fecha)) {
            throw new BadRequestException("Ya existe un estado diario para esa piscina en la fecha indicada");
        }

        EstadoPiscinaDia estado = EstadoPiscinaDiaMapper.toEntity(dto, piscina, usuario);
        EstadoPiscinaDia guardado = estadoPiscinaDiaRepository.save(estado);

        EstadoPiscinaDia guardadoConRelaciones = estadoPiscinaDiaRepository.findByIdWithRelations(guardado.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Estado de piscina no encontrado con id: " + guardado.getId()));

        return EstadoPiscinaDiaMapper.toDto(guardadoConRelaciones);
    }

    @Override
    public EstadoPiscinaDiaResponseDto update(Long id, EstadoPiscinaDiaRequestDto dto) {
        EstadoPiscinaDia estado = estadoPiscinaDiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estado de piscina no encontrado con id: " + id));

        Piscina piscina = piscinaRepository.findById(dto.getPiscinaId())
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + dto.getPiscinaId()));

        Usuario usuario = authenticatedUserService.getAuthenticatedUsuario();

        LocalDate fecha = (dto.getFecha() == null || dto.getFecha().isBlank())
                ? LocalDate.now()
                : LocalDate.parse(dto.getFecha());

        boolean existeOtroMismoDia = estadoPiscinaDiaRepository.findByPiscinaAndFecha(piscina, fecha)
                .map(e -> !e.getId().equals(id))
                .orElse(false);

        if (existeOtroMismoDia) {
            throw new BadRequestException("Ya existe otro estado diario para esa piscina en la fecha indicada");
        }

        EstadoPiscinaDiaMapper.updateEntity(estado, dto, piscina, usuario);

        estadoPiscinaDiaRepository.save(estado);

        EstadoPiscinaDia actualizado = estadoPiscinaDiaRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estado de piscina no encontrado con id: " + id));

        return EstadoPiscinaDiaMapper.toDto(actualizado);
    }

    @Override
    public void delete(Long id) {
        if (!estadoPiscinaDiaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Estado de piscina no encontrado con id: " + id);
        }

        estadoPiscinaDiaRepository.deleteById(id);
    }
}