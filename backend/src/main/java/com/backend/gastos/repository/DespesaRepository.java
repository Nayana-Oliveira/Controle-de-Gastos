package com.backend.gastos.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backend.gastos.model.Despesa;
import com.backend.gastos.model.TipoTransacao;

public interface DespesaRepository extends JpaRepository<Despesa, Long> {

    List<Despesa> findByUsuarioId(Long usuarioId);

    // Home: as despesas do usuário, da mais recente para a mais antiga
    List<Despesa> findByUsuarioIdOrderByDataDescIdDesc(Long usuarioId);

    // Home: filtro por categoria (ignora maiúsculas e minúsculas)
    List<Despesa> findByUsuarioIdAndCategoriaIgnoreCaseOrderByDataDescIdDesc(Long usuarioId, String categoria);

    // Só acha a despesa se ela for do usuário, assim ninguém mexe na despesa dos
    // outros
    Optional<Despesa> findByIdAndUsuarioId(Long id, Long usuarioId);

    // Resumo: total gasto por categoria no período
    @Query("""
            SELECT d.categoria AS categoria, SUM(d.valor) AS total
            FROM Despesa d
            WHERE d.usuario.id = :usuarioId
              AND d.tipo = :tipo
              AND d.data BETWEEN :inicio AND :fim
            GROUP BY d.categoria
            ORDER BY SUM(d.valor) DESC
            """)
    List<TotalPorCategoria> somarPorCategoria(@Param("usuarioId") Long usuarioId,
            @Param("tipo") TipoTransacao tipo,
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim);
}