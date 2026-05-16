package com.antonio.piscinas.persona.repository;

import com.antonio.piscinas.estructura.entity.Vivienda;
import com.antonio.piscinas.persona.entity.Persona;
import com.antonio.piscinas.persona.entity.RolVivienda;
import com.antonio.piscinas.persona.entity.ViviendaPersona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ViviendaPersonaRepository extends JpaRepository<ViviendaPersona, Long> {

    @Query("""
        SELECT vp
        FROM ViviendaPersona vp
        JOIN FETCH vp.persona p
        JOIN FETCH vp.vivienda v
        LEFT JOIN FETCH v.calle c
        LEFT JOIN FETCH v.bloque b
    """)
    List<ViviendaPersona> findAllWithRelations();

    @Query("""
        SELECT vp
        FROM ViviendaPersona vp
        JOIN FETCH vp.persona p
        JOIN FETCH vp.vivienda v
        LEFT JOIN FETCH v.calle c
        LEFT JOIN FETCH v.bloque b
        WHERE vp.id = :id
    """)
    Optional<ViviendaPersona> findByIdWithRelations(Long id);

    @Query("""
        SELECT vp
        FROM ViviendaPersona vp
        JOIN FETCH vp.persona p
        JOIN FETCH vp.vivienda v
        LEFT JOIN FETCH v.calle c
        LEFT JOIN FETCH v.bloque b
        WHERE v = :vivienda
    """)
    List<ViviendaPersona> findByViviendaWithRelations(Vivienda vivienda);

    @Query("""
        SELECT vp
        FROM ViviendaPersona vp
        JOIN FETCH vp.persona p
        JOIN FETCH vp.vivienda v
        LEFT JOIN FETCH v.calle c
        LEFT JOIN FETCH v.bloque b
        WHERE p = :persona
    """)
    List<ViviendaPersona> findByPersonaWithRelations(Persona persona);

    Optional<ViviendaPersona> findByPersonaAndViviendaAndRolEnVivienda(
            Persona persona,
            Vivienda vivienda,
            RolVivienda rolEnVivienda
    );

    boolean existsByVivienda(Vivienda vivienda);

    long countByVivienda(Vivienda vivienda);

    boolean existsByPersona(Persona persona);

    @Query("""
        SELECT vp FROM ViviendaPersona vp
        JOIN FETCH vp.vivienda v
        LEFT JOIN FETCH v.calle
        LEFT JOIN FETCH v.bloque
        WHERE vp.persona = :persona
          AND vp.rolEnVivienda = :rol
          AND v.urbanizacion.id = :urbanizacionId
          AND v.id <> :viviendaId
          AND vp.fechaBaja IS NULL
    """)
    java.util.Optional<ViviendaPersona> findPropietarioEnUrbanizacion(
            @org.springframework.data.repository.query.Param("persona") Persona persona,
            @org.springframework.data.repository.query.Param("rol") RolVivienda rol,
            @org.springframework.data.repository.query.Param("urbanizacionId") Long urbanizacionId,
            @org.springframework.data.repository.query.Param("viviendaId") Long viviendaId
    );

    @Query("""
        SELECT vp FROM ViviendaPersona vp
        JOIN FETCH vp.vivienda v
        LEFT JOIN FETCH v.calle
        LEFT JOIN FETCH v.bloque
        WHERE vp.persona = :persona
          AND v.id <> :viviendaId
          AND vp.fechaBaja IS NULL
    """)
    List<ViviendaPersona> findOtrasViviendas(
            @org.springframework.data.repository.query.Param("persona") Persona persona,
            @org.springframework.data.repository.query.Param("viviendaId") Long viviendaId
    );
}