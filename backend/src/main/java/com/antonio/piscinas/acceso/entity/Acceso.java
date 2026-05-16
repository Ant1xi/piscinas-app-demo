package com.antonio.piscinas.acceso.entity;

import com.antonio.piscinas.estructura.entity.Vivienda;
import com.antonio.piscinas.persona.entity.Persona;
import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.usuario.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "acceso")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Acceso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Piscina
    @ManyToOne(optional = false)
    @JoinColumn(name = "piscina_id", nullable = false)
    private Piscina piscina;

    // Vivienda (importante para estadísticas)
    @ManyToOne(optional = false)
    @JoinColumn(name = "vivienda_id", nullable = false)
    private Vivienda vivienda;

    // Persona que entra
    @ManyToOne(optional = false)
    @JoinColumn(name = "persona_id", nullable = false)
    private Persona persona;

    // Entrada automática
    @Column(name = "hora_entrada", nullable = false)
    private LocalDateTime horaEntrada;

    // Salida (puede ser null)
    @Column(name = "hora_salida")
    private LocalDateTime horaSalida;

    // Socorrista que registra
    @ManyToOne(optional = false)
    @JoinColumn(name = "registrado_por", nullable = false)
    private Usuario registradoPor;

    // Comentario opcional
    @Column(columnDefinition = "TEXT")
    private String comentario;

    @PrePersist
    public void prePersist() {
        if (this.horaEntrada == null) {
            this.horaEntrada = LocalDateTime.now();
        }
    }
}