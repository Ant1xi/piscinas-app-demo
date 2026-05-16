package com.antonio.piscinas.persona.controller;

import com.antonio.piscinas.persona.dto.AsignarViviendaPersonaResponseDto;
import com.antonio.piscinas.persona.dto.ViviendaPersonaRequestDto;
import com.antonio.piscinas.persona.dto.ViviendaPersonaResponseDto;
import com.antonio.piscinas.persona.service.ViviendaPersonaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vivienda-personas")
@RequiredArgsConstructor
public class ViviendaPersonaController {

    private final ViviendaPersonaService viviendaPersonaService;

    @GetMapping
    public List<ViviendaPersonaResponseDto> findAll() {
        return viviendaPersonaService.findAll();
    }

    @GetMapping("/{id}")
    public ViviendaPersonaResponseDto findById(@PathVariable Long id) {
        return viviendaPersonaService.findById(id);
    }

    @GetMapping("/vivienda/{viviendaId}")
    public List<ViviendaPersonaResponseDto> findByVivienda(@PathVariable Long viviendaId) {
        return viviendaPersonaService.findByViviendaId(viviendaId);
    }

    @GetMapping("/persona/{personaId}")
    public List<ViviendaPersonaResponseDto> findByPersona(@PathVariable Long personaId) {
        return viviendaPersonaService.findByPersonaId(personaId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ViviendaPersonaResponseDto create(@Valid @RequestBody ViviendaPersonaRequestDto dto) {
        return viviendaPersonaService.create(dto);
    }

    @PostMapping("/asignar")
    @ResponseStatus(HttpStatus.CREATED)
    public AsignarViviendaPersonaResponseDto asignar(@Valid @RequestBody ViviendaPersonaRequestDto dto) {
        return viviendaPersonaService.asignar(dto);
    }

    @PutMapping("/{id}")
    public ViviendaPersonaResponseDto update(@PathVariable Long id,
                                             @Valid @RequestBody ViviendaPersonaRequestDto dto) {
        return viviendaPersonaService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        viviendaPersonaService.delete(id);
    }
}