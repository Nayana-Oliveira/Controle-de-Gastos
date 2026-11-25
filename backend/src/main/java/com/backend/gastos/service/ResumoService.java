package com.backend.gastos.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DateTimeException;
import java.time.YearMonth;
import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.gastos.dto.CategoriaResumo;
import com.backend.gastos.dto.ResumoResponse;
import com.backend.gastos.exception.RequisicaoInvalidaException;
import com.backend.gastos.model.TipoTransacao;
import com.backend.gastos.repository.DespesaRepository;
import com.backend.gastos.repository.TotalPorCategoria;

@Service
public class ResumoService {

    private final DespesaRepository despesaRepository;

    public ResumoService(DespesaRepository despesaRepository) {
        this.despesaRepository = despesaRepository;
    }

    // Total gasto no mês e total por categoria (só despesas, receita não conta como gasto)
    public ResumoResponse gerarResumo(Long usuarioId, Integer mes, Integer ano) {
        YearMonth periodo = definirPeriodo(mes, ano);

        List<TotalPorCategoria> linhas = despesaRepository.somarPorCategoria(
                usuarioId, TipoTransacao.DESPESA, periodo.atDay(1), periodo.atEndOfMonth());

        BigDecimal totalGasto = linhas.stream()
                .map(TotalPorCategoria::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<CategoriaResumo> categorias = linhas.stream()
                .map(l -> new CategoriaResumo(l.getCategoria(), l.getTotal(), percentual(l.getTotal(), totalGasto)))
                .toList();

        return new ResumoResponse(periodo.getMonthValue(), periodo.getYear(), totalGasto, categorias);
    }

    // Sem mês e ano, usa o mês atual
    private YearMonth definirPeriodo(Integer mes, Integer ano) {
        YearMonth hoje = YearMonth.now();
        try {
            return YearMonth.of(
                    ano != null ? ano : hoje.getYear(),
                    mes != null ? mes : hoje.getMonthValue());
        } catch (DateTimeException e) {
            throw new RequisicaoInvalidaException("Mês ou ano inválido");
        }
    }

    private BigDecimal percentual(BigDecimal valor, BigDecimal total) {
        if (total.signum() == 0) {
            return BigDecimal.ZERO;
        }
        return valor.multiply(BigDecimal.valueOf(100)).divide(total, 1, RoundingMode.HALF_UP);
    }
}