
package com.backend.gastos.service;

import java.util.Locale;

import com.backend.gastos.dto.CadastroUsuarioDTO;
import com.backend.gastos.dto.LoginDTO;
import com.backend.gastos.exception.EmailJaCadastradoException;
import com.backend.gastos.exception.NaoAutorizadoException;
import com.backend.gastos.model.Usuario;
import com.backend.gastos.repository.UsuarioRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AutenticacaoService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder codificadorSenha;

    public AutenticacaoService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder codificadorSenha) {

        this.usuarioRepository = usuarioRepository;
        this.codificadorSenha = codificadorSenha;
    }

    @Transactional
    public void cadastrar(CadastroUsuarioDTO dados) {

        String email = dados.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        if (usuarioRepository.existsByEmail(email)) {
            throw new EmailJaCadastradoException("E-mail já cadastrado");
        }

        Usuario usuario = new Usuario();

        usuario.setNome(dados.nome().trim());
        usuario.setEmail(email);

        String senhaProtegida = codificadorSenha.encode(dados.senha());

        usuario.setSenha(senhaProtegida);

        usuarioRepository.save(usuario);
    }

    public Usuario login(LoginDTO dados) {

        String email = dados.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() ->
                        new NaoAutorizadoException("E-mail ou senha inválidos")
                );

        if (!codificadorSenha.matches(dados.senha(), usuario.getSenha())) {
            throw new NaoAutorizadoException("E-mail ou senha inválidos");
        }

        return usuario;
    }
}
