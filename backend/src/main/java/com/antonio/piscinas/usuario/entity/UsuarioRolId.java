package com.antonio.piscinas.usuario.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class UsuarioRolId implements Serializable {

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Enumerated(jakarta.persistence.EnumType.STRING)
    @Column(name = "rol")
    private Rol rol;
}