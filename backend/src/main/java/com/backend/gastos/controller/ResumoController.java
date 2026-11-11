package com.backend.gastos.controller;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.backend.gastos.dto.ResumoResponse;
import com.backend.gastos.service.ResumoService;

@RestController
public class ResumoController {

    private final ResumoService resumoService;

    public ResumoController(ResumoService resumoService) {
        this.resumoService = resumoService;
    }

    // GET /despesas/resumo -> mês atual
    // GET /despesas/resumo?mes=6&ano=2026
    @GetMapping("/despesas/resumo")
    public ResumoResponse resumo(@RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) Long usuarioId, // TEMPORÁRIO
            Principal principal) {

        Long id;
        if (principal != null) {
            // com o JWT do Gustavo funcionando: o usuário vem do token
            id = resumoService.buscarUsuarioId(principal.getName());
        } else if (usuarioId != null) {
            // TEMPORÁRIO: só para testar antes do JWT. Apagar este bloco depois.
            id = usuarioId;
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado");
        }

        return resumoService.gerarResumo(id, mes, ano);
    }
}