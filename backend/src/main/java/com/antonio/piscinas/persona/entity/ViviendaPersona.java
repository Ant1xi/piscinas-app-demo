package com.antonio.piscinas.persona.entity;

import com.antonio.piscinas.estructura.entity.Vivienda;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "vivienda_persona",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"persona_id", "vivienda_id", "rol_en_vivienda"})
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ViviendaPersona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Persona
    @ManyToOne(optional = false)
    @JoinColumn(name = "persona_id", nullable = false)
    private Persona persona;

    // Vivienda
    @ManyToOne(optional = false)
    @JoinColumn(name = "vivienda_id", nullable = false)
    private Vivienda vivienda;

    // Rol dentro de la vivienda
    @Enumerated(EnumType.STRING)
    @Column(name = "rol_en_vivienda", nullable = false)
    private RolVivienda rolEnVivienda;

    // propietario principal
    @Column(nullable = false)
    private Boolean principal;

    // histórico
    private LocalDate fechaAlta;

    private LocalDate fechaBaja;

    @PrePersist
    public void prePersist() {
        if (this.principal == null) {
            this.principal = false;
        }

        if (this.fechaAlta == null) {
            this.fechaAlta = LocalDate.now();
        }
    }
}