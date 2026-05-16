package com.antonio.piscinas.turno.service.impl;

import com.antonio.piscinas.common.exception.BadRequestException;
import com.antonio.piscinas.common.exception.ResourceNotFoundException;
import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.piscina.repository.PiscinaRepository;
import com.antonio.piscinas.security.AuthenticatedUserService;
import com.antonio.piscinas.turno.dto.TurnoPiscinaMapper;
import com.antonio.piscinas.turno.dto.TurnoPiscinaRequestDto;
import com.antonio.piscinas.turno.dto.TurnoPiscinaResponseDto;
import com.antonio.piscinas.turno.entity.TurnoPiscina;
import com.antonio.piscinas.turno.repository.TurnoPiscinaRepository;
import com.antonio.piscinas.turno.service.TurnoPiscinaService;
import com.antonio.piscinas.usuario.entity.Usuario;
import com.antonio.piscinas.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TurnoPiscinaServiceImpl implements TurnoPiscinaService {

    private final TurnoPiscinaRepository turnoRepository;
    private final PiscinaRepository piscinaRepository;
    private final UsuarioRepository usuarioRepository;
    private final AuthenticatedUserService authenticatedUserService;

    @Override
    public List<TurnoPiscinaResponseDto> findByPiscinaIdAndRango(Long piscinaId, String desde, String hasta) {
        piscinaRepository.findById(piscinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + piscinaId));

        LocalDate fechaDesde = parseDate(desde);
        LocalDate fechaHasta = parseDate(hasta);

        return turnoRepository.findByPiscinaIdAndFechaRange(piscinaId, fechaDesde, fechaHasta)
                .stream()
                .map(TurnoPiscinaMapper::toDto)
                .toList();
    }

    @Override
    public List<TurnoPiscinaResponseDto> findBySocorristaIdAndRango(Long socorristaId, String desde, String hasta) {
        LocalDate fechaDesde = parseDate(desde);
        LocalDate fechaHasta = parseDate(hasta);

        return turnoRepository.findBySocorristaIdAndFechaRange(socorristaId, fechaDesde, fechaHasta)
                .stream()
                .map(TurnoPiscinaMapper::toDto)
                .toList();
    }

    @Override
    public List<TurnoPiscinaResponseDto> findMisTurnos(String desde, String hasta) {
        Long socorristaId = authenticatedUserService.getAuthenticatedUserId();
        return findBySocorristaIdAndRango(socorristaId, desde, hasta);
    }

    @Override
    @Transactional
    public TurnoPiscinaResponseDto crear(TurnoPiscinaRequestDto dto) {
        Piscina piscina = piscinaRepository.findById(dto.getPiscinaId())
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + dto.getPiscinaId()));

        Usuario socorrista = usuarioRepository.findById(dto.getSocorristaId())
                .orElseThrow(() -> new ResourceNotFoundException("Socorrista no encontrado con id: " + dto.getSocorristaId()));

        LocalDate fecha = parseDate(dto.getFecha());
        LocalTime horaInicio = parseTime(dto.getHoraInicio());
        LocalTime horaFin = parseTime(dto.getHoraFin());

        if (!horaFin.isAfter(horaInicio)) {
            throw new BadRequestException("La hora de fin debe ser posterior a la hora de inicio");
        }

        if (turnoRepository.existeSolape(dto.getSocorristaId(), fecha, horaInicio, horaFin, 0L)) {
            TurnoPiscina conflicto = turnoRepository.findPrimerSolape(dto.getSocorristaId(), fecha, horaInicio, horaFin, 0L)
                    .orElseThrow(() -> new BadRequestException("El socorrista ya tiene un turno que se solapa en esa franja horaria"));
            throw new BadRequestException(
                    "El socorrista " + socorrista.getNombre() + " " + socorrista.getApellidos()
                    + " ya tiene turno en " + conflicto.getPiscina().getNombre()
                    + " de " + conflicto.getHoraInicio() + "-" + conflicto.getHoraFin()
                    + " el " + conflicto.getFecha()
                    + ". Elimínalo primero o elige otro horario."
            );
        }

        TurnoPiscina turno = TurnoPiscina.builder()
                .piscina(piscina)
                .socorrista(socorrista)
                .fecha(fecha)
                .horaInicio(horaInicio)
                .horaFin(horaFin)
                .build();

        TurnoPiscina guardado = turnoRepository.save(turno);

        TurnoPiscina conRelaciones = turnoRepository.findById(guardado.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Turno no encontrado"));

        return TurnoPiscinaMapper.toDto(conRelaciones);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        TurnoPiscina turno = turnoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Turno no encontrado con id: " + id));

        turnoRepository.delete(turno);
    }

    private LocalDate parseDate(String fecha) {
        try {
            return LocalDate.parse(fecha);
        } catch (DateTimeParseException e) {
            throw new BadRequestException("Formato de fecha inválido: " + fecha + " (esperado: YYYY-MM-DD)");
        }
    }

    private LocalTime parseTime(String hora) {
        try {
            return LocalTime.parse(hora);
        } catch (DateTimeParseException e) {
            throw new BadRequestException("Formato de hora inválido: " + hora + " (esperado: HH:mm)");
        }
    }
}
