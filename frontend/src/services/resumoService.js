import api from "./api";

// Chama GET /despesas/resumo (mês atual). O token vai no cabeçalho pelo interceptor do api.js
export async function obterResumo() {
  const resposta = await api.get("/despesas/resumo");

  return resposta.data;
}
