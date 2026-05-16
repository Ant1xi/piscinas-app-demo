package com.antonio.piscinas.incidencia.dto;

import com.antonio.piscinas.acceso.entity.Acceso;
import com.antonio.piscinas.estructura.entity.Vivienda;
import com.antonio.piscinas.incidencia.entity.EstadoIncidencia;
import com.antonio.piscinas.incidencia.entity.Incidencia;
import com.antonio.piscinas.persona.entity.Persona;
import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.usuario.entity.Usuario;

import java.time.LocalDateTime;

public class IncidenciaMapper {

    private IncidenciaMapper() {
    }

    public static IncidenciaResponseDto toDto(Incidencia incidencia) {
        return IncidenciaResponseDto.builder()
                .id(incidencia.getId())
                .piscinaId(incidencia.getPiscina() != null ? incidencia.getPiscina().getId() : null)
                .piscinaNombre(incidencia.getPiscina() != null ? incidencia.getPiscina().getNombre() : null)
                .viviendaId(incidencia.getVivienda() != null ? incidencia.getVivienda().getId() : null)
                .viviendaIdentificador(incidencia.getVivienda() != null ? incidencia.getVivienda().getIdentificador() : null)
                .personaId(incidencia.getPersona() != null ? incidencia.getPersona().getId() : null)
                .personaNombreCompleto(
                        incidencia.getPersona() != null
                                ? incidencia.getPersona().getNombre() + " " + incidencia.getPersona().getApellidos()
                                : null
                )
                .accesoId(incidencia.getAcceso() != null ? incidencia.getAcceso().getId() : null)
                .categoria(incidencia.getCategoria())
                .tipo(incidencia.getTipo())
                .prioridad(incidencia.getPrioridad())
                .estado(incidencia.getEstado())
                .descripcion(incidencia.getDescripcion())
                .creadaPorId(incidencia.getCreadaPor() != null ? incidencia.getCreadaPor().getId() : null)
                .creadaPorNombreCompleto(
                        incidencia.getCreadaPor() != null
                                ? incidencia.getCreadaPor().getNombre() + " " + incidencia.getCreadaPor().getApellidos()
                                : null
                )
                .createdAt(incidencia.getCreatedAt() != null ? incidencia.getCreatedAt().toString() : null)
                .cerradaPorId(incidencia.getCerradaPor() != null ? incidencia.getCerradaPor().getId() : null)
                .cerradaPorNombreCompleto(
                        incidencia.getCerradaPor() != null
                                ? incidencia.getCerradaPor().getNombre() + " " + incidencia.getCerradaPor().getApellidos()
                                : null
                )
                .cerradaAt(incidencia.getCerradaAt() != null ? incidencia.getCerradaAt().toString() : null)
                .build();
    }

    public static Incidencia toEntity(IncidenciaRequestDto dto,
                                      Piscina piscina,
                                      Vivienda vivienda,
                                      Persona persona,
                                      Acceso acceso,
                                      Usuario creadaPor) {
        return Incidencia.builder()
                .piscina(piscina)
                .vivienda(vivienda)
                .persona(persona)
                .acceso(acceso)
                .categoria(dto.getCategoria())
                .tipo(dto.getTipo())
                .prioridad(dto.getPrioridad())
                .estado(EstadoIncidencia.ABIERTA)
                .descripcion(dto.getDescripcion())
                .creadaPor(creadaPor)
                .build();
    }

    public static void updateEntity(Incidencia incidencia,
                                    IncidenciaUpdateDto dto,
                                    Piscina piscina,
                                    Vivienda vivienda,
                                    Persona persona,
                                    Acceso acceso) {
        incidencia.setPiscina(piscina);
        incidencia.setVivienda(vivienda);
        incidencia.setPersona(persona);
        incidencia.setAcceso(acceso);
        incidencia.setCategoria(dto.getCategoria());
        incidencia.setTipo(dto.getTipo());
        incidencia.setPrioridad(dto.getPrioridad());
        incidencia.setDescripcion(dto.getDescripcion());
    }

    public static void cerrarIncidencia(Incidencia incidencia, Usuario cerradaPor, String notaCierre) {
        incidencia.setEstado(EstadoIncidencia.CERRADA);
        incidencia.setCerradaPor(cerradaPor);
        incidencia.setCerradaAt(LocalDateTime.now());

        String descripcionActual = incidencia.getDescripcion() != null ? incidencia.getDescripcion() : "";
        incidencia.setDescripcion(descripcionActual + "\n\n[Cierre] " + notaCierre);
    }
}