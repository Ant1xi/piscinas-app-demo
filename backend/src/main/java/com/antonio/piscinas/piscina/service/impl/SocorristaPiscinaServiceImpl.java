package com.antonio.piscinas.piscina.service.impl;

import com.antonio.piscinas.common.exception.BadRequestException;
import com.antonio.piscinas.common.exception.ResourceNotFoundException;
import com.antonio.piscinas.piscina.dto.PiscinaMapper;
import com.antonio.piscinas.piscina.dto.PiscinaResponseDto;
import com.antonio.piscinas.piscina.dto.SocorristaPiscinaMapper;
import com.antonio.piscinas.piscina.dto.SocorristaPiscinaRequestDto;
import com.antonio.piscinas.piscina.dto.SocorristaPiscinaResponseDto;
import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.piscina.entity.SocorristaPiscina;
import com.antonio.piscinas.piscina.repository.PiscinaRepository;
import com.antonio.piscinas.piscina.repository.SocorristaPiscinaRepository;
import com.antonio.piscinas.piscina.service.SocorristaPiscinaService;
import com.antonio.piscinas.security.AuthenticatedUserService;
import com.antonio.piscinas.turno.entity.EstadoTurno;
import com.antonio.piscinas.turno.repository.TurnoPiscinaRepository;
import com.antonio.piscinas.usuario.entity.Usuario;
import com.antonio.piscinas.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SocorristaPiscinaServiceImpl implements SocorristaPiscinaService {

    private final SocorristaPiscinaRepository socorristaPiscinaRepository;
    private final PiscinaRepository piscinaRepository;
    private final UsuarioRepository usuarioRepository;
    private final AuthenticatedUserService authenticatedUserService;
    private final TurnoPiscinaRepository turnoPiscinaRepository;

    @Override
    public List<PiscinaResponseDto> getMisPiscinas() {
        Long socorristaId = authenticatedUserService.getAuthenticatedUserId();

        return socorristaPiscinaRepository.findActivosBySocorristaIdWithRelations(socorristaId)
                .stream()
                .map(sp -> PiscinaMapper.toDto(sp.getPiscina()))
                .toList();
    }

    @Override
    public List<SocorristaPiscinaResponseDto> findSocorristasByPiscinaId(Long piscinaId) {
        piscinaRepository.findById(piscinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + piscinaId));

        return socorristaPiscinaRepository.findActivosByPiscinaIdWithRelations(piscinaId)
                .stream()
                .map(SocorristaPiscinaMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public SocorristaPiscinaResponseDto asignar(SocorristaPiscinaRequestDto dto) {
        Piscina piscina = piscinaRepository.findById(dto.getPiscinaId())
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + dto.getPiscinaId()));

        Usuario socorrista = usuarioRepository.findById(dto.getSocorristaId())
                .orElseThrow(() -> new ResourceNotFoundException("Socorrista no encontrado con id: " + dto.getSocorristaId()));

        Usuario asignadoPor = authenticatedUserService.getAuthenticatedUsuario();

        Optional<SocorristaPiscina> existente = socorristaPiscinaRepository
                .findByPiscinaIdAndSocorristaId(dto.getPiscinaId(), dto.getSocorristaId());

        if (existente.isPresent()) {
            SocorristaPiscina asignacion = existente.get();
            if (asignacion.getActivo()) {
                throw new BadRequestException("El socorrista ya está activo en esta piscina");
            }
            // Reactivar registro existente en vez de insertar (evita violación de unique constraint)
            asignacion.setActivo(true);
            asignacion.setSocorrista(socorrista);
            asignacion.setPiscina(piscina);
            asignacion.setAsignadoPor(asignadoPor);
            asignacion.setFechaAsignacion(LocalDate.now());
            socorristaPiscinaRepository.save(asignacion);
            return SocorristaPiscinaMapper.toDto(asignacion);
        }

        SocorristaPiscina asignacion = SocorristaPiscina.builder()
                .socorrista(socorrista)
                .piscina(piscina)
                .asignadoPor(asignadoPor)
                .activo(true)
                .build();

        SocorristaPiscina guardada = socorristaPiscinaRepository.save(asignacion);

        return SocorristaPiscinaMapper.toDto(guardada);
    }

    @Override
    @Transactional
    public void desactivar(Long asignacionId) {
        SocorristaPiscina asignacion = socorristaPiscinaRepository.findById(asignacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Asignación no encontrada con id: " + asignacionId));

        Long socorristaId = asignacion.getSocorrista().getId();
        Long piscinaId = asignacion.getPiscina().getId();
        String nombre = asignacion.getSocorrista().getNombre();

        if (turnoPiscinaRepository.tieneTurnosFuturos(socorristaId, piscinaId, LocalDate.now(), EstadoTurno.PROGRAMADO)) {
            throw new BadRequestException(
                    "No puedes quitar a " + nombre + " de esta piscina porque tiene turnos programados. Elimina sus turnos primero."
            );
        }

        asignacion.setActivo(false);
        socorristaPiscinaRepository.save(asignacion);
    }
}
