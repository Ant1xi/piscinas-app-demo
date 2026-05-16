package com.antonio.piscinas.urbanizacion.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "provincia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Provincia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nombre;

    @ManyToOne(optional = false)
    @JoinColumn(name = "comunidad_id", nullable = false)
    private ComunidadAutonoma comunidad;
}