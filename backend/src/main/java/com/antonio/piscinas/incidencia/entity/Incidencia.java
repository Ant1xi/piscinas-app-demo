package com.antonio.piscinas.incidencia.entity;

import com.antonio.piscinas.acceso.entity.Acceso;
import com.antonio.piscinas.estructura.entity.Vivienda;
import com.antonio.piscinas.persona.entity.Persona;
import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.usuario.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "incidencia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "piscina_id", nullable = false)
    private Piscina piscina;

    @ManyToOne
    @JoinColumn(name = "vivienda_id")
    private Vivienda vivienda;

    @ManyToOne
    @JoinColumn(name = "persona_id")
    private Persona persona;

    @ManyToOne
    @JoinColumn(name = "acceso_id")
    private Acceso acceso;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoriaIncidencia categoria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoIncidencia tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PrioridadIncidencia prioridad;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoIncidencia estado;

    @ManyToOne(optional = false)
    @JoinColumn(name = "creada_por", nullable = false)
    private Usuario creadaPor;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "cerrada_por")
    private Usuario cerradaPor;

    @Column(name = "cerrada_at")
    private LocalDateTime cerradaAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.categoria == null) {
            this.categoria = CategoriaIncidencia.INCIDENCIA;
        }
        if (this.prioridad == null) {
            this.prioridad = PrioridadIncidencia.MEDIA;
        }
        if (this.estado == null) {
            this.estado = EstadoIncidencia.ABIERTA;
        }
    }
}