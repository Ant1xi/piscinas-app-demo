package com.antonio.piscinas.piscina.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PiscinaHorarioDto {
    private Long id;
    private Long piscinaId;
    private String nombre;
    private String diasSemana;
    private String horaApertura;
    private String horaCierre;
    private Boolean activo;
}
