package com.antonio.piscinas.estructura.repository;

import com.antonio.piscinas.estructura.entity.Bloque;
import com.antonio.piscinas.urbanizacion.entity.Urbanizacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BloqueRepository extends JpaRepository<Bloque, Long> {

    List<Bloque> findByUrbanizacionOrderByCodigoAsc(Urbanizacion urbanizacion);

    List<Bloque> findByUrbanizacionIdOrderByCodigoAsc(Long urbanizacionId);

    Optional<Bloque> findByUrbanizacionAndCodigo(Urbanizacion urbanizacion, String codigo);

    boolean existsByUrbanizacionAndCodigo(Urbanizacion urbanizacion, String codigo);
}