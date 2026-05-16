package com.antonio.piscinas.urbanizacion.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "comunidad_autonoma")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComunidadAutonoma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nombre;
}