package com.backend.gastos.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.backend.gastos.model.TipoTransacao;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record DespesaRequest(

        @NotBlank(message = "A descrição é obrigatória")
        String descricao,

        @NotNull(message = "O valor é obrigatório")
        @Positive(message = "O valor deve ser maior que zero")
        BigDecimal valor,

        @NotNull(message = "O tipo é obrigatório (RECEITA ou DESPESA)")
        TipoTransacao tipo,

        @NotBlank(message = "A categoria é obrigatória")
        String categoria,

        @NotNull(message = "A data é obrigatória")
        LocalDate data
) {}