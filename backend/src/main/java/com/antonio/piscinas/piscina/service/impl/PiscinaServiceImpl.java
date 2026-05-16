package com.antonio.piscinas.piscina.service.impl;

import com.antonio.piscinas.common.exception.BadRequestException;
import com.antonio.piscinas.common.exception.ResourceNotFoundException;
import com.antonio.piscinas.common.util.ImageUtils;
import com.antonio.piscinas.piscina.dto.PiscinaMapper;
import com.antonio.piscinas.piscina.dto.PiscinaRequestDto;
import com.antonio.piscinas.piscina.dto.PiscinaResponseDto;
import com.antonio.piscinas.piscina.entity.Piscina;
import com.antonio.piscinas.piscina.repository.PiscinaRepository;
import com.antonio.piscinas.piscina.service.PiscinaService;
import com.antonio.piscinas.urbanizacion.entity.Urbanizacion;
import com.antonio.piscinas.urbanizacion.repository.UrbanizacionRepository;
import com.antonio.piscinas.piscina.entity.SocorristaPiscina;
import com.antonio.piscinas.piscina.repository.SocorristaPiscinaRepository;
import com.antonio.piscinas.usuario.dto.UsuarioMapper;
import com.antonio.piscinas.usuario.dto.UsuarioResponseDto;
import com.antonio.piscinas.usuario.entity.Rol;
import com.antonio.piscinas.usuario.entity.Usuario;
import com.antonio.piscinas.usuario.entity.UsuarioRol;
import com.antonio.piscinas.usuario.repository.UsuarioRepository;
import com.antonio.piscinas.usuario.repository.UsuarioRolRepository;

import java.util.HashSet;
import java.util.Set;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PiscinaServiceImpl implements PiscinaService {

    private final PiscinaRepository piscinaRepository;
    private final UrbanizacionRepository urbanizacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioRolRepository usuarioRolRepository;
    private final SocorristaPiscinaRepository socorristaPiscinaRepository;

    @Override
    public List<PiscinaResponseDto> findAll() {
        return piscinaRepository.findAllWithUrbanizacion()
                .stream()
                .map(PiscinaMapper::toDto)
                .toList();
    }

    @Override
    public PiscinaResponseDto findById(Long id) {
        Piscina piscina = piscinaRepository.findByIdWithUrbanizacion(id)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + id));

        return PiscinaMapper.toDto(piscina);
    }

    @Override
    public List<PiscinaResponseDto> findByUrbanizacionId(Long urbanizacionId) {
        Urbanizacion urbanizacion = urbanizacionRepository.findById(urbanizacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Urbanización no encontrada con id: " + urbanizacionId));

        return piscinaRepository.findByUrbanizacionWithMunicipio(urbanizacion)
                .stream()
                .map(PiscinaMapper::toDto)
                .toList();
    }
    @Override
    public PiscinaResponseDto create(PiscinaRequestDto dto) {
        Urbanizacion urbanizacion = urbanizacionRepository.findById(dto.getUrbanizacionId())
                .orElseThrow(() -> new ResourceNotFoundException("Urbanización no encontrada con id: " + dto.getUrbanizacionId()));

        if (piscinaRepository.existsByNombreAndUrbanizacion(dto.getNombre(), urbanizacion)) {
            throw new BadRequestException("Ya existe una piscina con ese nombre en la urbanización seleccionada");
        }

        Piscina piscina = PiscinaMapper.toEntity(dto, urbanizacion);
        Piscina guardada = piscinaRepository.save(piscina);

        return PiscinaMapper.toDto(guardada);
    }

    @Override
    public PiscinaResponseDto update(Long id, PiscinaRequestDto dto) {
        Piscina piscina = piscinaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + id));

        Urbanizacion urbanizacion = urbanizacionRepository.findById(dto.getUrbanizacionId())
                .orElseThrow(() -> new ResourceNotFoundException("Urbanización no encontrada con id: " + dto.getUrbanizacionId()));

        boolean existeOtraConMismoNombre = piscinaRepository.findByNombreAndUrbanizacion(dto.getNombre(), urbanizacion)
                .map(p -> !p.getId().equals(id))
                .orElse(false);

        if (existeOtraConMismoNombre) {
            throw new BadRequestException("Ya existe una piscina con ese nombre en la urbanización seleccionada");
        }

        PiscinaMapper.updateEntity(piscina, dto, urbanizacion);
        piscinaRepository.save(piscina);

        Piscina actualizada = piscinaRepository.findByIdWithUrbanizacion(id)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + id));

        return PiscinaMapper.toDto(actualizada);
    }

    @Override
    public PiscinaResponseDto subirImagenPiscina(Long id, MultipartFile file) {
        Piscina piscina = piscinaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + id));

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("La imagen es obligatoria");
        }

        String contentType = file.getContentType();

        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("El archivo debe ser una imagen");
        }

        try {
            String carpetaUploads = "uploads/piscinas/";
            Files.createDirectories(Paths.get(carpetaUploads));

            String nombreArchivo = UUID.randomUUID() + ".jpg";
            Path rutaDestino = Paths.get(carpetaUploads, nombreArchivo);
            ImageUtils.procesarYGuardar(file, rutaDestino, 1400, 900, 0.83);

            piscina.setRutaImagen(carpetaUploads + nombreArchivo);

            piscinaRepository.save(piscina);

            Piscina piscinaActualizada = piscinaRepository.findByIdWithUrbanizacion(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + id));

            return PiscinaMapper.toDto(piscinaActualizada);

        } catch (IOException e) {
            throw new BadRequestException("Error al guardar la imagen de la piscina");
        }
    }

    @Override
    public List<UsuarioResponseDto> findSocorristasByPiscina(Long piscinaId) {
        if (!piscinaRepository.existsById(piscinaId)) {
            throw new ResourceNotFoundException("Piscina no encontrada con id: " + piscinaId);
        }

        return socorristaPiscinaRepository.findByPiscinaIdAndActivoTrue(piscinaId)
                .stream()
                .map(SocorristaPiscina::getSocorrista)
                .map(usuario -> {
                    Set<UsuarioRol> roles = new HashSet<>(usuarioRolRepository.findByUsuario(usuario));
                    return UsuarioMapper.toDto(usuario, roles);
                })
                .toList();
    }

    @Override
    public void asignarSocorrista(Long piscinaId, Long socorristaId, String emailAdmin) {
        Piscina piscina = piscinaRepository.findById(piscinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + piscinaId));

        Usuario socorrista = usuarioRepository.findById(socorristaId)
                .orElseThrow(() -> new ResourceNotFoundException("Socorrista no encontrado con id: " + socorristaId));

        Usuario admin = usuarioRepository.findByEmail(emailAdmin)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador no encontrado"));

        boolean esSocorrista = usuarioRolRepository.findByUsuario(socorrista)
                .stream()
                .anyMatch(rol -> rol.getId().getRol() == Rol.SOCORRISTA);

        if (!esSocorrista) {
            throw new BadRequestException("El usuario seleccionado no tiene rol de socorrista");
        }

        if (!Boolean.TRUE.equals(socorrista.getActivo())) {
            throw new BadRequestException("El socorrista seleccionado no está activo");
        }

        SocorristaPiscina relacion = socorristaPiscinaRepository
                .findByPiscinaIdAndSocorristaId(piscinaId, socorristaId)
                .orElse(null);

        if (relacion != null) {
            if (Boolean.TRUE.equals(relacion.getActivo())) {
                throw new BadRequestException("El socorrista ya está asignado a esta piscina");
            }

            relacion.setActivo(true);
            relacion.setAsignadoPor(admin);
            relacion.setFechaAsignacion(java.time.LocalDate.now());
            socorristaPiscinaRepository.save(relacion);
            return;
        }

        SocorristaPiscina nuevaRelacion = SocorristaPiscina.builder()
                .piscina(piscina)
                .socorrista(socorrista)
                .asignadoPor(admin)
                .activo(true)
                .fechaAsignacion(java.time.LocalDate.now())
                .build();

        socorristaPiscinaRepository.save(nuevaRelacion);
    }

    @Override
    public void quitarSocorrista(Long piscinaId, Long socorristaId) {
        SocorristaPiscina relacion = socorristaPiscinaRepository
                .findByPiscinaIdAndSocorristaId(piscinaId, socorristaId)
                .orElseThrow(() -> new ResourceNotFoundException("El socorrista no está asignado a esta piscina"));

        relacion.setActivo(false);
        socorristaPiscinaRepository.save(relacion);
    }

    @Override
    public void delete(Long id) {
        if (!piscinaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Piscina no encontrada con id: " + id);
        }

        piscinaRepository.deleteById(id);
    }
}