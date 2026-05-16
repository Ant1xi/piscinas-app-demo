package com.antonio.piscinas.configuracion.repository;

import com.antonio.piscinas.configuracion.entity.ConfiguracionSistema;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfiguracionSistemaRepository extends JpaRepository<ConfiguracionSistema, String> {
}
