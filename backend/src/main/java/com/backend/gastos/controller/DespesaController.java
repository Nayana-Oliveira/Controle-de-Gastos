package com.backend.gastos.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.gastos.dto.DespesaDTO;
import com.backend.gastos.model.Despesa;
import com.backend.gastos.security.UsuarioLogado;
import com.backend.gastos.service.DespesaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/despesas")
public class DespesaController {

    private final DespesaService despesaService;
    private final UsuarioLogado usuarioLogado;

    public DespesaController(DespesaService despesaService, UsuarioLogado usuarioLogado) {
        this.despesaService = despesaService;
        this.usuarioLogado = usuarioLogado;
    }

    // Tela de formulário (cadastro)
    @PostMapping
    public ResponseEntity<DespesaDTO> salvar(@Valid @RequestBody DespesaDTO dto) {
        Despesa salva = despesaService.salvar(dto.toEntity(), usuarioLogado.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(DespesaDTO.fromEntity(salva));
    }

    // Tela Home: GET /despesas ou GET /despesas?categoria=Mercado
    @GetMapping
    public ResponseEntity<List<DespesaDTO>> listar(@RequestParam(required = false) String categoria) {
        List<DespesaDTO> resposta = despesaService.listar(usuarioLogado.getId(), categoria)
                .stream()
                .map(DespesaDTO::fromEntity)
                .toList();

        return ResponseEntity.ok(resposta);
    }

    // Tela de formulário (carrega os dados para edição)
    @GetMapping("/{id}")
    public ResponseEntity<DespesaDTO> buscarPorId(@PathVariable Long id) {
        Despesa despesa = despesaService.buscarPorId(id, usuarioLogado.getId());

        return ResponseEntity.ok(DespesaDTO.fromEntity(despesa));
    }

    // Tela de formulário (edição)
    @PutMapping("/{id}")
    public ResponseEntity<DespesaDTO> atualizar(@PathVariable Long id, @Valid @RequestBody DespesaDTO dto) {
        Despesa atualizada = despesaService.atualizar(id, dto.toEntity(), usuarioLogado.getId());

        return ResponseEntity.ok(DespesaDTO.fromEntity(atualizada));
    }

    // Tela Home (exclusão)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        despesaService.excluir(id, usuarioLogado.getId());

        return ResponseEntity.noContent().build();
    }
}
