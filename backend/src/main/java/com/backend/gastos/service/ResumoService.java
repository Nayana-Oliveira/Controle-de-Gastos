package com.backend.gastos.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DateTimeException;
import java.time.YearMonth;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.backend.gastos.dto.CategoriaResumo;
import com.backend.gastos.dto.ResumoResponse;
import com.backend.gastos.model.TipoTransacao;
import com.backend.gastos.repository.DespesaRepository;
import com.backend.gastos.repository.TotalPorCategoria;
import com.backend.gastos.repository.UsuarioRepository;

@Service
public class ResumoService {

    private final DespesaRepository despesaRepository;
    private final UsuarioRepository usuarioRepository;

    public ResumoService(DespesaRepository despesaRepository, UsuarioRepository usuarioRepository) {
        this.despesaRepository = despesaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Long buscarUsuarioId(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado"))
                .getId();
    }

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

    private YearMonth definirPeriodo(Integer mes, Integer ano) {
        YearMonth hoje = YearMonth.now();
        try {
            return YearMonth.of(
                    ano != null ? ano : hoje.getYear(),
                    mes != null ? mes : hoje.getMonthValue());
        } catch (DateTimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mês ou ano inválido");
        }
    }

    private BigDecimal percentual(BigDecimal valor, BigDecimal total) {
        if (total.signum() == 0) {
            return BigDecimal.ZERO;
        }
        return valor.multiply(BigDecimal.valueOf(100)).divide(total, 1, RoundingMode.HALF_UP);
    }
}