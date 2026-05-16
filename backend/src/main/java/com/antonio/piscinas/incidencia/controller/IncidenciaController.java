package com.antonio.piscinas.incidencia.controller;

import com.antonio.piscinas.incidencia.dto.*;
import com.antonio.piscinas.incidencia.service.IncidenciaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidencias")
@RequiredArgsConstructor
public class IncidenciaController {

    private final IncidenciaService incidenciaService;

    @GetMapping
    public List<IncidenciaResponseDto> findAll() {
        return incidenciaService.findAll();
    }

    @GetMapping("/{id}")
    public IncidenciaResponseDto findById(@PathVariable Long id) {
        return incidenciaService.findById(id);
    }

    @GetMapping("/piscina/{piscinaId}")
    public List<IncidenciaResponseDto> findByPiscina(@PathVariable Long piscinaId) {
        return incidenciaService.findByPiscinaId(piscinaId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IncidenciaResponseDto create(@Valid @RequestBody IncidenciaRequestDto dto) {
        return incidenciaService.create(dto);
    }

    @PutMapping("/{id}")
    public IncidenciaResponseDto update(@PathVariable Long id,
                                        @Valid @RequestBody IncidenciaUpdateDto dto) {
        return incidenciaService.update(id, dto);
    }

    @PatchMapping("/{id}/revision")
    public IncidenciaResponseDto ponerEnRevision(@PathVariable Long id) {
        return incidenciaService.ponerEnRevision(id);
    }

    @PatchMapping("/{id}/cerrar")
    public IncidenciaResponseDto cerrar(@PathVariable Long id,
                                        @Valid @RequestBody CerrarIncidenciaDto dto) {
        return incidenciaService.cerrar(id, dto);
    }
}