package com.antonio.piscinas.urbanizacion.repository;

import com.antonio.piscinas.urbanizacion.entity.ComunidadAutonoma;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ComunidadAutonomaRepository extends JpaRepository<ComunidadAutonoma, Long> {

    Optional<ComunidadAutonoma> findByNombre(String nombre);

    boolean existsByNombre(String nombre);
}