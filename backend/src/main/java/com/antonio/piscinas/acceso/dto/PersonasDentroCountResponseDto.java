package com.antonio.piscinas.acceso.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PersonasDentroCountResponseDto {

    private Long piscinaId;
    private long personasDentro;
}