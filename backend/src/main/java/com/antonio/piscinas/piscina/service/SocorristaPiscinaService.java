package com.antonio.piscinas.piscina.service;

import com.antonio.piscinas.piscina.dto.PiscinaResponseDto;
import com.antonio.piscinas.piscina.dto.SocorristaPiscinaRequestDto;
import com.antonio.piscinas.piscina.dto.SocorristaPiscinaResponseDto;

import java.util.List;

public interface SocorristaPiscinaService {

    List<PiscinaResponseDto> getMisPiscinas();

    List<SocorristaPiscinaResponseDto> findSocorristasByPiscinaId(Long piscinaId);

    SocorristaPiscinaResponseDto asignar(SocorristaPiscinaRequestDto dto);

    void desactivar(Long asignacionId);
}
