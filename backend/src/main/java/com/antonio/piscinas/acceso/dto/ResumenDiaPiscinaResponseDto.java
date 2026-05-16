package com.antonio.piscinas.acceso.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class ResumenDiaPiscinaResponseDto {

    private Long piscinaId;
    private LocalDate fecha;
    private long totalEntradas;
    private long totalSalidas;
    private long personasDentroAhora;
}