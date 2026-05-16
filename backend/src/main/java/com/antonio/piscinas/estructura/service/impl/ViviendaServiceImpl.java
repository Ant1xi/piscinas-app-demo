package com.antonio.piscinas.estructura.service.impl;

import com.antonio.piscinas.common.exception.BadRequestException;
import com.antonio.piscinas.common.exception.ResourceNotFoundException;
import com.antonio.piscinas.estructura.dto.vivienda.ViviendaMapper;
import com.antonio.piscinas.estructura.dto.vivienda.ViviendaRequestDto;
import com.antonio.piscinas.estructura.dto.vivienda.ViviendaResponseDto;
import com.antonio.piscinas.estructura.entity.Bloque;
import com.antonio.piscinas.estructura.entity.Calle;
import com.antonio.piscinas.estructura.entity.Vivienda;
import com.antonio.piscinas.estructura.repository.BloqueRepository;
import com.antonio.piscinas.estructura.repository.CalleRepository;
import com.antonio.piscinas.estructura.repository.ViviendaRepository;
import com.antonio.piscinas.estructura.service.ViviendaService;
import com.antonio.piscinas.persona.repository.ViviendaPersonaRepository;
import com.antonio.piscinas.urbanizacion.entity.TipoUrbanizacion;
import com.antonio.piscinas.urbanizacion.entity.Urbanizacion;
import com.antonio.piscinas.urbanizacion.repository.UrbanizacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ViviendaServiceImpl implements ViviendaService {

    private final ViviendaRepository viviendaRepository;
    private final UrbanizacionRepository urbanizacionRepository;
    private final CalleRepository calleRepository;
    private final BloqueRepository bloqueRepository;
    private final ViviendaPersonaRepository viviendaPersonaRepository;

    @Override
    public List<ViviendaResponseDto> findAll() {
        return viviendaRepository.findAll()
                .stream()
                .map(ViviendaMapper::toDto)
                .toList();
    }

    @Override
    public ViviendaResponseDto findById(Long id) {
        Vivienda vivienda = viviendaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vivienda no encontrada con id: " + id));

        return ViviendaMapper.toDto(vivienda);
    }

    @Override
    public List<ViviendaResponseDto> findByUrbanizacionId(Long urbanizacionId) {
        Urbanizacion urbanizacion = urbanizacionRepository.findById(urbanizacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Urbanización no encontrada con id: " + urbanizacionId));

        return viviendaRepository.findByUrbanizacion(urbanizacion)
                .stream()
                .map(ViviendaMapper::toDto)
                .toList();
    }

    @Override
    public List<ViviendaResponseDto> findByCalleId(Long calleId) {
        Calle calle = calleRepository.findById(calleId)
                .orElseThrow(() -> new ResourceNotFoundException("Calle no encontrada con id: " + calleId));

        return viviendaRepository.findByCalle(calle)
                .stream()
                .map(v -> ViviendaMapper.toDto(v, (int) viviendaPersonaRepository.countByVivienda(v)))
                .toList();
    }

    @Override
    public List<ViviendaResponseDto> findByBloqueId(Long bloqueId) {
        Bloque bloque = bloqueRepository.findById(bloqueId)
                .orElseThrow(() -> new ResourceNotFoundException("Bloque no encontrado con id: " + bloqueId));

        return viviendaRepository.findByBloque(bloque)
                .stream()
                .map(v -> ViviendaMapper.toDto(v, (int) viviendaPersonaRepository.countByVivienda(v)))
                .toList();
    }

    @Override
    @Transactional
    public ViviendaResponseDto create(ViviendaRequestDto dto) {
        Urbanizacion urbanizacion = urbanizacionRepository.findById(dto.getUrbanizacionId())
                .orElseThrow(() -> new ResourceNotFoundException("Urbanización no encontrada con id: " + dto.getUrbanizacionId()));

        Calle calle = null;
        Bloque bloque = null;

        if (urbanizacion.getTipoUrbanizacion() == TipoUrbanizacion.CALLES) {
            if (dto.getCalleId() == null) {
                throw new BadRequestException("En una urbanización de tipo CALLES la calle es obligatoria");
            }
            if (dto.getBloqueId() != null) {
                throw new BadRequestException("En una urbanización de tipo CALLES no se debe informar bloque");
            }

            calle = calleRepository.findById(dto.getCalleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Calle no encontrada con id: " + dto.getCalleId()));

            if (!calle.getUrbanizacion().getId().equals(urbanizacion.getId())) {
                throw new BadRequestException("La calle no pertenece a la urbanización indicada");
            }

            if (viviendaRepository.findByCalleAndIdentificador(calle, dto.getIdentificador()).isPresent()) {
                throw new BadRequestException("Ya existe una vivienda con ese identificador en la calle indicada");
            }

        } else if (urbanizacion.getTipoUrbanizacion() == TipoUrbanizacion.BLOQUES) {
            if (dto.getBloqueId() == null) {
                throw new BadRequestException("En una urbanización de tipo BLOQUES el bloque es obligatorio");
            }
            if (dto.getCalleId() != null) {
                throw new BadRequestException("En una urbanización de tipo BLOQUES no se debe informar calle");
            }

            bloque = bloqueRepository.findById(dto.getBloqueId())
                    .orElseThrow(() -> new ResourceNotFoundException("Bloque no encontrado con id: " + dto.getBloqueId()));

            if (!bloque.getUrbanizacion().getId().equals(urbanizacion.getId())) {
                throw new BadRequestException("El bloque no pertenece a la urbanización indicada");
            }

            if (viviendaRepository.findByBloqueAndPlantaAndIdentificador(bloque, dto.getPlanta(), dto.getIdentificador()).isPresent()) {
                throw new BadRequestException("Ya existe una vivienda con esa planta e identificador en el bloque indicado");
            }
        }

        Vivienda vivienda = ViviendaMapper.toEntity(dto, urbanizacion, calle, bloque);
        Vivienda guardada = viviendaRepository.save(vivienda);

        return ViviendaMapper.toDto(guardada);
    }

    @Override
    @Transactional
    public ViviendaResponseDto update(Long id, ViviendaRequestDto dto) {
        Vivienda vivienda = viviendaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vivienda no encontrada con id: " + id));

        Urbanizacion urbanizacion = urbanizacionRepository.findById(dto.getUrbanizacionId())
                .orElseThrow(() -> new ResourceNotFoundException("Urbanización no encontrada con id: " + dto.getUrbanizacionId()));

        Calle calle = null;
        Bloque bloque = null;

        if (urbanizacion.getTipoUrbanizacion() == TipoUrbanizacion.CALLES) {
            if (dto.getCalleId() == null) {
                throw new BadRequestException("En una urbanización de tipo CALLES la calle es obligatoria");
            }
            if (dto.getBloqueId() != null) {
                throw new BadRequestException("En una urbanización de tipo CALLES no se debe informar bloque");
            }

            calle = calleRepository.findById(dto.getCalleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Calle no encontrada con id: " + dto.getCalleId()));

            if (!calle.getUrbanizacion().getId().equals(urbanizacion.getId())) {
                throw new BadRequestException("La calle no pertenece a la urbanización indicada");
            }

            boolean existeOtra = viviendaRepository.findByCalleAndIdentificador(calle, dto.getIdentificador())
                    .map(v -> !v.getId().equals(id))
                    .orElse(false);

            if (existeOtra) {
                throw new BadRequestException("Ya existe otra vivienda con ese identificador en la calle indicada");
            }

        } else if (urbanizacion.getTipoUrbanizacion() == TipoUrbanizacion.BLOQUES) {
            if (dto.getBloqueId() == null) {
                throw new BadRequestException("En una urbanización de tipo BLOQUES el bloque es obligatorio");
            }
            if (dto.getCalleId() != null) {
                throw new BadRequestException("En una urbanización de tipo BLOQUES no se debe informar calle");
            }

            bloque = bloqueRepository.findById(dto.getBloqueId())
                    .orElseThrow(() -> new ResourceNotFoundException("Bloque no encontrado con id: " + dto.getBloqueId()));

            if (!bloque.getUrbanizacion().getId().equals(urbanizacion.getId())) {
                throw new BadRequestException("El bloque no pertenece a la urbanización indicada");
            }

            boolean existeOtra = viviendaRepository.findByBloqueAndPlantaAndIdentificador(bloque, dto.getPlanta(), dto.getIdentificador())
                    .map(v -> !v.getId().equals(id))
                    .orElse(false);

            if (existeOtra) {
                throw new BadRequestException("Ya existe otra vivienda con esa planta e identificador en el bloque indicado");
            }
        }

        ViviendaMapper.updateEntity(vivienda, dto, urbanizacion, calle, bloque);
        viviendaRepository.save(vivienda);

        return ViviendaMapper.toDto(vivienda);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Vivienda vivienda = viviendaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vivienda no encontrada con id: " + id));

        if (viviendaPersonaRepository.existsByVivienda(vivienda)) {
            throw new BadRequestException("No se puede eliminar la vivienda porque tiene personas asociadas");
        }

        viviendaRepository.delete(vivienda);
    }
}