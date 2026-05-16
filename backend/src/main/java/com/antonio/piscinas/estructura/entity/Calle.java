package com.antonio.piscinas.estructura.entity;

import com.antonio.piscinas.urbanizacion.entity.Urbanizacion;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "calle",
       uniqueConstraints = @UniqueConstraint(columnNames = {"urbanizacion_id", "nombre"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Calle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "urbanizacion_id", nullable = false)
    private Urbanizacion urbanizacion;

    @Column(nullable = false, length = 120)
    private String nombre;
}