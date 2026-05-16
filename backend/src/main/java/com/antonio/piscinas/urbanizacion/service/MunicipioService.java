package com.antonio.piscinas.urbanizacion.service;

import com.antonio.piscinas.urbanizacion.dto.MunicipioResponseDto;

import java.util.List;

public interface MunicipioService {

    List<MunicipioResponseDto> findAll();

    MunicipioResponseDto findById(Long id);

    List<MunicipioResponseDto> findByProvinciaId(Long provinciaId);
}