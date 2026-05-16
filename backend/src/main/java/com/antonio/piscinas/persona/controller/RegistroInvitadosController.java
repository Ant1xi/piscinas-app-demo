package com.antonio.piscinas.persona.controller;

import com.antonio.piscinas.persona.dto.RegistroInvitadosEntradaRequestDto;
import com.antonio.piscinas.persona.dto.RegistroInvitadosResponseDto;
import com.antonio.piscinas.persona.dto.RegistroInvitadosSalidaRequestDto;
import com.antonio.piscinas.persona.service.RegistroInvitadosService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registro-invitados")
@RequiredArgsConstructor
public class RegistroInvitadosController {

    private final RegistroInvitadosService registroInvitadosService;

    @GetMapping("/piscina/{piscinaId}/activos")
    public List<RegistroInvitadosResponseDto> findActivosByPiscina(@PathVariable Long piscinaId) {
        return registroInvitadosService.findActivosByPiscinaId(piscinaId);
    }

    @PostMapping("/entrada")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistroInvitadosResponseDto registrarEntrada(@Valid @RequestBody RegistroInvitadosEntradaRequestDto dto) {
        return registroInvitadosService.registrarEntrada(dto);
    }

    @PatchMapping("/salida")
    public RegistroInvitadosResponseDto registrarSalida(@Valid @RequestBody RegistroInvitadosSalidaRequestDto dto) {
        return registroInvitadosService.registrarSalida(dto);
    }
}
