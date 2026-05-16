package com.antonio.piscinas.urbanizacion.controller;

import com.antonio.piscinas.urbanizacion.dto.MunicipioResponseDto;
import com.antonio.piscinas.urbanizacion.service.MunicipioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/municipios")
@RequiredArgsConstructor
public class MunicipioController {

    private final MunicipioService municipioService;

    @GetMapping
    public List<MunicipioResponseDto> findAll() {
        return municipioService.findAll();
    }

    @GetMapping("/{id}")
    public MunicipioResponseDto findById(@PathVariable Long id) {
        return municipioService.findById(id);
    }

    @GetMapping("/provincia/{provinciaId}")
    public List<MunicipioResponseDto> findByProvinciaId(@PathVariable Long provinciaId) {
        return municipioService.findByProvinciaId(provinciaId);
    }
}