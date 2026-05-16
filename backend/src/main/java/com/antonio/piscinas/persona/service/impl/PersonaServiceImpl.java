package com.antonio.piscinas.persona.service.impl;

import com.antonio.piscinas.common.exception.BadRequestException;
import com.antonio.piscinas.common.exception.ResourceNotFoundException;
import com.antonio.piscinas.common.util.ImageUtils;
import com.antonio.piscinas.estructura.entity.Vivienda;
import com.antonio.piscinas.estructura.repository.ViviendaRepository;
import com.antonio.piscinas.persona.dto.PersonaMapper;
import com.antonio.piscinas.persona.dto.PersonaRequestDto;
import com.antonio.piscinas.persona.dto.PersonaResponseDto;
import com.antonio.piscinas.persona.entity.Persona;
import com.antonio.piscinas.persona.repository.PersonaRepository;
import com.antonio.piscinas.persona.repository.ViviendaPersonaRepository;
import com.antonio.piscinas.persona.service.PersonaService;
import com.antonio.piscinas.piscina.repository.PiscinaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PersonaServiceImpl implements PersonaService {

    private final PersonaRepository personaRepository;
    private final PiscinaRepository piscinaRepository;
    private final ViviendaRepository viviendaRepository;
    private final ViviendaPersonaRepository viviendaPersonaRepository;

    @Override
    public List<PersonaResponseDto> findAll() {
        return personaRepository.findAll()
                .stream()
                .map(PersonaMapper::toDto)
                .toList();
    }

    @Override
    public PersonaResponseDto findById(Long id) {
        Persona persona = personaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Persona no encontrada con id: " + id));

        return PersonaMapper.toDto(persona);
    }

    @Override
    @Transactional
    public PersonaResponseDto create(PersonaRequestDto dto) {
        if (dto.getDni() != null && !dto.getDni().isBlank() && personaRepository.existsByDni(dto.getDni())) {
            throw new BadRequestException("Ya existe una persona con ese DNI");
        }

        Persona persona = PersonaMapper.toEntity(dto);
        Persona guardada = personaRepository.save(persona);

        return PersonaMapper.toDto(guardada);
    }

    @Override
    @Transactional
    public PersonaResponseDto update(Long id, PersonaRequestDto dto) {
        Persona persona = personaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Persona no encontrada con id: " + id));

        if (dto.getDni() != null && !dto.getDni().isBlank()) {
            boolean existeOtra = personaRepository.findByDni(dto.getDni())
                    .map(p -> !p.getId().equals(id))
                    .orElse(false);

            if (existeOtra) {
                throw new BadRequestException("Ya existe otra persona con ese DNI");
            }
        }

        PersonaMapper.updateEntity(persona, dto);
        personaRepository.save(persona);

        return PersonaMapper.toDto(persona);
    }

    @Override
    @Transactional
    public PersonaResponseDto saveFoto(Long id, MultipartFile file) {
        Persona persona = personaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Persona no encontrada con id: " + id));

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("La imagen es obligatoria");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("La imagen no puede superar 5MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !List.of("image/jpeg", "image/png", "image/webp").contains(contentType)) {
            throw new BadRequestException("Formato no válido. Solo se aceptan JPG, PNG o WebP.");
        }

        try {
            String carpeta = "uploads/personas/";
            Files.createDirectories(Paths.get(carpeta));

            String nombreArchivo = UUID.randomUUID() + ".jpg";
            Path rutaDestino = Paths.get(carpeta, nombreArchivo);
            ImageUtils.procesarYGuardar(file, rutaDestino, 800, 800, 0.82);

            persona.setFotoPerfil(carpeta + nombreArchivo);
            return PersonaMapper.toDto(personaRepository.save(persona));
        } catch (IOException e) {
            throw new BadRequestException("Error al guardar la foto de perfil");
        }
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Persona persona = personaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Persona no encontrada con id: " + id));

        if (viviendaPersonaRepository.existsByPersona(persona)) {
            throw new BadRequestException("No se puede eliminar la persona porque está asignada a una o más viviendas");
        }

        personaRepository.delete(persona);
    }

    @Override
    public List<PersonaResponseDto> buscarPorPiscinaYTexto(Long piscinaId, String texto) {
        piscinaRepository.findById(piscinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Piscina no encontrada con id: " + piscinaId));

        if (texto == null || texto.isBlank()) {
            texto = "";
        }

        List<Object[]> rows = personaRepository.buscarConViviendaPorPiscinaYTexto(piscinaId, texto.trim());

        // La query puede devolver varias filas por persona (una por vivienda).
        // Usamos LinkedHashMap para mantener el orden y quedarnos con la primera vivienda
        // de cada persona (que es la principal gracias al ORDER BY vp.principal DESC).
        Map<Long, PersonaResponseDto> vistos = new LinkedHashMap<>();
        for (Object[] row : rows) {
            Persona p = (Persona) row[0];
            Vivienda v = (Vivienda) row[1];
            vistos.putIfAbsent(p.getId(), PersonaMapper.toDto(p, v));
        }

        return new ArrayList<>(vistos.values());
    }

    @Override
    public List<PersonaResponseDto> findByViviendaId(Long viviendaId) {
        viviendaRepository.findById(viviendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Vivienda no encontrada con id: " + viviendaId));

        return personaRepository.findActivasByViviendaId(viviendaId)
                .stream()
                .map(PersonaMapper::toDto)
                .toList();
    }
}