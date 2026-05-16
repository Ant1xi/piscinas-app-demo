package com.antonio.piscinas.estructura.controller;

import com.antonio.piscinas.estructura.dto.calle.CalleRequestDto;
import com.antonio.piscinas.estructura.dto.calle.CalleResponseDto;
import com.antonio.piscinas.estructura.service.CalleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calles")
@RequiredArgsConstructor
public class CalleController {

    private final CalleService calleService;

    @GetMapping
    public List<CalleResponseDto> findAll() {
        return calleService.findAll();
    }

    @GetMapping("/{id}")
    public CalleResponseDto findById(@PathVariable Long id) {
        return calleService.findById(id);
    }

    @GetMapping("/urbanizacion/{urbanizacionId}")
    public List<CalleResponseDto> findByUrbanizacion(@PathVariable Long urbanizacionId) {
        return calleService.findByUrbanizacionId(urbanizacionId);
    }

    @GetMapping("/piscina/{piscinaId}")
    public List<CalleResponseDto> findByPiscina(@PathVariable Long piscinaId) {
        return calleService.findByPiscinaId(piscinaId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CalleResponseDto create(@Valid @RequestBody CalleRequestDto dto) {
        return calleService.create(dto);
    }

    @PutMapping("/{id}")
    public CalleResponseDto update(@PathVariable Long id,
                                   @Valid @RequestBody CalleRequestDto dto) {
        return calleService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        calleService.delete(id);
    }
}