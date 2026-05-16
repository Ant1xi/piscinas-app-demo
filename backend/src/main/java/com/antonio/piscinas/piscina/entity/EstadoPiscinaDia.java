package com.antonio.piscinas.piscina.entity;

import com.antonio.piscinas.usuario.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "estado_piscina_dia",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"piscina_id", "fecha"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstadoPiscinaDia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "piscina_id", nullable = false)
    private Piscina piscina;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private Boolean abierta;

    @Column(name = "confirmacion_ok", nullable = false)
    private Boolean confirmacionOk;

    @Column(columnDefinition = "TEXT")
    private String nota;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "actualizado_por", nullable = false)
    private Usuario actualizadoPor;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (this.fecha == null) {
            this.fecha = LocalDate.now();
        }
        if (this.abierta == null) {
            this.abierta = false;
        }
        if (this.confirmacionOk == null) {
            this.confirmacionOk = false;
        }
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}