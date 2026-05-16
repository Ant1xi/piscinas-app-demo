package com.antonio.piscinas.turno.entity;

import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.usuario.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "turno_piscina",
       uniqueConstraints = @UniqueConstraint(columnNames = {
               "piscina_id", "fecha", "hora_inicio", "hora_fin", "socorrista_id"
       }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TurnoPiscina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "piscina_id", nullable = false)
    private Piscina piscina;

    @ManyToOne(optional = false)
    @JoinColumn(name = "socorrista_id", nullable = false)
    private Usuario socorrista;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "hora_inicio")
    private LocalTime horaInicio;

    @Column(name = "hora_fin")
    private LocalTime horaFin;

    @Enumerated(EnumType.STRING)
    private EstadoTurno estado;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime ahora = LocalDateTime.now();

        if (this.estado == null) {
            this.estado = EstadoTurno.PROGRAMADO;
        }

        this.createdAt = ahora;
        this.updatedAt = ahora;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}