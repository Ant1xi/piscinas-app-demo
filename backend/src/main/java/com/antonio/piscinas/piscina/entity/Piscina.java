package com.antonio.piscinas.piscina.entity;

import com.antonio.piscinas.urbanizacion.entity.Urbanizacion;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "piscina")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Piscina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "urbanizacion_id", nullable = false)
    private Urbanizacion urbanizacion;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "hora_apertura")
    private LocalTime horaApertura;

    @Column(name = "hora_cierre")
    private LocalTime horaCierre;

    @Column(name = "max_invitados_por_vivienda", nullable = false)
    private Integer maxInvitadosPorVivienda;

    @Column(name = "ruta_imagen", length = 255)
    private String rutaImagen;

    @Column(nullable = false)
    private Boolean activa;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime ahora = LocalDateTime.now();
        this.createdAt = ahora;
        this.updatedAt = ahora;

        if (this.activa == null) {
            this.activa = true;
        }
        if (this.maxInvitadosPorVivienda == null) {
            this.maxInvitadosPorVivienda = 0;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}