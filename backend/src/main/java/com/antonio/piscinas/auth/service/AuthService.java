package com.antonio.piscinas.auth.service;

import com.antonio.piscinas.auth.dto.AuthResponseDto;
import com.antonio.piscinas.auth.dto.LoginRequestDto;

public interface AuthService {

    AuthResponseDto login(LoginRequestDto dto);
}