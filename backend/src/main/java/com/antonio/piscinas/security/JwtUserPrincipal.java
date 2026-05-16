package com.antonio.piscinas.security;

public record JwtUserPrincipal(
        Long userId,
        String email,
        String rol
) {
}