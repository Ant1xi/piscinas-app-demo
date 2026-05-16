package com.antonio.piscinas.piscina.controller;

import com.antonio.piscinas.piscina.dto.PiscinaResponseDto;
import com.antonio.piscinas.piscina.dto.SocorristaPiscinaRequestDto;
import com.antonio.piscinas.piscina.dto.SocorristaPiscinaResponseDto;
import com.antonio.piscinas.piscina.service.SocorristaPiscinaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/socorrista-piscina")
@RequiredArgsConstructor
public class SocorristaPiscinaController {

    private final SocorristaPiscinaService service;

    @GetMapping("/mis-piscinas")
    public List<PiscinaResponseDto> getMisPiscinas() {
        return service.getMisPiscinas();
    }

    @GetMapping("/piscina/{piscinaId}/socorristas")
    public List<SocorristaPiscinaResponseDto> findSocorristasByPiscinaId(@PathVariable Long piscinaId) {
        return service.findSocorristasByPiscinaId(piscinaId);
    }

    @PostMapping("/asignar")
    @ResponseStatus(HttpStatus.CREATED)
    public SocorristaPiscinaResponseDto asignar(@Valid @RequestBody SocorristaPiscinaRequestDto dto) {
        return service.asignar(dto);
    }

    @PatchMapping("/desactivar/{asignacionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void desactivar(@PathVariable Long asignacionId) {
        service.desactivar(asignacionId);
    }
}
