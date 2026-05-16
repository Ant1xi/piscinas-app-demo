package com.antonio.piscinas.persona.entity;

import com.antonio.piscinas.estructura.entity.Vivienda;
import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.usuario.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "registro_invitados")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistroInvitados {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "piscina_id", nullable = false)
    private Piscina piscina;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vivienda_id", nullable = false)
    private Vivienda vivienda;

    @Column(name = "cantidad_invitados", nullable = false)
    private Integer cantidadInvitados;

    @Column(name = "hora_entrada", nullable = false)
    private LocalDateTime horaEntrada;

    // NULL mientras los invitados están dentro
    @Column(name = "hora_salida")
    private LocalDateTime horaSalida;

    @ManyToOne(optional = false)
    @JoinColumn(name = "registrado_por", nullable = false)
    private Usuario registradoPor;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "supera_limite", nullable = false)
    private Boolean superaLimite;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime ahora = LocalDateTime.now();
        if (this.horaEntrada == null) this.horaEntrada = ahora;
        if (this.cantidadInvitados == null) this.cantidadInvitados = 1;
        if (this.superaLimite == null) this.superaLimite = false;
        this.createdAt = ahora;
        this.updatedAt = ahora;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
