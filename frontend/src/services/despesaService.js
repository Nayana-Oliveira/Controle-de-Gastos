import api from './api';

export async function listarDespesas() {
    const { data } = await api.get('/despesas');
    return data;
}

export async function excluirDespesa(id) {
    await api.delete(`/despesas/${id}`);
}

export async function criarDespesa(dados) {
    const { data } = await api.post('/despesas', dados);
    return data;
}

export async function atualizarDespesa(id, dados) {
    const { data } = await api.put(`/despesas/${id}`, dados);
    return data;
}