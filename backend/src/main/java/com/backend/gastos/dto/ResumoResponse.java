package com.backend.gastos.dto;

import java.math.BigDecimal;
import java.util.List;

public record ResumoResponse(int mes, int ano, BigDecimal totalGasto, List<CategoriaResumo> categorias) {
}