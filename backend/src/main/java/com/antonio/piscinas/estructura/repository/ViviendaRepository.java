package com.antonio.piscinas.estructura.repository;

import com.antonio.piscinas.estructura.entity.Bloque;
import com.antonio.piscinas.estructura.entity.Calle;
import com.antonio.piscinas.estructura.entity.Vivienda;
import com.antonio.piscinas.urbanizacion.entity.Urbanizacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ViviendaRepository extends JpaRepository<Vivienda, Long> {

    List<Vivienda> findByUrbanizacion(Urbanizacion urbanizacion);

    List<Vivienda> findByCalle(Calle calle);

    List<Vivienda> findByBloque(Bloque bloque);

    Optional<Vivienda> findByCalleAndIdentificador(Calle calle, String identificador);

    Optional<Vivienda> findByBloqueAndPlantaAndIdentificador(Bloque bloque, String planta, String identificador);

    long countByCalle(Calle calle);

    long countByBloque(Bloque bloque);

    boolean existsByCalle(Calle calle);

    boolean existsByBloque(Bloque bloque);
}