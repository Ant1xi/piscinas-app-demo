package com.antonio.piscinas.acceso.service.impl;

import com.antonio.piscinas.acceso.dto.*;
import com.antonio.piscinas.acceso.entity.Acceso;
import com.antonio.piscinas.acceso.repository.AccesoRepository;
import com.antonio.piscinas.acceso.service.AccesoService;
import com.antonio.piscinas.audit.service.AuditLogService;
import com.antonio.piscinas.common.exception.BadRequestException;
import com.antonio.piscinas.common.exception.ResourceNotFoundException;
import com.antonio.piscinas.estructura.entity.Vivienda;
import com.antonio.piscinas.estructura.repository.ViviendaRepository;
import com.antonio.piscinas.persona.entity.Persona;
import com.antonio.piscinas.persona.repository.PersonaRepository;
import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.piscina.repository.PiscinaRepository;
import com.antonio.piscinas.security.AuthenticatedUserService;
import com.antonio.piscinas.usuario.entity.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccesoServiceImpl implements AccesoService {

    private final AccesoRepository accesoRepository;
    private final PiscinaRepository piscinaRepository;
    private final ViviendaRepository viviendaRepository;
    private final PersonaRepository personaRepository;
    private final AuthenticatedUserService authenticatedUserService;
    private final AuditLogService auditLogService;

    @Override
    public List<AccesoResponseDto> findAll() {
        return accesoRepository.findAllWithRelations()
                .stream()
                .map(AccesoMapper::toDto)
                .toList();
    }

    @Override
    public AccesoResponseDto findById(Long id) {
        Acceso acceso = accesoRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Acceso no encontrado con id: " + id));

        return AccesoMapper.toDto(acceso);
    }

    @Override
    public List<AccesoResponseDto> findByPiscinaId(Long piscinaId) {
        Piscina piscina = piscinaRepository.findById(piscinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + piscinaId));

        return accesoRepository.findByPiscinaWithRelations(piscina)
                .stream()
                .map(AccesoMapper::toDto)
                .toList();
    }

    @Override
    public List<AccesoResponseDto> findDentroByPiscinaId(Long piscinaId) {
        Piscina piscina = piscinaRepository.findById(piscinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + piscinaId));

        return accesoRepository.findAbiertosByPiscinaWithRelations(piscina)
                .stream()
                .map(AccesoMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public AccesoResponseDto registrarEntrada(AccesoEntradaRequestDto dto) {
        Piscina piscina = piscinaRepository.findById(dto.getPiscinaId())
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + dto.getPiscinaId()));

        Vivienda vivienda = viviendaRepository.findById(dto.getViviendaId())
                .orElseThrow(() -> new ResourceNotFoundException("Vivienda no encontrada con id: " + dto.getViviendaId()));

        Persona persona = personaRepository.findById(dto.getPersonaId())
                .orElseThrow(() -> new ResourceNotFoundException("Persona no encontrada con id: " + dto.getPersonaId()));

        if (accesoRepository.findByPersonaAndPiscinaAndHoraSalidaIsNull(persona, piscina).isPresent()) {
            throw new BadRequestException("La persona ya tiene un acceso abierto en esta piscina");
        }

        Usuario registradoPor = authenticatedUserService.getAuthenticatedUsuario();

        Acceso acceso = AccesoMapper.toEntity(
                piscina,
                vivienda,
                persona,
                registradoPor,
                dto.getComentario()
        );

        Acceso guardado = accesoRepository.save(acceso);

        Acceso guardadoConRelaciones = accesoRepository.findByIdWithRelations(guardado.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Acceso no encontrado con id: " + guardado.getId()));

        auditLogService.registrar(
                registradoPor.getId(),
                registradoPor.getEmail(),
                "ENTRADA",
                "Acceso",
                guardado.getId().toString(),
                "Entrada de " + persona.getNombre() + " " + persona.getApellidos() + " en " + piscina.getNombre()
        );

        return AccesoMapper.toDto(guardadoConRelaciones);
    }

    @Override
    @Transactional
    public AccesoResponseDto registrarSalida(AccesoSalidaRequestDto dto) {
        Acceso acceso = accesoRepository.findById(idOrThrow(dto))
                .orElseThrow(() -> new ResourceNotFoundException("Acceso no encontrado con id: " + dto.getAccesoId()));

        if (acceso.getHoraSalida() != null) {
            throw new BadRequestException("Este acceso ya tiene registrada la salida");
        }

        acceso.setHoraSalida(LocalDateTime.now());

        if (dto.getComentario() != null && !dto.getComentario().isBlank()) {
            String comentarioActual = acceso.getComentario() != null ? acceso.getComentario() : "";
            acceso.setComentario(comentarioActual.isBlank()
                    ? dto.getComentario()
                    : comentarioActual + " | Salida: " + dto.getComentario());
        }

        accesoRepository.save(acceso);

        Acceso actualizado = accesoRepository.findByIdWithRelations(acceso.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Acceso no encontrado con id: " + acceso.getId()));

        Usuario registradoPor = authenticatedUserService.getAuthenticatedUsuario();
        auditLogService.registrar(
                registradoPor.getId(),
                registradoPor.getEmail(),
                "SALIDA",
                "Acceso",
                actualizado.getId().toString(),
                "Salida de " + actualizado.getPersona().getNombre() + " " + actualizado.getPersona().getApellidos() + " de " + actualizado.getPiscina().getNombre()
        );

        return AccesoMapper.toDto(actualizado);
    }

    @Override
    public List<AccesoResponseDto> findByPiscinaIdAndFecha(Long piscinaId, LocalDate fecha) {
        Piscina piscina = piscinaRepository.findById(piscinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + piscinaId));

        LocalDateTime inicioDia = fecha.atStartOfDay();
        LocalDateTime finDia = fecha.plusDays(1).atStartOfDay();

        return accesoRepository.findByPiscinaAndFechaWithRelations(piscina, inicioDia, finDia)
                .stream()
                .map(AccesoMapper::toDto)
                .toList();
    }

    @Override
    public PersonasDentroCountResponseDto contarPersonasDentro(Long piscinaId) {
        piscinaRepository.findById(piscinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + piscinaId));

        long personasDentro = accesoRepository.countByPiscinaIdAndHoraSalidaIsNull(piscinaId);

        return new PersonasDentroCountResponseDto(piscinaId, personasDentro);
    }

    private Long idOrThrow(AccesoSalidaRequestDto dto) {
        if (dto.getAccesoId() == null) {
            throw new BadRequestException("El acceso es obligatorio");
        }
        return dto.getAccesoId();
    }

    @Override
    public AccesosHoyCountResponseDto contarEntradasHoy(Long piscinaId) {
        piscinaRepository.findById(piscinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + piscinaId));

        LocalDateTime inicioDia = LocalDate.now().atStartOfDay();
        LocalDateTime finDia = LocalDate.now().plusDays(1).atStartOfDay();

        long totalEntradasHoy = accesoRepository.countByPiscinaIdAndHoraEntradaBetween(
                piscinaId,
                inicioDia,
                finDia
        );

        return new AccesosHoyCountResponseDto(piscinaId, totalEntradasHoy);
    }

    @Override
    public ResumenDiaPiscinaResponseDto obtenerResumenDia(Long piscinaId, LocalDate fecha) {
        piscinaRepository.findById(piscinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + piscinaId));

        LocalDateTime inicioDia = fecha.atStartOfDay();
        LocalDateTime finDia = fecha.plusDays(1).atStartOfDay();

        long totalEntradas = accesoRepository.countByPiscinaIdAndHoraEntradaBetween(
                piscinaId,
                inicioDia,
                finDia
        );

        long totalSalidas = accesoRepository.countByPiscinaIdAndHoraSalidaBetween(
                piscinaId,
                inicioDia,
                finDia
        );

        long personasDentroAhora = accesoRepository.countByPiscinaIdAndHoraSalidaIsNull(piscinaId);

        return new ResumenDiaPiscinaResponseDto(
                piscinaId,
                fecha,
                totalEntradas,
                totalSalidas,
                personasDentroAhora
        );
    }

    @Override
    public List<AccesoResponseDto> findUltimosByPiscinaId(Long piscinaId, int limit) {
        piscinaRepository.findById(piscinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + piscinaId));

        int limiteSeguro = Math.min(Math.max(limit, 1), 50);

        return accesoRepository.findUltimosByPiscinaIdWithRelations(
                        piscinaId,
                        PageRequest.of(0, limiteSeguro)
                )
                .stream()
                .map(AccesoMapper::toDto)
                .toList();
    }
}