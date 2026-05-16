package com.antonio.piscinas.usuario.repository;

import com.antonio.piscinas.usuario.entity.Rol;
import com.antonio.piscinas.usuario.entity.Usuario;
import com.antonio.piscinas.usuario.entity.UsuarioRol;
import com.antonio.piscinas.usuario.entity.UsuarioRolId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioRolRepository extends JpaRepository<UsuarioRol, UsuarioRolId> {

    List<UsuarioRol> findByUsuario(Usuario usuario);

    void deleteByUsuario(Usuario usuario);

    List<UsuarioRol> findByIdRol(Rol rol);
}