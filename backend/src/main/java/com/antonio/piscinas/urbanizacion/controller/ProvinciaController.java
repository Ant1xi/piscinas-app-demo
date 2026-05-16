package com.antonio.piscinas.urbanizacion.controller;

import com.antonio.piscinas.urbanizacion.dto.ProvinciaResponseDto;
import com.antonio.piscinas.urbanizacion.service.ProvinciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provincias")
@RequiredArgsConstructor
public class ProvinciaController {

    private final ProvinciaService provinciaService;

    @GetMapping
    public List<ProvinciaResponseDto> findAll() {
        return provinciaService.findAll();
    }

    @GetMapping("/{id}")
    public ProvinciaResponseDto findById(@PathVariable Long id) {
        return provinciaService.findById(id);
    }

    @GetMapping("/comunidad/{comunidadAutonomaId}")
    public List<ProvinciaResponseDto> findByComunidadAutonomaId(@PathVariable Long comunidadAutonomaId) {
        return provinciaService.findByComunidadAutonomaId(comunidadAutonomaId);
    }
}