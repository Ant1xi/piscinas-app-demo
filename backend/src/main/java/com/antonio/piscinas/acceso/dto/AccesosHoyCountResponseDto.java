package com.antonio.piscinas.acceso.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AccesosHoyCountResponseDto {

    private Long piscinaId;
    private long totalEntradasHoy;
}