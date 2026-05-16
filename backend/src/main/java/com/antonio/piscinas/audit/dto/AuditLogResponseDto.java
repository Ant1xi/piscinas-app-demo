package com.antonio.piscinas.audit.dto;

import com.antonio.piscinas.audit.entity.AuditLog;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record AuditLogResponseDto(
        Long id,
        Integer usuarioId,
        String usuarioEmail,
        String accion,
        String entidad,
        String entidadId,
        String detalle,
        String ip,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime createdAt
) {
    public static AuditLogResponseDto from(AuditLog log) {
        return new AuditLogResponseDto(
                log.getId(),
                log.getUsuarioId(),
                log.getUsuarioEmail(),
                log.getAccion(),
                log.getEntidad(),
                log.getEntidadId(),
                log.getDetalle(),
                log.getIp(),
                log.getCreatedAt()
        );
    }
}
