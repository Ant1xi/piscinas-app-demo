package com.antonio.piscinas.persona.repository;

import com.antonio.piscinas.persona.entity.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PersonaRepository extends JpaRepository<Persona, Long> {

    Optional<Persona> findByDni(String dni);

    boolean existsByDni(String dni);

    @Query("""
    SELECT p, v
    FROM Persona p
    JOIN ViviendaPersona vp ON vp.persona = p
    JOIN Vivienda v ON vp.vivienda = v
    WHERE v.urbanizacion.id = (
        SELECT pi.urbanizacion.id
        FROM Piscina pi
        WHERE pi.id = :piscinaId
    )
    AND p.activo = true
    AND vp.fechaBaja IS NULL
    AND (
        LOWER(p.nombre) LIKE LOWER(CONCAT('%', :texto, '%'))
        OR LOWER(p.apellidos) LIKE LOWER(CONCAT('%', :texto, '%'))
        OR LOWER(p.dni) LIKE LOWER(CONCAT('%', :texto, '%'))
    )
    ORDER BY vp.principal DESC, p.apellidos ASC, p.nombre ASC
""")
    List<Object[]> buscarConViviendaPorPiscinaYTexto(Long piscinaId, String texto);

    @Query("""
    SELECT p
    FROM Persona p
    JOIN ViviendaPersona vp ON vp.persona = p
    WHERE vp.vivienda.id = :viviendaId
      AND p.activo = true
      AND vp.fechaBaja IS NULL
    ORDER BY vp.principal DESC, p.apellidos ASC, p.nombre ASC
""")
    List<Persona> findActivasByViviendaId(Long viviendaId);
}