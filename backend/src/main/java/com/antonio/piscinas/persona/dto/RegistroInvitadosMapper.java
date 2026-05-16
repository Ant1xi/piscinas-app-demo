package com.antonio.piscinas.persona.dto;

import com.antonio.piscinas.persona.entity.RegistroInvitados;

import java.time.format.DateTimeFormatter;

public class RegistroInvitadosMapper {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("HH:mm");

    private RegistroInvitadosMapper() {}

    public static RegistroInvitadosResponseDto toDto(RegistroInvitados r) {
        return RegistroInvitadosResponseDto.builder()
                .id(r.getId())
                .piscinaId(r.getPiscina().getId())
                .viviendaId(r.getVivienda().getId())
                .viviendaIdentificador(r.getVivienda().getIdentificador())
                .cantidadInvitados(r.getCantidadInvitados())
                .horaEntrada(r.getHoraEntrada().format(FMT))
                .horaSalida(r.getHoraSalida() != null ? r.getHoraSalida().format(FMT) : null)
                .superaLimite(r.getSuperaLimite())
                .build();
    }
}
