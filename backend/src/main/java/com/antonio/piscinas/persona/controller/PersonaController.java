package com.antonio.piscinas.persona.controller;

import com.antonio.piscinas.persona.dto.PersonaRequestDto;
import com.antonio.piscinas.persona.dto.PersonaResponseDto;
import com.antonio.piscinas.persona.service.PersonaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/personas")
@RequiredArgsConstructor
public class PersonaController {

    private final PersonaService personaService;

    @GetMapping
    public List<PersonaResponseDto> findAll() {
        return personaService.findAll();
    }

    @GetMapping("/{id}")
    public PersonaResponseDto findById(@PathVariable Long id) {
        return personaService.findById(id);
    }

    @GetMapping("/buscar")
    public List<PersonaResponseDto> buscarPorPiscinaYTexto(
            @RequestParam Long piscinaId,
            @RequestParam(required = false, defaultValue = "") String texto
    ) {
        return personaService.buscarPorPiscinaYTexto(piscinaId, texto);
    }

    @GetMapping("/vivienda/{viviendaId}")
    public List<PersonaResponseDto> findByViviendaId(@PathVariable Long viviendaId) {
        return personaService.findByViviendaId(viviendaId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PersonaResponseDto create(@Valid @RequestBody PersonaRequestDto dto) {
        return personaService.create(dto);
    }

    @PutMapping("/{id}")
    public PersonaResponseDto update(@PathVariable Long id,
                                     @Valid @RequestBody PersonaRequestDto dto) {
        return personaService.update(id, dto);
    }

    @PostMapping(value = "/{id}/foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public PersonaResponseDto subirFoto(@PathVariable Long id,
                                        @RequestParam("file") MultipartFile file) {
        return personaService.saveFoto(id, file);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        personaService.delete(id);
    }
}