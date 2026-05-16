package com.antonio.piscinas.piscina.service;

import com.antonio.piscinas.piscina.dto.PiscinaRequestDto;
import com.antonio.piscinas.piscina.dto.PiscinaResponseDto;
import com.antonio.piscinas.usuario.dto.UsuarioResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PiscinaService {

    List<PiscinaResponseDto> findAll();

    PiscinaResponseDto findById(Long id);

    List<PiscinaResponseDto> findByUrbanizacionId(Long urbanizacionId);

    PiscinaResponseDto create(PiscinaRequestDto dto);

    PiscinaResponseDto update(Long id, PiscinaRequestDto dto);

    PiscinaResponseDto subirImagenPiscina(Long id, MultipartFile file);

    List<UsuarioResponseDto> findSocorristasByPiscina(Long piscinaId);

    void asignarSocorrista(Long piscinaId, Long socorristaId, String emailAdmin);

    void quitarSocorrista(Long piscinaId, Long socorristaId);

    void delete(Long id);
}