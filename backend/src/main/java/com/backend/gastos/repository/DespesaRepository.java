package com.backend.gastos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.gastos.model.Despesa;

public interface DespesaRepository extends JpaRepository<Despesa, Long> {

    List<Despesa> findByUsuarioId(Long usuarioId);
}