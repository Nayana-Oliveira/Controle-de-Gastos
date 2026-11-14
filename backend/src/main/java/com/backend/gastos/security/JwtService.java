package com.backend.gastos.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

// Gera o token do login e confere se o token que chega nas requisições é verdadeiro
@Service
public class JwtService {

    private final SecretKey chave;
    private final long expiracaoMs;

    // Os valores vem do application.properties
    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.expiration-ms}") long expiracaoMs) {
        this.chave = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiracaoMs = expiracaoMs;
    }

    // Chamado no login, cria o token com o id do usuário dentro
    public String gerarToken(Long usuarioId) {
        Date agora = new Date();

        return Jwts.builder()
                .subject(String.valueOf(usuarioId))
                .issuedAt(agora)
                .expiration(new Date(agora.getTime() + expiracaoMs))
                .signWith(chave)
                .compact();
    }

    // Lê o id do usuário que está dentro do token
    public Long extrairUsuarioId(String token) {
        return Long.valueOf(lerConteudo(token).getSubject());
    }

    // true se a assinatura bate e o token não expirou
    public boolean tokenValido(String token) {
        try {
            lerConteudo(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Confere a assinatura com a nossa chave e devolve o conteúdo do token
    private Claims lerConteudo(String token) {
        return Jwts.parser()
                .verifyWith(chave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}