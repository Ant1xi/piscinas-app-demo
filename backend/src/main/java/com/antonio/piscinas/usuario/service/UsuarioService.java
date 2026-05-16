package com.antonio.piscinas.usuario.service;

import com.antonio.piscinas.usuario.dto.UsuarioPasswordResetDto;
import com.antonio.piscinas.usuario.dto.UsuarioPasswordUpdateDto;
import com.antonio.piscinas.usuario.dto.UsuarioRequestDto;
import com.antonio.piscinas.usuario.dto.UsuarioResponseDto;
import com.antonio.piscinas.usuario.dto.UsuarioUpdateDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UsuarioService {

    List<UsuarioResponseDto> findAll();

    UsuarioResponseDto findById(Long id);

    UsuarioResponseDto create(UsuarioRequestDto dto);

    UsuarioResponseDto update(Long id, UsuarioUpdateDto dto);

    List<UsuarioResponseDto> findSocorristas();

    void updatePassword(Long id, UsuarioPasswordUpdateDto dto);

    void resetPassword(Long id, UsuarioPasswordResetDto dto);

    void delete(Long id);

    UsuarioResponseDto subirFoto(Long id, MultipartFile file);
}