package com.antonio.piscinas.urbanizacion.controller;

import com.antonio.piscinas.urbanizacion.dto.UrbanizacionRequestDto;
import com.antonio.piscinas.urbanizacion.dto.UrbanizacionResponseDto;
import com.antonio.piscinas.urbanizacion.service.UrbanizacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/urbanizaciones")
@RequiredArgsConstructor
public class UrbanizacionController {

    private final UrbanizacionService urbanizacionService;

    // LISTAR TODAS
    @GetMapping
    public List<UrbanizacionResponseDto> findAll() {
        return urbanizacionService.findAll();
    }

    // OBTENER POR ID
    @GetMapping("/{id}")
    public UrbanizacionResponseDto findById(@PathVariable Long id) {
        return urbanizacionService.findById(id);
    }

    // CREAR
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UrbanizacionResponseDto create(@Valid @RequestBody UrbanizacionRequestDto dto) {
        return urbanizacionService.create(dto);
    }

    // ACTUALIZAR
    @PutMapping("/{id}")
    public UrbanizacionResponseDto update(@PathVariable Long id,
                                          @Valid @RequestBody UrbanizacionRequestDto dto) {
        return urbanizacionService.update(id, dto);
    }

    // ELIMINAR
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        urbanizacionService.delete(id);
    }
}