import {listarDespesas } from './despesaService';

const arredondar = (n) => Math.round(n*100) / 100;

export async function obterResumo() {
    const hoje = new Date();
    const mes = hoje.getMonth() + 1;
    const ano = hoje.getFullYear();

    const despesas = await listarDespesas();

    //pega do mes atual
    const doMes = despesas.filter((d) => {
        if(d.tipo !== 'DESPESA') {
            return false;
        }

        const [anoDespesa, mesDespesa] = d.data.split('-').map(Number);
        return anoDespesa === ano && mesDespesa === mes;
    });

    const totalGasto = arredondar(doMes.reduce((soma, d) => soma + d.valor, 0));

    const porCategoria = {};
    doMes.forEach((d) => {
        porCategoria[d.categoria] = (porCategoria[d.categoria] || 0) + d.valor;
    });

    const categorias = Object.entries(porCategoria).map(([categoria, total]) => ({
        categoria, 
        total: arredondar(total),
        percentual: totalGasto > 0 ? Math.round((total / totalGasto) * 100) : 0
    })).sort((a, b) => b.total - a.total);

    return {mes, ano, totalGasto, categorias};
}