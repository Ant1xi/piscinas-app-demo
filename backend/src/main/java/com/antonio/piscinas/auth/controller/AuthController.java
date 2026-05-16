package com.antonio.piscinas.auth.controller;

import com.antonio.piscinas.auth.dto.AuthResponseDto;
import com.antonio.piscinas.auth.dto.LoginRequestDto;
import com.antonio.piscinas.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public AuthResponseDto login(@Valid @RequestBody LoginRequestDto dto) {
        return authService.login(dto);
    }
}