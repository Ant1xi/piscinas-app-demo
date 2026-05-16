package com.antonio.piscinas.piscina.dto;

import com.antonio.piscinas.piscina.entity.EstadoPiscinaDia;
import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.usuario.entity.Usuario;

import java.time.LocalDate;

public class EstadoPiscinaDiaMapper {

    private EstadoPiscinaDiaMapper() {
    }

    public static EstadoPiscinaDiaResponseDto toDto(EstadoPiscinaDia estado) {
        return EstadoPiscinaDiaResponseDto.builder()
                .id(estado.getId())
                .fecha(estado.getFecha() != null ? estado.getFecha().toString() : null)
                .abierta(estado.getAbierta())
                .confirmacionOk(estado.getConfirmacionOk())
                .nota(estado.getNota())
                .piscinaId(estado.getPiscina() != null ? estado.getPiscina().getId() : null)
                .piscinaNombre(estado.getPiscina() != null ? estado.getPiscina().getNombre() : null)
                .actualizadoPorId(estado.getActualizadoPor() != null ? estado.getActualizadoPor().getId() : null)
                .actualizadoPorNombreCompleto(
                        estado.getActualizadoPor() != null
                                ? estado.getActualizadoPor().getNombre() + " " + estado.getActualizadoPor().getApellidos()
                                : null
                )
                .updatedAt(estado.getUpdatedAt() != null ? estado.getUpdatedAt().toString() : null)
                .build();
    }

    public static EstadoPiscinaDia toEntity(EstadoPiscinaDiaRequestDto dto, Piscina piscina, Usuario usuario) {
        return EstadoPiscinaDia.builder()
                .piscina(piscina)
                .fecha(parseFecha(dto.getFecha()))
                .abierta(dto.getAbierta())
                .confirmacionOk(dto.getConfirmacionOk())
                .nota(dto.getNota())
                .actualizadoPor(usuario)
                .build();
    }

    public static void updateEntity(EstadoPiscinaDia estado, EstadoPiscinaDiaRequestDto dto, Piscina piscina, Usuario usuario) {
        estado.setPiscina(piscina);
        estado.setFecha(parseFecha(dto.getFecha()));
        estado.setAbierta(dto.getAbierta() != null ? dto.getAbierta() : estado.getAbierta());
        estado.setConfirmacionOk(dto.getConfirmacionOk() != null ? dto.getConfirmacionOk() : estado.getConfirmacionOk());
        estado.setNota(dto.getNota());
        estado.setActualizadoPor(usuario);
    }

    private static LocalDate parseFecha(String fecha) {
        if (fecha == null || fecha.isBlank()) {
            return LocalDate.now();
        }
        return LocalDate.parse(fecha);
    }
}