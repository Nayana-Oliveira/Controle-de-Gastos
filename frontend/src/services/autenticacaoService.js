import api from './api';

export async function fazerLogin(email, senha) {
    const resposta = await api.post('/auth/login', {
        email,
        senha
    });

    return resposta.data;
}

export async function cadastrarUsuario(nome, email, senha) {
    const resposta = await api.post('/auth/register', {
        nome,
        email,
        senha
    });

    return resposta.data;
}