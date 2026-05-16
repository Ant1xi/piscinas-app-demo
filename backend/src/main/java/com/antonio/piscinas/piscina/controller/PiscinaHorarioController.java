package com.antonio.piscinas.piscina.controller;

import com.antonio.piscinas.common.exception.ResourceNotFoundException;
import com.antonio.piscinas.piscina.dto.PiscinaHorarioDto;
import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.piscina.entity.PiscinaHorario;
import com.antonio.piscinas.piscina.repository.PiscinaHorarioRepository;
import com.antonio.piscinas.piscina.repository.PiscinaRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/piscinas/{piscinaId}/horarios")
@RequiredArgsConstructor
public class PiscinaHorarioController {

    private final PiscinaHorarioRepository horarioRepository;
    private final PiscinaRepository piscinaRepository;

    @GetMapping
    public List<PiscinaHorarioDto> listar(@PathVariable Long piscinaId) {
        return horarioRepository.findByPiscinaIdOrderByHoraAperturaAsc(piscinaId)
            .stream().map(this::toDto).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PiscinaHorarioDto crear(@PathVariable Long piscinaId,
                                   @Valid @RequestBody PiscinaHorarioDto dto) {
        Piscina piscina = piscinaRepository.findById(piscinaId)
            .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada: " + piscinaId));
        PiscinaHorario h = PiscinaHorario.builder()
            .piscina(piscina)
            .nombre(dto.getNombre())
            .diasSemana(dto.getDiasSemana())
            .horaApertura(LocalTime.parse(dto.getHoraApertura()))
            .horaCierre(LocalTime.parse(dto.getHoraCierre()))
            .activo(dto.getActivo() != null ? dto.getActivo() : true)
            .build();
        return toDto(horarioRepository.save(h));
    }

    @PutMapping("/{horarioId}")
    public PiscinaHorarioDto actualizar(@PathVariable Long piscinaId,
                                        @PathVariable Long horarioId,
                                        @Valid @RequestBody PiscinaHorarioDto dto) {
        PiscinaHorario h = horarioRepository.findById(horarioId)
            .orElseThrow(() -> new ResourceNotFoundException("Horario no encontrado: " + horarioId));
        if (!h.getPiscina().getId().equals(piscinaId)) {
            throw new ResourceNotFoundException("Horario no pertenece a esta piscina");
        }
        h.setNombre(dto.getNombre());
        h.setDiasSemana(dto.getDiasSemana());
        h.setHoraApertura(LocalTime.parse(dto.getHoraApertura()));
        h.setHoraCierre(LocalTime.parse(dto.getHoraCierre()));
        if (dto.getActivo() != null) h.setActivo(dto.getActivo());
        return toDto(horarioRepository.save(h));
    }

    @DeleteMapping("/{horarioId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long piscinaId, @PathVariable Long horarioId) {
        PiscinaHorario h = horarioRepository.findById(horarioId)
            .orElseThrow(() -> new ResourceNotFoundException("Horario no encontrado: " + horarioId));
        if (!h.getPiscina().getId().equals(piscinaId)) {
            throw new ResourceNotFoundException("Horario no pertenece a esta piscina");
        }
        horarioRepository.delete(h);
    }

    private PiscinaHorarioDto toDto(PiscinaHorario h) {
        return PiscinaHorarioDto.builder()
            .id(h.getId())
            .piscinaId(h.getPiscina().getId())
            .nombre(h.getNombre())
            .diasSemana(h.getDiasSemana())
            .horaApertura(h.getHoraApertura().toString())
            .horaCierre(h.getHoraCierre().toString())
            .activo(h.getActivo())
            .build();
    }
}
