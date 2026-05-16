package com.antonio.piscinas.auth.service.impl;

import com.antonio.piscinas.auth.dto.AuthResponseDto;
import com.antonio.piscinas.auth.dto.LoginRequestDto;
import com.antonio.piscinas.auth.service.AuthService;
import com.antonio.piscinas.common.exception.BadRequestException;
import com.antonio.piscinas.security.JwtTokenProvider;
import com.antonio.piscinas.usuario.entity.Usuario;
import com.antonio.piscinas.usuario.entity.UsuarioRol;
import com.antonio.piscinas.usuario.repository.UsuarioRepository;
import com.antonio.piscinas.usuario.repository.UsuarioRolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioRolRepository usuarioRolRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public AuthResponseDto login(LoginRequestDto dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new BadRequestException("Credenciales incorrectas"));

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw new BadRequestException("El usuario está inactivo");
        }

        if (!passwordEncoder.matches(dto.getPassword(), usuario.getPasswordHash())) {
            throw new BadRequestException("Credenciales incorrectas");
        }

        List<UsuarioRol> roles = usuarioRolRepository.findByUsuario(usuario);

        String rol = roles.isEmpty()
                ? null
                : roles.get(0).getId().getRol().name();

        String token = jwtTokenProvider.generateToken(
                usuario.getId(),
                usuario.getEmail(),
                rol
        );

        return AuthResponseDto.builder()
                .token(token)
                .tokenType("Bearer")
                .usuarioId(usuario.getId())
                .nombre(usuario.getNombre())
                .apellidos(usuario.getApellidos())
                .email(usuario.getEmail())
                .telefono(usuario.getTelefono())
                .activo(usuario.getActivo())
                .rol(rol)
                .fotoPerfil(usuario.getFotoPerfil())
                .build();
    }
}