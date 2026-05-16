package com.antonio.piscinas.urbanizacion.repository;

import com.antonio.piscinas.urbanizacion.entity.ComunidadAutonoma;
import com.antonio.piscinas.urbanizacion.entity.Provincia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProvinciaRepository extends JpaRepository<Provincia, Long> {

    List<Provincia> findByComunidad(ComunidadAutonoma comunidad);

    Optional<Provincia> findByNombreAndComunidad(String nombre, ComunidadAutonoma comunidad);

    boolean existsByNombreAndComunidad(String nombre, ComunidadAutonoma comunidad);
}