package com.antonio.piscinas.estructura.entity;

import com.antonio.piscinas.urbanizacion.entity.Urbanizacion;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "vivienda",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"calle_id", "identificador"}),
           @UniqueConstraint(columnNames = {"bloque_id", "planta", "identificador"})
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vivienda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación obligatoria
    @ManyToOne(optional = false)
    @JoinColumn(name = "urbanizacion_id", nullable = false)
    private Urbanizacion urbanizacion;

    // Solo uno de estos dos debe tener valor (validación en SERVICE)
    @ManyToOne
    @JoinColumn(name = "calle_id")
    private Calle calle;

    @ManyToOne
    @JoinColumn(name = "bloque_id")
    private Bloque bloque;

    // Ejemplo: "12" (casa) o "F" (puerta)
    @Column(nullable = false, length = 50)
    private String identificador;

    // Ejemplo: "4", "Bajo", etc (solo para pisos)
    @Column(length = 10)
    private String planta;

    // Observaciones generales de la vivienda
    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime ahora = LocalDateTime.now();
        this.createdAt = ahora;
        this.updatedAt = ahora;

    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}