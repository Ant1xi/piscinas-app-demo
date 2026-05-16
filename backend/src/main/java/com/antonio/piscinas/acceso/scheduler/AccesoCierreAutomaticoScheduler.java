package com.antonio.piscinas.acceso.scheduler;

import com.antonio.piscinas.acceso.entity.Acceso;
import com.antonio.piscinas.acceso.repository.AccesoRepository;
import com.antonio.piscinas.audit.service.AuditLogService;
import com.antonio.piscinas.configuracion.repository.ConfiguracionSistemaRepository;
import com.antonio.piscinas.persona.entity.RegistroInvitados;
import com.antonio.piscinas.persona.repository.RegistroInvitadosRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AccesoCierreAutomaticoScheduler {

    private final AccesoRepository accesoRepository;
    private final RegistroInvitadosRepository registroInvitadosRepository;
    private final AuditLogService auditLogService;
    private final ConfiguracionSistemaRepository configuracionRepo;

    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void verificarCierreNocturno() {
        int hora = Integer.parseInt(
            configuracionRepo.findById("cierre_automatico_hora").map(c -> c.getValor()).orElse("23"));
        int minuto = Integer.parseInt(
            configuracionRepo.findById("cierre_automatico_minuto").map(c -> c.getValor()).orElse("59"));

        LocalTime ahora = LocalTime.now();
        if (ahora.getHour() != hora || ahora.getMinute() != minuto) return;

        cerrarAccesosDelDia();
    }

    private void cerrarAccesosDelDia() {
        LocalDateTime ahora = LocalDateTime.now();

        List<Acceso> accesosAbiertos = accesoRepository.findByHoraSalidaIsNull();
        for (Acceso acceso : accesosAbiertos) {
            acceso.setHoraSalida(ahora);
            String comentarioActual = acceso.getComentario();
            acceso.setComentario(
                (comentarioActual == null || comentarioActual.isBlank())
                    ? "Salida automática por cierre diario"
                    : comentarioActual + " | Salida automática por cierre diario"
            );
            auditLogService.registrar(
                null, "sistema",
                "SALIDA_AUTOMATICA", "Acceso",
                acceso.getId().toString(),
                "Cierre nocturno: " + acceso.getPersona().getNombre() + " "
                    + acceso.getPersona().getApellidos()
                    + " en " + acceso.getPiscina().getNombre()
            );
        }
        accesoRepository.saveAll(accesosAbiertos);

        List<RegistroInvitados> invitadosAbiertos = registroInvitadosRepository.findByHoraSalidaIsNull();
        for (RegistroInvitados reg : invitadosAbiertos) {
            reg.setHoraSalida(ahora);
            String comentarioActual = reg.getComentario();
            reg.setComentario(
                (comentarioActual == null || comentarioActual.isBlank())
                    ? "Salida automática por cierre diario"
                    : comentarioActual + " | Salida automática por cierre diario"
            );
            auditLogService.registrar(
                null, "sistema",
                "SALIDA_AUTOMATICA", "Invitados",
                reg.getId().toString(),
                "Cierre nocturno: " + reg.getCantidadInvitados() + " invitados"
                    + " vivienda " + reg.getVivienda().getIdentificador()
                    + " en " + reg.getPiscina().getNombre()
            );
        }
        registroInvitadosRepository.saveAll(invitadosAbiertos);

        System.out.println("[CierreNocturno] Cerrados " + accesosAbiertos.size()
            + " accesos y " + invitadosAbiertos.size() + " registros de invitados.");
    }
}
