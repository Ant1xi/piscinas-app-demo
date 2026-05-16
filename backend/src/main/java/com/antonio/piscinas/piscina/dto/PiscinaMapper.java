package com.antonio.piscinas.piscina.dto;

import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.urbanizacion.entity.Urbanizacion;

import java.time.LocalTime;

public class PiscinaMapper {

    private PiscinaMapper() {
    }

    public static PiscinaResponseDto toDto(Piscina piscina) {
        Urbanizacion urbanizacion = piscina.getUrbanizacion();

        return PiscinaResponseDto.builder()
                .id(piscina.getId())
                .nombre(piscina.getNombre())
                .descripcion(piscina.getDescripcion())
                .horaApertura(piscina.getHoraApertura() != null ? piscina.getHoraApertura().toString() : null)
                .horaCierre(piscina.getHoraCierre() != null ? piscina.getHoraCierre().toString() : null)
                .rutaImagen(piscina.getRutaImagen())
                .activa(piscina.getActiva())
                .urbanizacionId(urbanizacion != null ? urbanizacion.getId() : null)
                .urbanizacionNombre(urbanizacion != null ? urbanizacion.getNombre() : null)
                .municipioId(urbanizacion != null && urbanizacion.getMunicipio() != null ? urbanizacion.getMunicipio().getId() : null)
                .municipioNombre(urbanizacion != null && urbanizacion.getMunicipio() != null ? urbanizacion.getMunicipio().getNombre() : null)
                .maxInvitadosPorVivienda(piscina.getMaxInvitadosPorVivienda())
                .tipoUrbanizacion(urbanizacion != null && urbanizacion.getTipoUrbanizacion() != null ? urbanizacion.getTipoUrbanizacion().name() : null)
                .googleMapsUrl(urbanizacion != null ? urbanizacion.getGoogleMapsUrl() : null)
                .build();
    }

    public static Piscina toEntity(PiscinaRequestDto dto, Urbanizacion urbanizacion) {
        return Piscina.builder()
                .urbanizacion(urbanizacion)
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .horaApertura(parseHora(dto.getHoraApertura()))
                .horaCierre(parseHora(dto.getHoraCierre()))
                .rutaImagen(dto.getRutaImagen())
                .activa(dto.getActiva() != null ? dto.getActiva() : true)
                .maxInvitadosPorVivienda(dto.getMaxInvitadosPorVivienda() != null ? dto.getMaxInvitadosPorVivienda() : 0)
                .build();
    }

    public static void updateEntity(Piscina piscina, PiscinaRequestDto dto, Urbanizacion urbanizacion) {
        piscina.setUrbanizacion(urbanizacion);
        piscina.setNombre(dto.getNombre());
        piscina.setDescripcion(dto.getDescripcion());
        piscina.setHoraApertura(parseHora(dto.getHoraApertura()));
        piscina.setHoraCierre(parseHora(dto.getHoraCierre()));
        piscina.setRutaImagen(dto.getRutaImagen());
        piscina.setActiva(dto.getActiva() != null ? dto.getActiva() : piscina.getActiva());
        if (dto.getMaxInvitadosPorVivienda() != null) {
            piscina.setMaxInvitadosPorVivienda(dto.getMaxInvitadosPorVivienda());
        }
    }

    private static LocalTime parseHora(String hora) {
        if (hora == null || hora.isBlank()) {
            return null;
        }
        return LocalTime.parse(hora);
    }
}