package com.antonio.piscinas.estructura.controller;

import com.antonio.piscinas.estructura.dto.vivienda.ViviendaRequestDto;
import com.antonio.piscinas.estructura.dto.vivienda.ViviendaResponseDto;
import com.antonio.piscinas.estructura.service.ViviendaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/viviendas")
@RequiredArgsConstructor
public class ViviendaController {

    private final ViviendaService viviendaService;

    @GetMapping
    public List<ViviendaResponseDto> findAll() {
        return viviendaService.findAll();
    }

    @GetMapping("/{id}")
    public ViviendaResponseDto findById(@PathVariable Long id) {
        return viviendaService.findById(id);
    }

    @GetMapping("/urbanizacion/{urbanizacionId}")
    public List<ViviendaResponseDto> findByUrbanizacion(@PathVariable Long urbanizacionId) {
        return viviendaService.findByUrbanizacionId(urbanizacionId);
    }

    @GetMapping("/calle/{calleId}")
    public List<ViviendaResponseDto> findByCalle(@PathVariable Long calleId) {
        return viviendaService.findByCalleId(calleId);
    }

    @GetMapping("/bloque/{bloqueId}")
    public List<ViviendaResponseDto> findByBloque(@PathVariable Long bloqueId) {
        return viviendaService.findByBloqueId(bloqueId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ViviendaResponseDto create(@Valid @RequestBody ViviendaRequestDto dto) {
        return viviendaService.create(dto);
    }

    @PutMapping("/{id}")
    public ViviendaResponseDto update(@PathVariable Long id,
                                      @Valid @RequestBody ViviendaRequestDto dto) {
        return viviendaService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        viviendaService.delete(id);
    }
}