
package com.backend.gastos.controller;

import com.backend.gastos.dto.CadastroUsuarioDTO;
import com.backend.gastos.dto.LoginDTO;
import com.backend.gastos.model.Usuario;
import com.backend.gastos.service.AutenticacaoService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AutenticacaoController {

    private final AutenticacaoService autenticacaoService;

    public AutenticacaoController(AutenticacaoService autenticacaoService) {
        this.autenticacaoService = autenticacaoService;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> cadastrar(
            @Valid @RequestBody CadastroUsuarioDTO dados) {

        autenticacaoService.cadastrar(dados);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(
            @Valid @RequestBody LoginDTO dados) {

        Usuario usuario = autenticacaoService.login(dados);
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }
}
