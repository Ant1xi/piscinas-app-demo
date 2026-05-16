package com.antonio.piscinas.piscina.controller;

import com.antonio.piscinas.piscina.dto.PiscinaRequestDto;
import com.antonio.piscinas.piscina.dto.PiscinaResponseDto;
import com.antonio.piscinas.piscina.service.PiscinaService;
import com.antonio.piscinas.usuario.dto.UsuarioResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/piscinas")
@RequiredArgsConstructor
public class PiscinaController {

    private final PiscinaService piscinaService;

    @GetMapping
    public List<PiscinaResponseDto> findAll() {
        return piscinaService.findAll();
    }

    @GetMapping("/{id}")
    public PiscinaResponseDto findById(@PathVariable Long id) {
        return piscinaService.findById(id);
    }

    @GetMapping("/urbanizacion/{urbanizacionId}")
    public List<PiscinaResponseDto> findByUrbanizacionId(@PathVariable Long urbanizacionId) {
        return piscinaService.findByUrbanizacionId(urbanizacionId);
    }

    @GetMapping("/{id}/socorristas")
    public List<UsuarioResponseDto> findSocorristasByPiscina(@PathVariable Long id) {
        return piscinaService.findSocorristasByPiscina(id);
    }

    @PostMapping("/{piscinaId}/socorristas/{usuarioId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void asignarSocorrista(
            @PathVariable Long piscinaId,
            @PathVariable Long usuarioId,
            Authentication authentication
    ) {
        piscinaService.asignarSocorrista(piscinaId, usuarioId, authentication.getName());
    }

    @DeleteMapping("/{piscinaId}/socorristas/{usuarioId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void quitarSocorrista(
            @PathVariable Long piscinaId,
            @PathVariable Long usuarioId
    ) {
        piscinaService.quitarSocorrista(piscinaId, usuarioId);
    }

    @PostMapping("/{id}/imagen")
    public ResponseEntity<PiscinaResponseDto> subirImagenPiscina(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        PiscinaResponseDto piscinaActualizada = piscinaService.subirImagenPiscina(id, file);
        return ResponseEntity.ok(piscinaActualizada);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PiscinaResponseDto create(@Valid @RequestBody PiscinaRequestDto dto) {
        return piscinaService.create(dto);
    }

    @PutMapping("/{id}")
    public PiscinaResponseDto update(@PathVariable Long id,
                                     @Valid @RequestBody PiscinaRequestDto dto) {
        return piscinaService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        piscinaService.delete(id);
    }
}