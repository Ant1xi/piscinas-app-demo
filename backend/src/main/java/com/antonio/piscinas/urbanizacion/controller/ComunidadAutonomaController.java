package com.antonio.piscinas.urbanizacion.controller;

import com.antonio.piscinas.urbanizacion.dto.ComunidadAutonomaResponseDto;
import com.antonio.piscinas.urbanizacion.service.ComunidadAutonomaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comunidades-autonomas")
@RequiredArgsConstructor
public class ComunidadAutonomaController {

    private final ComunidadAutonomaService comunidadAutonomaService;

    @GetMapping
    public List<ComunidadAutonomaResponseDto> findAll() {
        return comunidadAutonomaService.findAll();
    }

    @GetMapping("/{id}")
    public ComunidadAutonomaResponseDto findById(@PathVariable Long id) {
        return comunidadAutonomaService.findById(id);
    }
}