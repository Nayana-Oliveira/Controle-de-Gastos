package com.backend.gastos.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.gastos.model.Despesa;

public interface DespesaRepository extends JpaRepository<Despesa, Long> {

    List<Despesa> findByUsuarioId(Long usuarioId);

    // Home: as despesas do usuário, da mais recente para a mais antiga
    List<Despesa> findByUsuarioIdOrderByDataDescIdDesc(Long usuarioId);

    // Home: filtro por categoria (ignora maiúsculas e minúsculas)
    List<Despesa> findByUsuarioIdAndCategoriaIgnoreCaseOrderByDataDescIdDesc(Long usuarioId, String categoria);

    // Só acha a despesa se ela for do usuário, assim ninguém mexe na despesa dos outros
    Optional<Despesa> findByIdAndUsuarioId(Long id, Long usuarioId);
}