package com.antonio.piscinas.piscina.repository;

import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.urbanizacion.entity.Urbanizacion;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PiscinaRepository extends JpaRepository<Piscina, Long> {

    @Query("""
        SELECT p
        FROM Piscina p
        JOIN FETCH p.urbanizacion u
        JOIN FETCH u.municipio m
    """)
    List<Piscina> findAllWithUrbanizacion();

    @Query("""
        SELECT p
        FROM Piscina p
        JOIN FETCH p.urbanizacion u
        JOIN FETCH u.municipio m
        WHERE p.id = :id
    """)
    Optional<Piscina> findByIdWithUrbanizacion(Long id);

    @Query("""
        SELECT p
        FROM Piscina p
        JOIN FETCH p.urbanizacion u
        JOIN FETCH u.municipio m
        WHERE u = :urbanizacion
    """)
    List<Piscina> findByUrbanizacionWithMunicipio(Urbanizacion urbanizacion);

    List<Piscina> findByUrbanizacion(Urbanizacion urbanizacion);

    List<Piscina> findByActivaTrue();

    Optional<Piscina> findByNombreAndUrbanizacion(String nombre, Urbanizacion urbanizacion);

    boolean existsByNombreAndUrbanizacion(String nombre, Urbanizacion urbanizacion);
}