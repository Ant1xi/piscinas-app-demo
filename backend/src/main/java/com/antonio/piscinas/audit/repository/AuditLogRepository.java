package com.antonio.piscinas.audit.repository;

import com.antonio.piscinas.audit.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("""
        SELECT a FROM AuditLog a
        WHERE (:search IS NULL OR :search = ''
               OR LOWER(a.usuarioEmail) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(a.accion)       LIKE LOWER(CONCAT('%', :search, '%')))
          AND (:accion  IS NULL OR :accion  = '' OR a.accion  = :accion)
          AND (:entidad IS NULL OR :entidad = '' OR a.entidad = :entidad)
          AND (:desde   IS NULL OR a.createdAt >= :desde)
          AND (:hasta   IS NULL OR a.createdAt <= :hasta)
        ORDER BY a.createdAt DESC
    """)
    Page<AuditLog> findFiltered(
            @Param("search")  String search,
            @Param("accion")  String accion,
            @Param("entidad") String entidad,
            @Param("desde")   LocalDateTime desde,
            @Param("hasta")   LocalDateTime hasta,
            Pageable pageable
    );
}
