package com.example.app.service;

import com.example.app.dto.*;
import com.example.app.exception.ResourceNotFoundException;
import com.example.app.model.Category;
import com.example.app.model.Expense;
import com.example.app.model.PaymentMethod;
import com.example.app.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation of ExpenseService providing CRUD operations and statistical analytics.
 */
@Service
@Transactional
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;

    @Autowired
    public ExpenseServiceImpl(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponseDTO> getAllExpenses(String categoryStr, String search, LocalDate startDate, LocalDate endDate) {
        Category category = null;
        if (categoryStr != null && !categoryStr.trim().isEmpty() && !categoryStr.equalsIgnoreCase("ALL")) {
            try {
                category = Category.valueOf(categoryStr.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                // If invalid category string, ignore or let category remain null
            }
        }

        String searchKeyword = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        List<Expense> expenses = expenseRepository.searchExpenses(category, searchKeyword, startDate, endDate);
        return expenses.stream()
                .map(ExpenseResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseResponseDTO getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));
        return ExpenseResponseDTO.fromEntity(expense);
    }

    @Override
    public ExpenseResponseDTO createExpense(ExpenseRequestDTO dto) {
        Expense expense = new Expense();
        expense.setTitle(dto.getTitle().trim());
        expense.setAmount(dto.getAmount());
        expense.setCategory(dto.getCategory());
        expense.setExpenseDate(dto.getExpenseDate());
        expense.setPaymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : PaymentMethod.UPI);
        expense.setNotes(dto.getNotes() != null ? dto.getNotes().trim() : null);

        Expense saved = expenseRepository.save(expense);
        return ExpenseResponseDTO.fromEntity(saved);
    }

    @Override
    public ExpenseResponseDTO updateExpense(Long id, ExpenseRequestDTO dto) {
        Expense existing = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));

        existing.setTitle(dto.getTitle().trim());
        existing.setAmount(dto.getAmount());
        existing.setCategory(dto.getCategory());
        existing.setExpenseDate(dto.getExpenseDate());
        existing.setPaymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : PaymentMethod.UPI);
        existing.setNotes(dto.getNotes() != null ? dto.getNotes().trim() : null);

        Expense updated = expenseRepository.save(existing);
        return ExpenseResponseDTO.fromEntity(updated);
    }

    @Override
    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete: Expense not found with ID: " + id);
        }
        expenseRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseSummaryDTO getExpenseSummary() {
        ExpenseSummaryDTO summary = new ExpenseSummaryDTO();

        Double totalSpend = expenseRepository.getTotalExpenseAmount();
        summary.setTotalSpend(totalSpend != null ? Math.round(totalSpend * 100.0) / 100.0 : 0.0);

        long totalCount = expenseRepository.count();
        summary.setTotalTransactions(totalCount);

        Double maxSpend = expenseRepository.getMaximumExpenseAmount();
        summary.setHighestExpense(maxSpend != null ? Math.round(maxSpend * 100.0) / 100.0 : 0.0);

        // Current month spend
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate endOfMonth = now.withDayOfMonth(now.lengthOfMonth());
        Double currentMonthSpend = expenseRepository.getTotalExpenseAmountBetween(startOfMonth, endOfMonth);
        summary.setCurrentMonthSpend(currentMonthSpend != null ? Math.round(currentMonthSpend * 100.0) / 100.0 : 0.0);

        // Category breakdown
        List<Object[]> rawCategoryData = expenseRepository.findCategorySpendingSummary();
        List<CategorySummaryDTO> categoryBreakdown = new ArrayList<>();
        double grandTotal = (totalSpend != null && totalSpend > 0) ? totalSpend : 0.0;

        String topCat = "None";
        double highestCategoryAmount = -1;

        for (Object[] row : rawCategoryData) {
            Category cat = (Category) row[0];
            Double catSum = (Double) row[1];
            Long count = (Long) row[2];

            CategorySummaryDTO catDto = new CategorySummaryDTO(cat, catSum, count);
            if (grandTotal > 0 && catSum != null) {
                double pct = Math.round((catSum / grandTotal * 100.0) * 10.0) / 10.0;
                catDto.setPercentage(pct);
            }

            if (catSum != null && catSum > highestCategoryAmount) {
                highestCategoryAmount = catSum;
                topCat = cat.getDisplayName();
            }

            categoryBreakdown.add(catDto);
        }

        summary.setTopCategory(topCat);
        summary.setCategoryBreakdown(categoryBreakdown);

        // Monthly trends for the past 6 months
        List<MonthlySummaryDTO> monthlyList = new ArrayList<>();
        DateTimeFormatter monthYearFormatter = DateTimeFormatter.ofPattern("MMM yyyy");
        for (int i = 5; i >= 0; i--) {
            YearMonth targetMonth = YearMonth.now().minusMonths(i);
            LocalDate mStart = targetMonth.atDay(1);
            LocalDate mEnd = targetMonth.atEndOfMonth();
            Double monthSum = expenseRepository.getTotalExpenseAmountBetween(mStart, mEnd);
            double actualSum = monthSum != null ? Math.round(monthSum * 100.0) / 100.0 : 0.0;
            monthlyList.add(new MonthlySummaryDTO(targetMonth.format(monthYearFormatter), actualSum, 0L));
        }
        summary.setMonthlyTrends(monthlyList);

        return summary;
    }

    @Override
    public void seedSampleData() {
        if (expenseRepository.count() > 0) {
            return; // Already populated
        }

        LocalDate today = LocalDate.now();

        List<Expense> sampleList = List.of(
            new Expense("Grocery & Vegetables", 650.00, Category.FOOD, today.minusDays(1), PaymentMethod.UPI, "Weekly vegetable and fruit replenishment"),
            new Expense("Train & Metro Ticket", 180.00, Category.TRAVEL, today.minusDays(2), PaymentMethod.UPI, "Commute to university"),
            new Expense("New Backpack & Notebooks", 1250.00, Category.SHOPPING, today.minusDays(3), PaymentMethod.DEBIT_CARD, "Semester essentials"),
            new Expense("Electricity & Mobile Bill", 820.00, Category.OTHER, today.minusDays(5), PaymentMethod.NET_BANKING, "Monthly utilities"),
            new Expense("Campus Canteen Lunch", 120.00, Category.FOOD, today.minusDays(6), PaymentMethod.CASH, "Lunch with lab partners"),
            new Expense("Cab to Railway Station", 340.00, Category.TRAVEL, today.minusDays(8), PaymentMethod.UPI, "Weekend trip travel")
        );

        expenseRepository.saveAll(sampleList);
    }
}
