package com.backend.gastos.exception;

public record ErroResposta(
        String timestamp,
        int status,
        String erro,
        String mensagem,
        String caminho
) {
}
