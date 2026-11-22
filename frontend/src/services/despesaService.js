// Camada que busca e altera as despesas.
// AGORA: usa dados de mentira. DEPOIS: troca pelas chamadas reais da API.
// Só este arquivo muda na troca, a tela continua igual.

// Mesmo formato do JSON que o backend devolve (DespesaDTO)
let despesas = [
    { id: 1, descricao: 'Supermercado Silva', valor: 156.0, tipo: 'DESPESA', categoria: 'Alimentação', data: '2026-11-18' },
    { id: 2, descricao: 'Uber', valor: 32.8, tipo: 'DESPESA', categoria: 'Transporte', data: '2026-11-17' },
    { id: 3, descricao: 'Cinema', valor: 48.0, tipo: 'DESPESA', categoria: 'Lazer', data: '2026-11-15' },
    { id: 4, descricao: 'Farmácia', valor: 89.9, tipo: 'DESPESA', categoria: 'Saúde', data: '2026-11-12' },
    { id: 5, descricao: 'Conta de Energia', valor: 240.5, tipo: 'DESPESA', categoria: 'Casa', data: '2026-11-10' },
    { id: 6, descricao: 'Salário Mensal', valor: 3500.0, tipo: 'RECEITA', categoria: 'Outros', data: '2026-11-05' },
];

// Simula a demora da rede
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listarDespesas() {
    await esperar(300);
    return [...despesas];
}

export async function excluirDespesa(id) {
    await esperar(200);
    despesas = despesas.filter((d) => d.id !== id);
}