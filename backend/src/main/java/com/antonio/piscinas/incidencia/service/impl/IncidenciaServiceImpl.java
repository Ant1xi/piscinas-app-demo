package com.antonio.piscinas.incidencia.service.impl;

import com.antonio.piscinas.acceso.entity.Acceso;
import com.antonio.piscinas.acceso.repository.AccesoRepository;
import com.antonio.piscinas.common.exception.BadRequestException;
import com.antonio.piscinas.common.exception.ResourceNotFoundException;
import com.antonio.piscinas.estructura.entity.Vivienda;
import com.antonio.piscinas.estructura.repository.ViviendaRepository;
import com.antonio.piscinas.incidencia.dto.*;
import com.antonio.piscinas.incidencia.entity.EstadoIncidencia;
import com.antonio.piscinas.incidencia.entity.Incidencia;
import com.antonio.piscinas.incidencia.repository.IncidenciaRepository;
import com.antonio.piscinas.incidencia.service.IncidenciaService;
import com.antonio.piscinas.persona.entity.Persona;
import com.antonio.piscinas.persona.repository.PersonaRepository;
import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.piscina.repository.PiscinaRepository;
import com.antonio.piscinas.security.AuthenticatedUserService;
import com.antonio.piscinas.usuario.entity.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidenciaServiceImpl implements IncidenciaService {

    private final IncidenciaRepository incidenciaRepository;
    private final PiscinaRepository piscinaRepository;
    private final ViviendaRepository viviendaRepository;
    private final PersonaRepository personaRepository;
    private final AccesoRepository accesoRepository;
    private final AuthenticatedUserService authenticatedUserService;

    @Override
    public List<IncidenciaResponseDto> findAll() {
        return incidenciaRepository.findAllWithRelations()
                .stream()
                .map(IncidenciaMapper::toDto)
                .toList();
    }

    @Override
    public IncidenciaResponseDto findById(Long id) {
        Incidencia incidencia = incidenciaRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia no encontrada con id: " + id));

        return IncidenciaMapper.toDto(incidencia);
    }

    @Override
    public List<IncidenciaResponseDto> findByPiscinaId(Long piscinaId) {
        Piscina piscina = piscinaRepository.findById(piscinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + piscinaId));

        return incidenciaRepository.findByPiscinaWithRelations(piscina)
                .stream()
                .map(IncidenciaMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public IncidenciaResponseDto create(IncidenciaRequestDto dto) {
        Piscina piscina = piscinaRepository.findById(dto.getPiscinaId())
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + dto.getPiscinaId()));

        Vivienda vivienda = dto.getViviendaId() != null
                ? viviendaRepository.findById(dto.getViviendaId())
                .orElseThrow(() -> new ResourceNotFoundException("Vivienda no encontrada con id: " + dto.getViviendaId()))
                : null;

        Persona persona = dto.getPersonaId() != null
                ? personaRepository.findById(dto.getPersonaId())
                .orElseThrow(() -> new ResourceNotFoundException("Persona no encontrada con id: " + dto.getPersonaId()))
                : null;

        Acceso acceso = dto.getAccesoId() != null
                ? accesoRepository.findById(dto.getAccesoId())
                .orElseThrow(() -> new ResourceNotFoundException("Acceso no encontrado con id: " + dto.getAccesoId()))
                : null;

        Usuario creadaPor = authenticatedUserService.getAuthenticatedUsuario();

        Incidencia incidencia = IncidenciaMapper.toEntity(
                dto, piscina, vivienda, persona, acceso, creadaPor
        );

        Incidencia guardada = incidenciaRepository.save(incidencia);

        Incidencia guardadaConRelaciones = incidenciaRepository.findByIdWithRelations(guardada.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia no encontrada con id: " + guardada.getId()));

        return IncidenciaMapper.toDto(guardadaConRelaciones);
    }

    @Override
    @Transactional
    public IncidenciaResponseDto update(Long id, IncidenciaUpdateDto dto) {
        Incidencia incidencia = incidenciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia no encontrada con id: " + id));

        if (incidencia.getEstado() == EstadoIncidencia.CERRADA) {
            throw new BadRequestException("No se puede modificar una incidencia cerrada");
        }

        Piscina piscina = piscinaRepository.findById(dto.getPiscinaId())
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + dto.getPiscinaId()));

        Vivienda vivienda = dto.getViviendaId() != null
                ? viviendaRepository.findById(dto.getViviendaId())
                .orElseThrow(() -> new ResourceNotFoundException("Vivienda no encontrada con id: " + dto.getViviendaId()))
                : null;

        Persona persona = dto.getPersonaId() != null
                ? personaRepository.findById(dto.getPersonaId())
                .orElseThrow(() -> new ResourceNotFoundException("Persona no encontrada con id: " + dto.getPersonaId()))
                : null;

        Acceso acceso = dto.getAccesoId() != null
                ? accesoRepository.findById(dto.getAccesoId())
                .orElseThrow(() -> new ResourceNotFoundException("Acceso no encontrado con id: " + dto.getAccesoId()))
                : null;

        IncidenciaMapper.updateEntity(incidencia, dto, piscina, vivienda, persona, acceso);

        incidenciaRepository.save(incidencia);

        Incidencia actualizada = incidenciaRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia no encontrada con id: " + id));

        return IncidenciaMapper.toDto(actualizada);
    }

    @Override
    @Transactional
    public IncidenciaResponseDto ponerEnRevision(Long id) {
        Incidencia incidencia = incidenciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia no encontrada con id: " + id));

        if (incidencia.getEstado() != EstadoIncidencia.ABIERTA) {
            throw new BadRequestException("Solo se pueden poner en revisión incidencias abiertas");
        }

        incidencia.setEstado(EstadoIncidencia.EN_REVISION);
        incidenciaRepository.save(incidencia);

        Incidencia actualizada = incidenciaRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia no encontrada con id: " + id));

        return IncidenciaMapper.toDto(actualizada);
    }

    @Override
    @Transactional
    public IncidenciaResponseDto cerrar(Long id, CerrarIncidenciaDto dto) {
        Incidencia incidencia = incidenciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia no encontrada con id: " + id));

        if (incidencia.getEstado() == EstadoIncidencia.CERRADA) {
            throw new BadRequestException("La incidencia ya está cerrada");
        }

        Usuario usuario = authenticatedUserService.getAuthenticatedUsuario();

        IncidenciaMapper.cerrarIncidencia(incidencia, usuario, dto.getNotaCierre());

        incidenciaRepository.save(incidencia);

        Incidencia cerrada = incidenciaRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia no encontrada con id: " + id));

        return IncidenciaMapper.toDto(cerrada);
    }
}