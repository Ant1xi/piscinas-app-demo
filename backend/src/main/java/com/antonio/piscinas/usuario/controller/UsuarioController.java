package com.antonio.piscinas.usuario.controller;

import com.antonio.piscinas.usuario.dto.UsuarioPasswordResetDto;
import com.antonio.piscinas.usuario.dto.UsuarioPasswordUpdateDto;
import com.antonio.piscinas.usuario.dto.UsuarioRequestDto;
import com.antonio.piscinas.usuario.dto.UsuarioResponseDto;
import com.antonio.piscinas.usuario.dto.UsuarioUpdateDto;
import com.antonio.piscinas.usuario.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public List<UsuarioResponseDto> findAll() {
        return usuarioService.findAll();
    }

    @GetMapping("/{id}")
    public UsuarioResponseDto findById(@PathVariable Long id) {
        return usuarioService.findById(id);
    }

    @GetMapping("/socorristas")
    public List<UsuarioResponseDto> findSocorristas() {
        return usuarioService.findSocorristas();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponseDto create(@Valid @RequestBody UsuarioRequestDto dto) {
        return usuarioService.create(dto);
    }

    @PutMapping("/{id}")
    public UsuarioResponseDto update(@PathVariable Long id,
                                     @Valid @RequestBody UsuarioUpdateDto dto) {
        return usuarioService.update(id, dto);
    }

    @PatchMapping("/{id}/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updatePassword(@PathVariable Long id,
                               @Valid @RequestBody UsuarioPasswordUpdateDto dto) {
        usuarioService.updatePassword(id, dto);
    }

    @PatchMapping("/{id}/password-reset")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetPassword(@PathVariable Long id,
                              @Valid @RequestBody UsuarioPasswordResetDto dto) {
        usuarioService.resetPassword(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        usuarioService.delete(id);
    }

    @PostMapping("/{id}/foto")
    public ResponseEntity<UsuarioResponseDto> subirFoto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(usuarioService.subirFoto(id, file));
    }
}