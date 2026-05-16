package com.antonio.piscinas.audit.service.impl;

import com.antonio.piscinas.audit.dto.AuditLogResponseDto;
import com.antonio.piscinas.audit.entity.AuditLog;
import com.antonio.piscinas.audit.repository.AuditLogRepository;
import com.antonio.piscinas.audit.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional
    public void registrar(Long usuarioId, String usuarioEmail, String accion, String entidad, String entidadId, String detalle) {
        AuditLog log = AuditLog.builder()
                .usuarioId(usuarioId != null ? usuarioId.intValue() : null)
                .usuarioEmail(usuarioEmail)
                .accion(accion)
                .entidad(entidad)
                .entidadId(entidadId)
                .detalle(detalle)
                .build();
        auditLogRepository.save(log);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogResponseDto> findFiltered(
            String search,
            String accion,
            String entidad,
            LocalDateTime desde,
            LocalDateTime hasta,
            int page,
            int size
    ) {
        return auditLogRepository
                .findFiltered(search, accion, entidad, desde, hasta, PageRequest.of(page, size))
                .map(AuditLogResponseDto::from);
    }
}
