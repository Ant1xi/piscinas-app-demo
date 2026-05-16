package com.antonio.piscinas.estructura.service.impl;

import com.antonio.piscinas.common.exception.BadRequestException;
import com.antonio.piscinas.common.exception.ResourceNotFoundException;

import com.antonio.piscinas.estructura.dto.bloque.BloqueMapper;
import com.antonio.piscinas.estructura.dto.bloque.BloqueRequestDto;
import com.antonio.piscinas.estructura.dto.bloque.BloqueResponseDto;
import com.antonio.piscinas.estructura.entity.Bloque;
import com.antonio.piscinas.estructura.repository.BloqueRepository;
import com.antonio.piscinas.estructura.repository.ViviendaRepository;
import com.antonio.piscinas.estructura.service.BloqueService;
import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.piscina.repository.PiscinaRepository;
import com.antonio.piscinas.urbanizacion.entity.TipoUrbanizacion;
import com.antonio.piscinas.urbanizacion.entity.Urbanizacion;
import com.antonio.piscinas.urbanizacion.repository.UrbanizacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BloqueServiceImpl implements BloqueService {

    private final BloqueRepository bloqueRepository;
    private final UrbanizacionRepository urbanizacionRepository;
    private final PiscinaRepository piscinaRepository;
    private final ViviendaRepository viviendaRepository;

    @Override
    public List<BloqueResponseDto> findAll() {
        return bloqueRepository.findAll()
                .stream()
                .map(b -> BloqueMapper.toDto(b, viviendaRepository.countByBloque(b)))
                .toList();
    }

    @Override
    public BloqueResponseDto findById(Long id) {
        Bloque bloque = bloqueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bloque no encontrado con id: " + id));

        return BloqueMapper.toDto(bloque, viviendaRepository.countByBloque(bloque));
    }

    @Override
    public List<BloqueResponseDto> findByUrbanizacionId(Long urbanizacionId) {
        Urbanizacion urbanizacion = urbanizacionRepository.findById(urbanizacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Urbanización no encontrada con id: " + urbanizacionId));

        return bloqueRepository.findByUrbanizacionOrderByCodigoAsc(urbanizacion)
                .stream()
                .map(b -> BloqueMapper.toDto(b, viviendaRepository.countByBloque(b)))
                .toList();
    }

    @Override
    public List<BloqueResponseDto> findByPiscinaId(Long piscinaId) {
        Piscina piscina = piscinaRepository.findById(piscinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + piscinaId));

        Urbanizacion urbanizacion = piscina.getUrbanizacion();

        return bloqueRepository.findByUrbanizacionOrderByCodigoAsc(urbanizacion)
                .stream()
                .map(b -> BloqueMapper.toDto(b, viviendaRepository.countByBloque(b)))
                .toList();
    }

    @Override
    @Transactional
    public BloqueResponseDto create(BloqueRequestDto dto) {
        Urbanizacion urbanizacion = urbanizacionRepository.findById(dto.getUrbanizacionId())
                .orElseThrow(() -> new ResourceNotFoundException("Urbanización no encontrada con id: " + dto.getUrbanizacionId()));

        validarUrbanizacionDeBloques(urbanizacion);

        String codigo = dto.getCodigo().trim();

        if (bloqueRepository.existsByUrbanizacionAndCodigo(urbanizacion, codigo)) {
            throw new BadRequestException("Ya existe un bloque con ese código en esta urbanización");
        }

        Bloque bloque = Bloque.builder()
                .urbanizacion(urbanizacion)
                .codigo(codigo)
                .build();

        return BloqueMapper.toDto(bloqueRepository.save(bloque), 0L);
    }

    @Override
    @Transactional
    public BloqueResponseDto update(Long id, BloqueRequestDto dto) {
        Bloque bloque = bloqueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bloque no encontrado con id: " + id));

        Urbanizacion urbanizacion = urbanizacionRepository.findById(dto.getUrbanizacionId())
                .orElseThrow(() -> new ResourceNotFoundException("Urbanización no encontrada con id: " + dto.getUrbanizacionId()));

        validarUrbanizacionDeBloques(urbanizacion);

        String codigo = dto.getCodigo().trim();

        bloqueRepository.findByUrbanizacionAndCodigo(urbanizacion, codigo)
                .ifPresent(bloqueExistente -> {
                    if (!bloqueExistente.getId().equals(id)) {
                        throw new BadRequestException("Ya existe un bloque con ese código en esta urbanización");
                    }
                });

        bloque.setUrbanizacion(urbanizacion);
        bloque.setCodigo(codigo);

        Bloque guardado = bloqueRepository.save(bloque);
        return BloqueMapper.toDto(guardado, viviendaRepository.countByBloque(guardado));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Bloque bloque = bloqueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bloque no encontrado con id: " + id));

        if (viviendaRepository.existsByBloque(bloque)) {
            throw new BadRequestException("No se puede eliminar el bloque porque tiene viviendas asociadas");
        }

        bloqueRepository.delete(bloque);
    }

    private void validarUrbanizacionDeBloques(Urbanizacion urbanizacion) {
        if (urbanizacion.getTipoUrbanizacion() != TipoUrbanizacion.BLOQUES) {
            throw new BadRequestException("No se pueden crear bloques en una urbanización de tipo CALLES");
        }
    }
}