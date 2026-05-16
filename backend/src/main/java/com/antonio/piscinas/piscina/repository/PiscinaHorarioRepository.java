package com.antonio.piscinas.piscina.repository;

import com.antonio.piscinas.piscina.entity.PiscinaHorario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PiscinaHorarioRepository extends JpaRepository<PiscinaHorario, Long> {
    List<PiscinaHorario> findByPiscinaIdOrderByHoraAperturaAsc(Long piscinaId);
}
