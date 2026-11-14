package com.backend.gastos.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Roda em toda requisição, lê o token, confere e diz ao Spring quem está logado
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // O app manda o token no cabeçalho, Authorization: Bearer <token>
        String cabecalho = request.getHeader("Authorization");

        if (cabecalho != null && cabecalho.startsWith("Bearer ")) {
            String token = cabecalho.substring(7);

            if (jwtService.tokenValido(token)) {
                Long usuarioId = jwtService.extrairUsuarioId(token);

                // Marca a requisição como autenticada, com o id do usuário como "nome"
                UsernamePasswordAuthenticationToken autenticacao =
                        new UsernamePasswordAuthenticationToken(String.valueOf(usuarioId), null, List.of());

                SecurityContextHolder.getContext().setAuthentication(autenticacao);
            }
        }

        // Segue o caminho, passa a requisição para o próximo da fila
        filterChain.doFilter(request, response);
    }
}