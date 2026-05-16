package com.antonio.piscinas.piscina.repository;

import com.antonio.piscinas.piscina.entity.SocorristaPiscina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SocorristaPiscinaRepository extends JpaRepository<SocorristaPiscina, Long> {

    @Query("""
        SELECT sp FROM SocorristaPiscina sp
        JOIN FETCH sp.socorrista s
        JOIN FETCH sp.piscina p
        JOIN FETCH sp.asignadoPor a
        WHERE p.id = :piscinaId AND sp.activo = true
    """)
    List<SocorristaPiscina> findActivosByPiscinaIdWithRelations(Long piscinaId);

    @Query("""
        SELECT sp FROM SocorristaPiscina sp
        JOIN FETCH sp.socorrista s
        JOIN FETCH sp.piscina p
        JOIN FETCH sp.asignadoPor a
        WHERE s.id = :socorristaId AND sp.activo = true
    """)
    List<SocorristaPiscina> findActivosBySocorristaIdWithRelations(Long socorristaId);

    Optional<SocorristaPiscina> findByPiscinaIdAndSocorristaId(Long piscinaId, Long socorristaId);

    boolean existsByPiscinaIdAndSocorristaIdAndActivoTrue(Long piscinaId, Long socorristaId);

    List<SocorristaPiscina> findByPiscinaIdAndActivoTrue(Long piscinaId);
}
