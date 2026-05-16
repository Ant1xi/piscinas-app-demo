package com.antonio.piscinas.estructura.repository;

import com.antonio.piscinas.estructura.entity.Calle;
import com.antonio.piscinas.urbanizacion.entity.Urbanizacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CalleRepository extends JpaRepository<Calle, Long> {

    List<Calle> findByUrbanizacion(Urbanizacion urbanizacion);

    Optional<Calle> findByNombreAndUrbanizacion(String nombre, Urbanizacion urbanizacion);

    boolean existsByNombreAndUrbanizacion(String nombre, Urbanizacion urbanizacion);
}