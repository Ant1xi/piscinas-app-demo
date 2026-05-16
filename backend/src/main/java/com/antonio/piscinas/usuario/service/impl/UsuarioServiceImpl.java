package com.antonio.piscinas.usuario.service.impl;

import com.antonio.piscinas.common.exception.BadRequestException;
import com.antonio.piscinas.common.exception.ResourceNotFoundException;
import com.antonio.piscinas.common.util.ImageUtils;
import com.antonio.piscinas.usuario.dto.UsuarioMapper;
import com.antonio.piscinas.usuario.dto.UsuarioPasswordResetDto;
import com.antonio.piscinas.usuario.dto.UsuarioPasswordUpdateDto;
import com.antonio.piscinas.usuario.dto.UsuarioRequestDto;
import com.antonio.piscinas.usuario.dto.UsuarioResponseDto;
import com.antonio.piscinas.usuario.dto.UsuarioUpdateDto;
import com.antonio.piscinas.usuario.entity.Rol;
import com.antonio.piscinas.usuario.entity.Usuario;
import com.antonio.piscinas.usuario.entity.UsuarioRol;
import com.antonio.piscinas.usuario.entity.UsuarioRolId;
import com.antonio.piscinas.usuario.repository.UsuarioRepository;
import com.antonio.piscinas.usuario.repository.UsuarioRolRepository;
import com.antonio.piscinas.usuario.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioRolRepository usuarioRolRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UsuarioResponseDto> findAll() {
        return usuarioRepository.findAll()
                .stream()
                .map(usuario -> {
                    Set<UsuarioRol> roles = new HashSet<>(usuarioRolRepository.findByUsuario(usuario));
                    return UsuarioMapper.toDto(usuario, roles);
                })
                .toList();
    }

    @Override
    public UsuarioResponseDto findById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        Set<UsuarioRol> roles = new HashSet<>(usuarioRolRepository.findByUsuario(usuario));
        return UsuarioMapper.toDto(usuario, roles);
    }

    @Override
    @Transactional
    public UsuarioResponseDto create(UsuarioRequestDto dto) {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Ya existe un usuario con ese email");
        }

        Usuario usuario = Usuario.builder()
                .nombre(dto.getNombre())
                .apellidos(dto.getApellidos())
                .email(dto.getEmail())
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .telefono(dto.getTelefono())
                .activo(dto.getActivo() != null ? dto.getActivo() : true)
                .build();

        Usuario guardado = usuarioRepository.save(usuario);

        UsuarioRol usuarioRol = UsuarioRol.builder()
                .id(new UsuarioRolId(guardado.getId(), dto.getRol()))
                .usuario(guardado)
                .build();

        usuarioRolRepository.save(usuarioRol);

        Set<UsuarioRol> roles = new HashSet<>();
        roles.add(usuarioRol);

        return UsuarioMapper.toDto(guardado, roles);
    }

    @Override
    @Transactional
    public UsuarioResponseDto update(Long id, UsuarioUpdateDto dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        boolean emailOcupadoPorOtro = usuarioRepository.findByEmail(dto.getEmail())
                .map(u -> !u.getId().equals(id))
                .orElse(false);

        if (emailOcupadoPorOtro) {
            throw new BadRequestException("Ya existe otro usuario con ese email");
        }

        usuario.setNombre(dto.getNombre());
        usuario.setApellidos(dto.getApellidos());
        usuario.setEmail(dto.getEmail());
        usuario.setTelefono(dto.getTelefono());
        usuario.setActivo(dto.getActivo() != null ? dto.getActivo() : usuario.getActivo());

        Usuario actualizado = usuarioRepository.save(usuario);

        usuarioRolRepository.deleteByUsuario(actualizado);

        UsuarioRol nuevoRol = UsuarioRol.builder()
                .id(new UsuarioRolId(actualizado.getId(), dto.getRol()))
                .usuario(actualizado)
                .build();

        usuarioRolRepository.save(nuevoRol);

        Set<UsuarioRol> roles = new HashSet<>();
        roles.add(nuevoRol);

        return UsuarioMapper.toDto(actualizado, roles);
    }

    @Override
    @Transactional
    public void updatePassword(Long id, UsuarioPasswordUpdateDto dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        if (!passwordEncoder.matches(dto.getPasswordActual(), usuario.getPasswordHash())) {
            throw new BadRequestException("La contraseña actual no es correcta");
        }

        usuario.setPasswordHash(passwordEncoder.encode(dto.getNuevaPassword()));
        usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public void resetPassword(Long id, UsuarioPasswordResetDto dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        usuario.setPasswordHash(passwordEncoder.encode(dto.getNuevaPassword()));
        usuarioRepository.save(usuario);
    }

    @Override
    public List<UsuarioResponseDto> findSocorristas() {
        return usuarioRolRepository.findByIdRol(Rol.SOCORRISTA)
                .stream()
                .map(UsuarioRol::getUsuario)
                .filter(usuario -> Boolean.TRUE.equals(usuario.getActivo()))
                .distinct()
                .map(usuario -> {
                    Set<UsuarioRol> roles = new HashSet<>(usuarioRolRepository.findByUsuario(usuario));
                    return UsuarioMapper.toDto(usuario, roles);
                })
                .toList();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public UsuarioResponseDto subirFoto(Long id, MultipartFile file) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("La imagen es obligatoria");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException(
                "La imagen no puede superar 5MB. Tamaño recibido: " + (file.getSize() / 1024 / 1024) + "MB"
            );
        }

        String contentType = file.getContentType();
        if (contentType == null || !List.of("image/jpeg", "image/png", "image/webp").contains(contentType)) {
            throw new BadRequestException("Formato no válido. Solo se aceptan JPG, PNG o WebP.");
        }

        try {
            String carpeta = "uploads/usuarios/";
            Files.createDirectories(Paths.get(carpeta));

            String nombreArchivo = UUID.randomUUID() + ".jpg";
            Path rutaDestino = Paths.get(carpeta, nombreArchivo);
            ImageUtils.procesarYGuardar(file, rutaDestino, 800, 800, 0.82);

            usuario.setFotoPerfil(carpeta + nombreArchivo);
            Usuario actualizado = usuarioRepository.save(usuario);

            Set<UsuarioRol> roles = new HashSet<>(usuarioRolRepository.findByUsuario(actualizado));
            return UsuarioMapper.toDto(actualizado, roles);

        } catch (IOException e) {
            throw new BadRequestException("Error al guardar la foto de perfil");
        }
    }
}