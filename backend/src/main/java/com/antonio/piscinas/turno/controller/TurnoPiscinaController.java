package com.antonio.piscinas.turno.controller;

import com.antonio.piscinas.turno.dto.TurnoPiscinaRequestDto;
import com.antonio.piscinas.turno.dto.TurnoPiscinaResponseDto;
import com.antonio.piscinas.turno.service.TurnoPiscinaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turnos")
@RequiredArgsConstructor
public class TurnoPiscinaController {

    private final TurnoPiscinaService turnoService;

    @GetMapping("/piscina/{piscinaId}")
    public List<TurnoPiscinaResponseDto> findByPiscina(
            @PathVariable Long piscinaId,
            @RequestParam String desde,
            @RequestParam String hasta) {
        return turnoService.findByPiscinaIdAndRango(piscinaId, desde, hasta);
    }

    @GetMapping("/socorrista/{socorristaId}")
    public List<TurnoPiscinaResponseDto> findBySocorrista(
            @PathVariable Long socorristaId,
            @RequestParam String desde,
            @RequestParam String hasta) {
        return turnoService.findBySocorristaIdAndRango(socorristaId, desde, hasta);
    }

    @GetMapping("/mis-turnos")
    public List<TurnoPiscinaResponseDto> findMisTurnos(
            @RequestParam String desde,
            @RequestParam String hasta) {
        return turnoService.findMisTurnos(desde, hasta);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TurnoPiscinaResponseDto crear(@Valid @RequestBody TurnoPiscinaRequestDto dto) {
        return turnoService.crear(dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        turnoService.eliminar(id);
    }
}
