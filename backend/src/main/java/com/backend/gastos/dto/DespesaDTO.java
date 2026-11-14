package com.backend.gastos.dto;


import java.math.BigDecimal;
import java.time.LocalDate;

import com.backend.gastos.model.Despesa;
import com.backend.gastos.model.TipoTransacao;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

// O que o app envia e recebe nas telas de despesa (Home e Formulário)
public record DespesaDTO(

        Long id,

        @NotBlank(message = "A descrição é obrigatória")
        @Size(max = 255, message = "A descrição pode ter no máximo 255 caracteres")
        String descricao,

        @NotNull(message = "O valor é obrigatório")
        @Positive(message = "O valor deve ser maior que zero")
        @Digits(integer = 8, fraction = 2, message = "O valor deve ter até 8 dígitos e 2 casas decimais")
        BigDecimal valor,

        @NotNull(message = "O tipo é obrigatório (RECEITA ou DESPESA)")
        TipoTransacao tipo,

        @NotBlank(message = "A categoria é obrigatória")
        @Size(max = 255, message = "A categoria pode ter no máximo 255 caracteres")
        String categoria,

        @NotNull(message = "A data é obrigatória")
        LocalDate data

) {

    // O dono (usuario) nunca vem do corpo da requisição, o service pega do token
    public Despesa toEntity() {
        Despesa despesa = new Despesa();

        despesa.setDescricao(descricao);
        despesa.setValor(valor);
        despesa.setTipo(tipo);
        despesa.setCategoria(categoria);
        despesa.setData(data);

        return despesa;
    }

    public static DespesaDTO fromEntity(Despesa despesa) {
        return new DespesaDTO(
                despesa.getId(),
                despesa.getDescricao(),
                despesa.getValor(),
                despesa.getTipo(),
                despesa.getCategoria(),
                despesa.getData()
        );
    }
}
