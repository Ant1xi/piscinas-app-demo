package com.antonio.piscinas.persona.service.impl;

import com.antonio.piscinas.common.exception.BadRequestException;
import com.antonio.piscinas.common.exception.ResourceNotFoundException;
import com.antonio.piscinas.estructura.entity.Vivienda;
import com.antonio.piscinas.estructura.repository.ViviendaRepository;
import com.antonio.piscinas.persona.dto.RegistroInvitadosEntradaRequestDto;
import com.antonio.piscinas.persona.dto.RegistroInvitadosMapper;
import com.antonio.piscinas.persona.dto.RegistroInvitadosResponseDto;
import com.antonio.piscinas.persona.dto.RegistroInvitadosSalidaRequestDto;
import com.antonio.piscinas.persona.entity.RegistroInvitados;
import com.antonio.piscinas.persona.repository.RegistroInvitadosRepository;
import com.antonio.piscinas.persona.service.RegistroInvitadosService;
import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.piscina.repository.PiscinaRepository;
import com.antonio.piscinas.security.AuthenticatedUserService;
import com.antonio.piscinas.usuario.entity.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistroInvitadosServiceImpl implements RegistroInvitadosService {

    private final RegistroInvitadosRepository registroRepository;
    private final PiscinaRepository piscinaRepository;
    private final ViviendaRepository viviendaRepository;
    private final AuthenticatedUserService authenticatedUserService;

    @Override
    public List<RegistroInvitadosResponseDto> findActivosByPiscinaId(Long piscinaId) {
        Piscina piscina = piscinaRepository.findById(piscinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + piscinaId));

        return registroRepository.findActivosByPiscinaWithRelations(piscina)
                .stream()
                .map(RegistroInvitadosMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public RegistroInvitadosResponseDto registrarEntrada(RegistroInvitadosEntradaRequestDto dto) {
        Piscina piscina = piscinaRepository.findById(dto.getPiscinaId())
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + dto.getPiscinaId()));

        Vivienda vivienda = viviendaRepository.findById(dto.getViviendaId())
                .orElseThrow(() -> new ResourceNotFoundException("Vivienda no encontrada con id: " + dto.getViviendaId()));

        // Verificar si la cantidad supera el límite configurado en la piscina
        int maxPermitido = piscina.getMaxInvitadosPorVivienda();
        boolean superaLimite = maxPermitido > 0 && dto.getCantidadInvitados() > maxPermitido;

        Usuario registradoPor = authenticatedUserService.getAuthenticatedUsuario();

        RegistroInvitados registro = RegistroInvitados.builder()
                .piscina(piscina)
                .vivienda(vivienda)
                .cantidadInvitados(dto.getCantidadInvitados())
                .registradoPor(registradoPor)
                .comentario(dto.getComentario())
                .superaLimite(superaLimite)
                .build();

        RegistroInvitados guardado = registroRepository.save(registro);

        RegistroInvitados conRelaciones = registroRepository.findById(guardado.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Registro no encontrado"));

        return RegistroInvitadosMapper.toDto(conRelaciones);
    }

    @Override
    @Transactional
    public RegistroInvitadosResponseDto registrarSalida(RegistroInvitadosSalidaRequestDto dto) {
        RegistroInvitados registro = registroRepository.findById(dto.getRegistroId())
                .orElseThrow(() -> new ResourceNotFoundException("Registro de invitados no encontrado con id: " + dto.getRegistroId()));

        if (registro.getHoraSalida() != null) {
            throw new BadRequestException("Este grupo de invitados ya registró su salida");
        }

        registro.setHoraSalida(LocalDateTime.now());
        registroRepository.save(registro);

        return RegistroInvitadosMapper.toDto(registro);
    }
}
