package com.antonio.piscinas.urbanizacion.repository;

import com.antonio.piscinas.urbanizacion.entity.Municipio;
import com.antonio.piscinas.urbanizacion.entity.TipoUrbanizacion;
import com.antonio.piscinas.urbanizacion.entity.Urbanizacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UrbanizacionRepository extends JpaRepository<Urbanizacion, Long> {

    List<Urbanizacion> findByMunicipio(Municipio municipio);

    List<Urbanizacion> findByActivaTrue();

    List<Urbanizacion> findByTipoUrbanizacion(TipoUrbanizacion tipoUrbanizacion);

    Optional<Urbanizacion> findByNombreAndMunicipio(String nombre, Municipio municipio);

    boolean existsByNombreAndMunicipio(String nombre, Municipio municipio);
}