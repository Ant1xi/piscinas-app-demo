package com.antonio.piscinas.configuracion.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "configuracion_sistema")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfiguracionSistema {

    @Id
    private String clave;

    @Column(nullable = false)
    private String valor;

    private String descripcion;
}
