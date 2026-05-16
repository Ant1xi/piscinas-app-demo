package com.antonio.piscinas.piscina.controller;

import com.antonio.piscinas.piscina.dto.EstadoPiscinaDiaRequestDto;
import com.antonio.piscinas.piscina.dto.EstadoPiscinaDiaResponseDto;
import com.antonio.piscinas.piscina.service.EstadoPiscinaDiaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estados-piscina")
@RequiredArgsConstructor
public class EstadoPiscinaDiaController {

    private final EstadoPiscinaDiaService estadoPiscinaDiaService;

    @GetMapping
    public List<EstadoPiscinaDiaResponseDto> findAll() {
        return estadoPiscinaDiaService.findAll();
    }

    @GetMapping("/{id}")
    public EstadoPiscinaDiaResponseDto findById(@PathVariable Long id) {
        return estadoPiscinaDiaService.findById(id);
    }

    @GetMapping("/piscina/{piscinaId}")
    public List<EstadoPiscinaDiaResponseDto> findByPiscinaId(@PathVariable Long piscinaId) {
        return estadoPiscinaDiaService.findByPiscinaId(piscinaId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EstadoPiscinaDiaResponseDto create(@Valid @RequestBody EstadoPiscinaDiaRequestDto dto) {
        return estadoPiscinaDiaService.create(dto);
    }

    @PutMapping("/{id}")
    public EstadoPiscinaDiaResponseDto update(@PathVariable Long id,
                                              @Valid @RequestBody EstadoPiscinaDiaRequestDto dto) {
        return estadoPiscinaDiaService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        estadoPiscinaDiaService.delete(id);
    }
}