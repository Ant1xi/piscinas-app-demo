package com.antonio.piscinas.persona.service.impl;

import com.antonio.piscinas.common.exception.BadRequestException;
import com.antonio.piscinas.common.exception.ResourceNotFoundException;
import com.antonio.piscinas.estructura.entity.Vivienda;
import com.antonio.piscinas.estructura.repository.ViviendaRepository;
import com.antonio.piscinas.persona.dto.AsignarViviendaPersonaResponseDto;
import com.antonio.piscinas.persona.dto.ViviendaPersonaMapper;
import com.antonio.piscinas.persona.dto.ViviendaPersonaRequestDto;
import com.antonio.piscinas.persona.dto.ViviendaPersonaResponseDto;
import com.antonio.piscinas.persona.entity.Persona;
import com.antonio.piscinas.persona.entity.RolVivienda;
import com.antonio.piscinas.persona.entity.ViviendaPersona;
import com.antonio.piscinas.persona.repository.PersonaRepository;
import com.antonio.piscinas.persona.repository.ViviendaPersonaRepository;
import com.antonio.piscinas.persona.service.ViviendaPersonaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ViviendaPersonaServiceImpl implements ViviendaPersonaService {

    private final ViviendaPersonaRepository viviendaPersonaRepository;
    private final PersonaRepository personaRepository;
    private final ViviendaRepository viviendaRepository;

    @Override
    public List<ViviendaPersonaResponseDto> findAll() {
        return viviendaPersonaRepository.findAllWithRelations()
                .stream()
                .map(ViviendaPersonaMapper::toDto)
                .toList();
    }

    @Override
    public ViviendaPersonaResponseDto findById(Long id) {
        ViviendaPersona vp = viviendaPersonaRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relación vivienda-persona no encontrada con id: " + id));

        return ViviendaPersonaMapper.toDto(vp);
    }

    @Override
    public List<ViviendaPersonaResponseDto> findByViviendaId(Long viviendaId) {
        Vivienda vivienda = viviendaRepository.findById(viviendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Vivienda no encontrada con id: " + viviendaId));

        return viviendaPersonaRepository.findByViviendaWithRelations(vivienda)
                .stream()
                .map(ViviendaPersonaMapper::toDto)
                .toList();
    }

    @Override
    public List<ViviendaPersonaResponseDto> findByPersonaId(Long personaId) {
        Persona persona = personaRepository.findById(personaId)
                .orElseThrow(() -> new ResourceNotFoundException("Persona no encontrada con id: " + personaId));

        return viviendaPersonaRepository.findByPersonaWithRelations(persona)
                .stream()
                .map(ViviendaPersonaMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public ViviendaPersonaResponseDto create(ViviendaPersonaRequestDto dto) {
        Persona persona = personaRepository.findById(dto.getPersonaId())
                .orElseThrow(() -> new ResourceNotFoundException("Persona no encontrada con id: " + dto.getPersonaId()));

        Vivienda vivienda = viviendaRepository.findById(dto.getViviendaId())
                .orElseThrow(() -> new ResourceNotFoundException("Vivienda no encontrada con id: " + dto.getViviendaId()));

        if (viviendaPersonaRepository.findByPersonaAndViviendaAndRolEnVivienda(
                persona,
                vivienda,
                dto.getRolEnVivienda()
        ).isPresent()) {
            throw new BadRequestException("La persona ya está asociada a esa vivienda con ese rol");
        }

        ViviendaPersona vp = ViviendaPersonaMapper.toEntity(dto, persona, vivienda);
        ViviendaPersona guardada = viviendaPersonaRepository.save(vp);

        ViviendaPersona guardadaConRelaciones = viviendaPersonaRepository.findByIdWithRelations(guardada.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Relación vivienda-persona no encontrada con id: " + guardada.getId()));

        return ViviendaPersonaMapper.toDto(guardadaConRelaciones);
    }

    @Override
    @Transactional
    public AsignarViviendaPersonaResponseDto asignar(ViviendaPersonaRequestDto dto) {
        Persona persona = personaRepository.findById(dto.getPersonaId())
                .orElseThrow(() -> new ResourceNotFoundException("Persona no encontrada con id: " + dto.getPersonaId()));

        Vivienda vivienda = viviendaRepository.findById(dto.getViviendaId())
                .orElseThrow(() -> new ResourceNotFoundException("Vivienda no encontrada con id: " + dto.getViviendaId()));

        if (viviendaPersonaRepository.findByPersonaAndViviendaAndRolEnVivienda(persona, vivienda, dto.getRolEnVivienda()).isPresent()) {
            throw new BadRequestException("La persona ya está asignada a esa vivienda con ese rol");
        }

        if (dto.getRolEnVivienda() == RolVivienda.PROPIETARIO) {
            viviendaPersonaRepository.findPropietarioEnUrbanizacion(
                    persona, RolVivienda.PROPIETARIO,
                    vivienda.getUrbanizacion().getId(), vivienda.getId()
            ).ifPresent(existente -> {
                String info = buildViviendaInfo(existente.getVivienda());
                throw new BadRequestException(
                        "Esta persona ya es PROPIETARIO en " + info + ". Solo puede ser PROPIETARIO en una vivienda."
                );
            });
        }

        ViviendaPersona vp = ViviendaPersonaMapper.toEntity(dto, persona, vivienda);
        ViviendaPersona guardada = viviendaPersonaRepository.save(vp);
        ViviendaPersona conRelaciones = viviendaPersonaRepository.findByIdWithRelations(guardada.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Error al recuperar la asignación creada"));

        String warning = null;
        if (dto.getRolEnVivienda() == RolVivienda.HABITANTE) {
            List<ViviendaPersona> otras = viviendaPersonaRepository.findOtrasViviendas(persona, vivienda.getId());
            if (!otras.isEmpty()) {
                String info = buildViviendaInfo(otras.get(0).getVivienda());
                String rol = otras.get(0).getRolEnVivienda().name();
                warning = "Esta persona ya está registrada en " + info + " como " + rol + ".";
            }
        }

        return AsignarViviendaPersonaResponseDto.builder()
                .data(ViviendaPersonaMapper.toDto(conRelaciones))
                .warning(warning)
                .build();
    }

    private String buildViviendaInfo(Vivienda v) {
        if (v.getCalle() != null) {
            return v.getCalle().getNombre() + " " + v.getIdentificador();
        }
        if (v.getBloque() != null) {
            String base = "Bloque " + v.getBloque().getCodigo() + " · ";
            return v.getPlanta() != null
                    ? base + v.getPlanta() + "º" + v.getIdentificador()
                    : base + v.getIdentificador();
        }
        return v.getIdentificador();
    }

    @Override
    @Transactional
    public ViviendaPersonaResponseDto update(Long id, ViviendaPersonaRequestDto dto) {
        ViviendaPersona vp = viviendaPersonaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relación vivienda-persona no encontrada con id: " + id));

        Persona persona = personaRepository.findById(dto.getPersonaId())
                .orElseThrow(() -> new ResourceNotFoundException("Persona no encontrada con id: " + dto.getPersonaId()));

        Vivienda vivienda = viviendaRepository.findById(dto.getViviendaId())
                .orElseThrow(() -> new ResourceNotFoundException("Vivienda no encontrada con id: " + dto.getViviendaId()));

        boolean existeOtra = viviendaPersonaRepository.findByPersonaAndViviendaAndRolEnVivienda(
                persona,
                vivienda,
                dto.getRolEnVivienda()
        ).map(rel -> !rel.getId().equals(id)).orElse(false);

        if (existeOtra) {
            throw new BadRequestException("Ya existe otra relación igual para esa persona, vivienda y rol");
        }

        ViviendaPersonaMapper.updateEntity(vp, dto, persona, vivienda);
        viviendaPersonaRepository.save(vp);

        ViviendaPersona actualizada = viviendaPersonaRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relación vivienda-persona no encontrada con id: " + id));

        return ViviendaPersonaMapper.toDto(actualizada);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ViviendaPersona vp = viviendaPersonaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relación vivienda-persona no encontrada con id: " + id));

        viviendaPersonaRepository.delete(vp);
    }
}