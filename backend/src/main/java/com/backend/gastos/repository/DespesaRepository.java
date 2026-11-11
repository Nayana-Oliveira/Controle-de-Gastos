package com.backend.gastos.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backend.gastos.model.Despesa;
import com.backend.gastos.model.TipoTransacao;

public interface DespesaRepository extends JpaRepository<Despesa, Long> {

    List<Despesa> findByUsuarioId(Long usuarioId);

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