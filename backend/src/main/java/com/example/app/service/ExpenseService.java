package com.example.app.service;

import com.example.app.dto.ExpenseRequestDTO;
import com.example.app.dto.ExpenseResponseDTO;
import com.example.app.dto.ExpenseSummaryDTO;

import java.time.LocalDate;
import java.util.List;

/**
 * Service interface defining business logic operations for Expenses.
 */
public interface ExpenseService {

    List<ExpenseResponseDTO> getAllExpenses(String category, String search, LocalDate startDate, LocalDate endDate);

    ExpenseResponseDTO getExpenseById(Long id);

    ExpenseResponseDTO createExpense(ExpenseRequestDTO dto);

    ExpenseResponseDTO updateExpense(Long id, ExpenseRequestDTO dto);

    void deleteExpense(Long id);

    ExpenseSummaryDTO getExpenseSummary();

    void seedSampleData();
}
