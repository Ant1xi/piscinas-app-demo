package com.antonio.piscinas.turno.repository;

import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.turno.entity.EstadoTurno;
import com.antonio.piscinas.turno.entity.TurnoPiscina;
import com.antonio.piscinas.usuario.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface TurnoPiscinaRepository extends JpaRepository<TurnoPiscina, Long> {

    List<TurnoPiscina> findByPiscina(Piscina piscina);

    List<TurnoPiscina> findByPiscinaAndFecha(Piscina piscina, LocalDate fecha);

    List<TurnoPiscina> findBySocorristaAndFecha(Usuario socorrista, LocalDate fecha);

    @Query("""
        SELECT COUNT(t) > 0 FROM TurnoPiscina t
        WHERE t.socorrista.id = :socorristaId
          AND t.fecha = :fecha
          AND t.id <> :excludeId
          AND t.horaInicio < :horaFin
          AND t.horaFin > :horaInicio
    """)
    boolean existeSolape(
            @Param("socorristaId") Long socorristaId,
            @Param("fecha") LocalDate fecha,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin,
            @Param("excludeId") Long excludeId
    );

    @Query("""
        SELECT t FROM TurnoPiscina t
        JOIN FETCH t.piscina p
        JOIN FETCH t.socorrista s
        WHERE t.socorrista.id = :socorristaId
          AND t.fecha = :fecha
          AND t.id <> :excludeId
          AND t.horaInicio < :horaFin
          AND t.horaFin > :horaInicio
        ORDER BY t.horaInicio ASC
    """)
    Optional<TurnoPiscina> findPrimerSolape(
            @Param("socorristaId") Long socorristaId,
            @Param("fecha") LocalDate fecha,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin,
            @Param("excludeId") Long excludeId
    );

    @Query("""
        SELECT t FROM TurnoPiscina t
        JOIN FETCH t.piscina p
        JOIN FETCH t.socorrista s
        WHERE p.id = :piscinaId
          AND t.fecha >= :desde
          AND t.fecha <= :hasta
        ORDER BY t.fecha ASC, t.horaInicio ASC
    """)
    List<TurnoPiscina> findByPiscinaIdAndFechaRange(Long piscinaId, LocalDate desde, LocalDate hasta);

    @Query("""
        SELECT t FROM TurnoPiscina t
        JOIN FETCH t.piscina p
        JOIN FETCH t.socorrista s
        WHERE s.id = :socorristaId
          AND t.fecha >= :desde
          AND t.fecha <= :hasta
        ORDER BY t.fecha ASC, t.horaInicio ASC
    """)
    List<TurnoPiscina> findBySocorristaIdAndFechaRange(Long socorristaId, LocalDate desde, LocalDate hasta);

    @Query("""
        SELECT COUNT(t) > 0 FROM TurnoPiscina t
        WHERE t.socorrista.id = :socorristaId
          AND t.piscina.id = :piscinaId
          AND t.fecha >= :hoy
          AND t.estado = :estado
    """)
    boolean tieneTurnosFuturos(
            @Param("socorristaId") Long socorristaId,
            @Param("piscinaId") Long piscinaId,
            @Param("hoy") LocalDate hoy,
            @Param("estado") EstadoTurno estado
    );
}
