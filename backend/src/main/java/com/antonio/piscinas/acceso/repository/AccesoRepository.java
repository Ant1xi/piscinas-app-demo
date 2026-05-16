package com.antonio.piscinas.acceso.repository;

import com.antonio.piscinas.acceso.entity.Acceso;
import com.antonio.piscinas.persona.entity.Persona;
import com.antonio.piscinas.piscina.entity.Piscina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AccesoRepository extends JpaRepository<Acceso, Long> {

    @Query("""
        SELECT a
        FROM Acceso a
        JOIN FETCH a.piscina p
        JOIN FETCH a.vivienda v
        LEFT JOIN FETCH v.calle
        LEFT JOIN FETCH v.bloque
        JOIN FETCH a.persona pe
        JOIN FETCH a.registradoPor rp
    """)
    List<Acceso> findAllWithRelations();

    @Query("""
        SELECT a
        FROM Acceso a
        JOIN FETCH a.piscina p
        JOIN FETCH a.vivienda v
        LEFT JOIN FETCH v.calle
        LEFT JOIN FETCH v.bloque
        JOIN FETCH a.persona pe
        JOIN FETCH a.registradoPor rp
        WHERE a.id = :id
    """)
    Optional<Acceso> findByIdWithRelations(Long id);

    @Query("""
        SELECT a
        FROM Acceso a
        JOIN FETCH a.piscina p
        JOIN FETCH a.vivienda v
        LEFT JOIN FETCH v.calle
        LEFT JOIN FETCH v.bloque
        JOIN FETCH a.persona pe
        JOIN FETCH a.registradoPor rp
        WHERE a.piscina = :piscina
    """)
    List<Acceso> findByPiscinaWithRelations(Piscina piscina);

    @Query("""
        SELECT a
        FROM Acceso a
        JOIN FETCH a.piscina p
        JOIN FETCH a.vivienda v
        LEFT JOIN FETCH v.calle
        LEFT JOIN FETCH v.bloque
        JOIN FETCH a.persona pe
        JOIN FETCH a.registradoPor rp
        WHERE a.piscina = :piscina
          AND a.horaSalida IS NULL
    """)
    List<Acceso> findAbiertosByPiscinaWithRelations(Piscina piscina);

    Optional<Acceso> findByPersonaAndPiscinaAndHoraSalidaIsNull(Persona persona, Piscina piscina);

    @Query("""
    SELECT a
    FROM Acceso a
    JOIN FETCH a.piscina p
    JOIN FETCH a.vivienda v
    LEFT JOIN FETCH v.calle
    LEFT JOIN FETCH v.bloque
    JOIN FETCH a.persona pe
    JOIN FETCH a.registradoPor rp
    WHERE a.piscina = :piscina
      AND a.horaEntrada >= :inicioDia
      AND a.horaEntrada < :finDia
    ORDER BY a.horaEntrada ASC
""")
    List<Acceso> findByPiscinaAndFechaWithRelations(
            Piscina piscina,
            LocalDateTime inicioDia,
            LocalDateTime finDia
    );

    @Query("""
    SELECT a
    FROM Acceso a
    JOIN FETCH a.piscina p
    JOIN FETCH a.vivienda v
    LEFT JOIN FETCH v.calle
    LEFT JOIN FETCH v.bloque
    JOIN FETCH a.persona pe
    JOIN FETCH a.registradoPor rp
    WHERE p.id = :piscinaId
    ORDER BY a.horaEntrada DESC
""")
    List<Acceso> findUltimosByPiscinaIdWithRelations(
            Long piscinaId,
            Pageable pageable
    );

    long countByPiscinaIdAndHoraSalidaIsNull(Long piscinaId);

    long countByPiscinaIdAndHoraEntradaBetween(
            Long piscinaId,
            LocalDateTime inicioDia,
            LocalDateTime finDia
    );

    long countByPiscinaIdAndHoraSalidaBetween(
            Long piscinaId,
            LocalDateTime inicioDia,
            LocalDateTime finDia
    );

    List<Acceso> findByHoraSalidaIsNull();


}