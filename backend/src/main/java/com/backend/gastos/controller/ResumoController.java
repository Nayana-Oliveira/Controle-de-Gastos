package com.backend.gastos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.gastos.dto.ResumoResponse;
import com.backend.gastos.security.UsuarioLogado;
import com.backend.gastos.service.ResumoService;

@RestController
@RequestMapping("/despesas")
public class ResumoController {

    private final ResumoService resumoService;
    private final UsuarioLogado usuarioLogado;

    public ResumoController(ResumoService resumoService, UsuarioLogado usuarioLogado) {
        this.resumoService = resumoService;
        this.usuarioLogado = usuarioLogado;
    }

    // Tela Resumo: GET /despesas/resumo ou GET /despesas/resumo?mes=11&ano=2026
    @GetMapping("/resumo")
    public ResponseEntity<ResumoResponse> resumo(@RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer ano) {
        return ResponseEntity.ok(resumoService.gerarResumo(usuarioLogado.getId(), mes, ano));
    }
}