package com.antonio.piscinas.urbanizacion.repository;

import com.antonio.piscinas.urbanizacion.entity.Municipio;
import com.antonio.piscinas.urbanizacion.entity.Provincia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MunicipioRepository extends JpaRepository<Municipio, Long> {

    List<Municipio> findByProvincia(Provincia provincia);

    Optional<Municipio> findByNombreAndProvincia(String nombre, Provincia provincia);

    boolean existsByNombreAndProvincia(String nombre, Provincia provincia);
}