package com.antonio.piscinas.incidencia.repository;

import com.antonio.piscinas.incidencia.entity.Incidencia;
import com.antonio.piscinas.piscina.entity.Piscina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IncidenciaRepository extends JpaRepository<Incidencia, Long> {

    @Query("""
        SELECT i
        FROM Incidencia i
        JOIN FETCH i.piscina p
        JOIN FETCH i.creadaPor cp
        LEFT JOIN FETCH i.vivienda v
        LEFT JOIN FETCH i.persona pe
        LEFT JOIN FETCH i.acceso a
        LEFT JOIN FETCH i.cerradaPor c
    """)
    List<Incidencia> findAllWithRelations();

    @Query("""
        SELECT i
        FROM Incidencia i
        JOIN FETCH i.piscina p
        JOIN FETCH i.creadaPor cp
        LEFT JOIN FETCH i.vivienda v
        LEFT JOIN FETCH i.persona pe
        LEFT JOIN FETCH i.acceso a
        LEFT JOIN FETCH i.cerradaPor c
        WHERE i.id = :id
    """)
    Optional<Incidencia> findByIdWithRelations(Long id);

    @Query("""
        SELECT i
        FROM Incidencia i
        JOIN FETCH i.piscina p
        JOIN FETCH i.creadaPor cp
        LEFT JOIN FETCH i.vivienda v
        LEFT JOIN FETCH i.persona pe
        LEFT JOIN FETCH i.acceso a
        LEFT JOIN FETCH i.cerradaPor c
        WHERE i.piscina = :piscina
    """)
    List<Incidencia> findByPiscinaWithRelations(Piscina piscina);
}