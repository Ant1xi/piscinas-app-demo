package com.antonio.piscinas.estructura.controller;


import com.antonio.piscinas.estructura.dto.bloque.BloqueRequestDto;
import com.antonio.piscinas.estructura.dto.bloque.BloqueResponseDto;
import com.antonio.piscinas.estructura.service.BloqueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bloques")
@RequiredArgsConstructor
public class BloqueController {

    private final BloqueService bloqueService;

    @GetMapping
    public List<BloqueResponseDto> findAll() {
        return bloqueService.findAll();
    }

    @GetMapping("/{id}")
    public BloqueResponseDto findById(@PathVariable Long id) {
        return bloqueService.findById(id);
    }

    @GetMapping("/urbanizacion/{urbanizacionId}")
    public List<BloqueResponseDto> findByUrbanizacion(@PathVariable Long urbanizacionId) {
        return bloqueService.findByUrbanizacionId(urbanizacionId);
    }

    @GetMapping("/piscina/{piscinaId}")
    public List<BloqueResponseDto> findByPiscina(@PathVariable Long piscinaId) {
        return bloqueService.findByPiscinaId(piscinaId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BloqueResponseDto create(@Valid @RequestBody BloqueRequestDto dto) {
        return bloqueService.create(dto);
    }

    @PutMapping("/{id}")
    public BloqueResponseDto update(
            @PathVariable Long id,
            @Valid @RequestBody BloqueRequestDto dto
    ) {
        return bloqueService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        bloqueService.delete(id);
    }
}