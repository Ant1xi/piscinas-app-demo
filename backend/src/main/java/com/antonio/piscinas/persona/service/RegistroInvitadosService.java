package com.antonio.piscinas.persona.service;

import com.antonio.piscinas.persona.dto.RegistroInvitadosEntradaRequestDto;
import com.antonio.piscinas.persona.dto.RegistroInvitadosResponseDto;
import com.antonio.piscinas.persona.dto.RegistroInvitadosSalidaRequestDto;

import java.util.List;

public interface RegistroInvitadosService {

    List<RegistroInvitadosResponseDto> findActivosByPiscinaId(Long piscinaId);

    RegistroInvitadosResponseDto registrarEntrada(RegistroInvitadosEntradaRequestDto dto);

    RegistroInvitadosResponseDto registrarSalida(RegistroInvitadosSalidaRequestDto dto);
}
