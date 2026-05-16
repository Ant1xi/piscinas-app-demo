package com.antonio.piscinas.acceso.controller;

import com.antonio.piscinas.acceso.dto.*;
import com.antonio.piscinas.acceso.service.AccesoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/accesos")
@RequiredArgsConstructor
public class AccesoController {

    private final AccesoService accesoService;

    @GetMapping
    public List<AccesoResponseDto> findAll() {
        return accesoService.findAll();
    }

    @GetMapping("/{id}")
    public AccesoResponseDto findById(@PathVariable Long id) {
        return accesoService.findById(id);
    }

    @GetMapping("/piscina/{piscinaId}")
    public List<AccesoResponseDto> findByPiscina(@PathVariable Long piscinaId) {
        return accesoService.findByPiscinaId(piscinaId);
    }

    @GetMapping("/piscina/{piscinaId}/dentro")
    public List<AccesoResponseDto> findDentroByPiscina(@PathVariable Long piscinaId) {
        return accesoService.findDentroByPiscinaId(piscinaId);
    }

    @GetMapping("/piscina/{piscinaId}/fecha")
    public List<AccesoResponseDto> findByPiscinaAndFecha(
            @PathVariable Long piscinaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha
    ) {
        return accesoService.findByPiscinaIdAndFecha(piscinaId, fecha);
    }

    @GetMapping("/piscina/{piscinaId}/dentro/count")
    public PersonasDentroCountResponseDto contarPersonasDentro(@PathVariable Long piscinaId) {
        return accesoService.contarPersonasDentro(piscinaId);
    }

    @PostMapping("/entrada")
    @ResponseStatus(HttpStatus.CREATED)
    public AccesoResponseDto registrarEntrada(@Valid @RequestBody AccesoEntradaRequestDto dto) {
        return accesoService.registrarEntrada(dto);
    }

    @GetMapping("/piscina/{piscinaId}/hoy/count")
    public AccesosHoyCountResponseDto contarEntradasHoy(@PathVariable Long piscinaId) {
        return accesoService.contarEntradasHoy(piscinaId);
    }

    @GetMapping("/piscina/{piscinaId}/resumen-dia")
    public ResumenDiaPiscinaResponseDto obtenerResumenDia(
            @PathVariable Long piscinaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha
    ) {
        return accesoService.obtenerResumenDia(piscinaId, fecha);
    }

    @GetMapping("/piscina/{piscinaId}/ultimos")
    public List<AccesoResponseDto> findUltimosByPiscina(
            @PathVariable Long piscinaId,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return accesoService.findUltimosByPiscinaId(piscinaId, limit);
    }

    @PatchMapping("/salida")
    public AccesoResponseDto registrarSalida(@Valid @RequestBody AccesoSalidaRequestDto dto) {
        return accesoService.registrarSalida(dto);
    }
}