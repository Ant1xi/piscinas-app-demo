package com.antonio.piscinas.piscina.entity;

import com.antonio.piscinas.usuario.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "socorrista_piscina",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_socorrista_piscina", columnNames = {"socorrista_id", "piscina_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocorristaPiscina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "socorrista_id", nullable = false)
    private Usuario socorrista;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "piscina_id", nullable = false)
    private Piscina piscina;

    @Column(nullable = false)
    private Boolean activo;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "asignado_por", nullable = false)
    private Usuario asignadoPor;

    @Column(name = "fecha_asignacion", nullable = false)
    private LocalDate fechaAsignacion;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime ahora = LocalDateTime.now();
        this.createdAt = ahora;
        this.updatedAt = ahora;

        if (this.activo == null) {
            this.activo = true;
        }

        if (this.fechaAsignacion == null) {
            this.fechaAsignacion = LocalDate.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}