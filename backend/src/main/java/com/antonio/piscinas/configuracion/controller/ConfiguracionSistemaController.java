package com.antonio.piscinas.configuracion.controller;

import com.antonio.piscinas.configuracion.entity.ConfiguracionSistema;
import com.antonio.piscinas.configuracion.repository.ConfiguracionSistemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/configuracion")
@RequiredArgsConstructor
public class ConfiguracionSistemaController {

    private final ConfiguracionSistemaRepository repo;

    @GetMapping("/{clave}")
    public ResponseEntity<ConfiguracionSistema> get(@PathVariable String clave) {
        return repo.findById(clave)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{clave}")
    public ResponseEntity<ConfiguracionSistema> update(
            @PathVariable String clave,
            @RequestBody Map<String, String> body) {
        return repo.findById(clave).map(config -> {
            config.setValor(body.get("valor"));
            return ResponseEntity.ok(repo.save(config));
        }).orElse(ResponseEntity.notFound().build());
    }
}
