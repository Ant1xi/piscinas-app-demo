package com.antonio.piscinas.audit.service;

import com.antonio.piscinas.audit.dto.AuditLogResponseDto;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;

public interface AuditLogService {
    Page<AuditLogResponseDto> findFiltered(
            String search,
            String accion,
            String entidad,
            LocalDateTime desde,
            LocalDateTime hasta,
            int page,
            int size
    );

    void registrar(Long usuarioId, String usuarioEmail, String accion, String entidad, String entidadId, String detalle);
}
