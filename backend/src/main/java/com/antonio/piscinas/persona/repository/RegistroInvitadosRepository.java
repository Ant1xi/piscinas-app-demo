package com.antonio.piscinas.persona.repository;

import com.antonio.piscinas.persona.entity.RegistroInvitados;
import com.antonio.piscinas.piscina.entity.Piscina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RegistroInvitadosRepository extends JpaRepository<RegistroInvitados, Long> {

    @Query("""
        SELECT r
        FROM RegistroInvitados r
        JOIN FETCH r.piscina p
        JOIN FETCH r.vivienda v
        JOIN FETCH r.registradoPor rp
        WHERE r.piscina = :piscina
          AND r.horaSalida IS NULL
        ORDER BY r.horaEntrada DESC
    """)
    List<RegistroInvitados> findActivosByPiscinaWithRelations(Piscina piscina);

    @Query("""
        SELECT r
        FROM RegistroInvitados r
        JOIN FETCH r.piscina p
        JOIN FETCH r.vivienda v
        JOIN FETCH r.registradoPor rp
        WHERE r.piscina = :piscina
        ORDER BY r.horaEntrada DESC
    """)
    List<RegistroInvitados> findByPiscinaWithRelations(Piscina piscina);

    List<RegistroInvitados> findByHoraSalidaIsNull();
}
