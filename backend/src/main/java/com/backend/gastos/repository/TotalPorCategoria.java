package com.backend.gastos.repository;

import java.math.BigDecimal;

public interface TotalPorCategoria {
    String getCategoria();
    BigDecimal getTotal();
}