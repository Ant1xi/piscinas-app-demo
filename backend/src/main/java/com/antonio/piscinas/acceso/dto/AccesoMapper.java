package com.antonio.piscinas.acceso.dto;

import com.antonio.piscinas.acceso.entity.Acceso;
import com.antonio.piscinas.estructura.entity.Vivienda;
import com.antonio.piscinas.persona.entity.Persona;
import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.usuario.entity.Usuario;

public class AccesoMapper {

    private AccesoMapper() {}

    public static Acceso toEntity(Piscina piscina,
                                 Vivienda vivienda,
                                 Persona persona,
                                 Usuario usuario,
                                 String comentario) {

        return Acceso.builder()
                .piscina(piscina)
                .vivienda(vivienda)
                .persona(persona)
                .registradoPor(usuario)
                .comentario(comentario)
                .build();
    }

    public static AccesoResponseDto toDto(Acceso acceso) {
        return AccesoResponseDto.builder()
                .id(acceso.getId())

                .piscinaId(acceso.getPiscina().getId())
                .piscinaNombre(acceso.getPiscina().getNombre())

                .viviendaId(acceso.getVivienda().getId())
                .viviendaIdentificador(acceso.getVivienda().getIdentificador())
                .calleNombre(acceso.getVivienda().getCalle() != null ? acceso.getVivienda().getCalle().getNombre() : null)
                .bloqueCodigo(acceso.getVivienda().getBloque() != null ? acceso.getVivienda().getBloque().getCodigo() : null)

                .personaId(acceso.getPersona().getId())
                .personaNombreCompleto(
                        acceso.getPersona().getNombre() + " " + acceso.getPersona().getApellidos()
                )

                .horaEntrada(acceso.getHoraEntrada().toString())
                .horaSalida(acceso.getHoraSalida() != null ? acceso.getHoraSalida().toString() : null)

                .registradoPorId(acceso.getRegistradoPor().getId())
                .registradoPorNombreCompleto(
                        acceso.getRegistradoPor().getNombre() + " " + acceso.getRegistradoPor().getApellidos()
                )

                .comentario(acceso.getComentario())
                .build();
    }
}