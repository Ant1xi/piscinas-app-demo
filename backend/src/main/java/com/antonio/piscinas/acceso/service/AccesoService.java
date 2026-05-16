package com.antonio.piscinas.acceso.service;

import com.antonio.piscinas.acceso.dto.*;

import java.time.LocalDate;
import java.util.List;

public interface AccesoService {

    List<AccesoResponseDto> findAll();

    AccesoResponseDto findById(Long id);

    List<AccesoResponseDto> findByPiscinaId(Long piscinaId);

    List<AccesoResponseDto> findDentroByPiscinaId(Long piscinaId);

    AccesoResponseDto registrarEntrada(AccesoEntradaRequestDto dto);

    AccesoResponseDto registrarSalida(AccesoSalidaRequestDto dto);

    List<AccesoResponseDto> findByPiscinaIdAndFecha(Long piscinaId, LocalDate fecha);

    PersonasDentroCountResponseDto contarPersonasDentro(Long piscinaId);

    AccesosHoyCountResponseDto contarEntradasHoy(Long piscinaId);

    ResumenDiaPiscinaResponseDto obtenerResumenDia(Long piscinaId, LocalDate fecha);

    List<AccesoResponseDto> findUltimosByPiscinaId(Long piscinaId, int limit);
}