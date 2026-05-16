package com.antonio.piscinas.piscina.repository;

import com.antonio.piscinas.piscina.entity.EstadoPiscinaDia;
import com.antonio.piscinas.piscina.entity.Piscina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EstadoPiscinaDiaRepository extends JpaRepository<EstadoPiscinaDia, Long> {

    @Query("""
        SELECT e
        FROM EstadoPiscinaDia e
        JOIN FETCH e.piscina p
        JOIN FETCH e.actualizadoPor u
    """)
    List<EstadoPiscinaDia> findAllWithRelations();

    @Query("""
        SELECT e
        FROM EstadoPiscinaDia e
        JOIN FETCH e.piscina p
        JOIN FETCH e.actualizadoPor u
        WHERE e.id = :id
    """)
    Optional<EstadoPiscinaDia> findByIdWithRelations(Long id);

    @Query("""
        SELECT e
        FROM EstadoPiscinaDia e
        JOIN FETCH e.piscina p
        JOIN FETCH e.actualizadoPor u
        WHERE p = :piscina
    """)
    List<EstadoPiscinaDia> findByPiscinaWithRelations(Piscina piscina);

    Optional<EstadoPiscinaDia> findByPiscinaAndFecha(Piscina piscina, LocalDate fecha);

    boolean existsByPiscinaAndFecha(Piscina piscina, LocalDate fecha);
}