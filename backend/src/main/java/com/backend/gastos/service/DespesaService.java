package com.backend.gastos.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.gastos.exception.RecursoNaoEncontradoException;
import com.backend.gastos.model.Despesa;
import com.backend.gastos.model.Usuario;
import com.backend.gastos.repository.DespesaRepository;
import com.backend.gastos.repository.UsuarioRepository;

@Service
public class DespesaService {

    private final DespesaRepository despesaRepository;
    private final UsuarioRepository usuarioRepository;

    public DespesaService(DespesaRepository despesaRepository, UsuarioRepository usuarioRepository) {
        this.despesaRepository = despesaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // Lista só as despesas do usuário logado, com filtro opcional por categoria
    public List<Despesa> listar(Long usuarioId, String categoria) {

        if (categoria == null || categoria.isBlank()) {
            return despesaRepository.findByUsuarioIdOrderByDataDescIdDesc(usuarioId);
        }

        return despesaRepository.findByUsuarioIdAndCategoriaIgnoreCaseOrderByDataDescIdDesc(
                usuarioId, categoria.trim());
    }

    // Despesa de outro usuário responde 404, igual a uma que não existe (não revela que ela existe)
    public Despesa buscarPorId(Long id, Long usuarioId) {
        return despesaRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Despesa não encontrada"));
    }

    @Transactional
    public Despesa salvar(Despesa despesa, Long usuarioId) {

        Usuario dono = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado"));

        despesa.setId(null);
        despesa.setUsuario(dono);
        limparTextos(despesa);

        return despesaRepository.save(despesa);
    }

    @Transactional
    public Despesa atualizar(Long id, Despesa dados, Long usuarioId) {

        Despesa existente = buscarPorId(id, usuarioId);

        existente.setDescricao(dados.getDescricao());
        existente.setValor(dados.getValor());
        existente.setTipo(dados.getTipo());
        existente.setCategoria(dados.getCategoria());
        existente.setData(dados.getData());
        limparTextos(existente);

        return despesaRepository.save(existente);
    }

    @Transactional
    public void excluir(Long id, Long usuarioId) {

        Despesa existente = buscarPorId(id, usuarioId);

        despesaRepository.delete(existente);
    }

    // Tira espaços do começo e do fim para "Mercado" e "Mercado " não virarem categorias diferentes
    private void limparTextos(Despesa despesa) {
        despesa.setDescricao(despesa.getDescricao().trim());
        despesa.setCategoria(despesa.getCategoria().trim());
    }
}
