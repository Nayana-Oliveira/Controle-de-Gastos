package com.backend.gastos.dto;

import java.math.BigDecimal;

public record CategoriaResumo(String categoria, BigDecimal total, BigDecimal percentual) {
}