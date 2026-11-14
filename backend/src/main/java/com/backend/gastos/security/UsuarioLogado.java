package com.backend.gastos.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

// Diz quem está fazendo o pedido a partir do token, é daqui que vem o "dono" das despesas
@Component
public class UsuarioLogado {

    // O id do usuário fica guardado no subject do token (JWT)
    public Long getId() {
        Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
        return Long.valueOf(autenticacao.getName());
    }
}
