package com.antonio.piscinas.piscina.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "piscina_horario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PiscinaHorario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "piscina_id", nullable = false)
    private Piscina piscina;

    @Column(nullable = false, length = 100)
    private String nombre;

    // Días: L M X J V S D — ejemplos: "LMXJV", "SD", "LMXJVSD"
    @Column(name = "dias_semana", nullable = false, length = 20)
    private String diasSemana;

    @Column(name = "hora_apertura", nullable = false)
    private LocalTime horaApertura;

    @Column(name = "hora_cierre", nullable = false)
    private LocalTime horaCierre;

    @Builder.Default
    @Column(nullable = false)
    private Boolean activo = true;
}
