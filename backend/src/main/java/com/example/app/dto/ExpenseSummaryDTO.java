package com.example.app.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * High-level summary of total spending, top category, current month spend, etc.
 */
public class ExpenseSummaryDTO {

    private Double totalSpend;
    private Long totalTransactions;
    private Double currentMonthSpend;
    private Double highestExpense;
    private String topCategory;
    private List<CategorySummaryDTO> categoryBreakdown = new ArrayList<>();
    private List<MonthlySummaryDTO> monthlyTrends = new ArrayList<>();

    public ExpenseSummaryDTO() {
        this.totalSpend = 0.0;
        this.totalTransactions = 0L;
        this.currentMonthSpend = 0.0;
        this.highestExpense = 0.0;
        this.topCategory = "None";
    }

    public Double getTotalSpend() {
        return totalSpend;
    }

    public void setTotalSpend(Double totalSpend) {
        this.totalSpend = totalSpend;
    }

    public Long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(Long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public Double getCurrentMonthSpend() {
        return currentMonthSpend;
    }

    public void setCurrentMonthSpend(Double currentMonthSpend) {
        this.currentMonthSpend = currentMonthSpend;
    }

    public Double getHighestExpense() {
        return highestExpense;
    }

    public void setHighestExpense(Double highestExpense) {
        this.highestExpense = highestExpense;
    }

    public String getTopCategory() {
        return topCategory;
    }

    public void setTopCategory(String topCategory) {
        this.topCategory = topCategory;
    }

    public List<CategorySummaryDTO> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(List<CategorySummaryDTO> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public List<MonthlySummaryDTO> getMonthlyTrends() {
        return monthlyTrends;
    }

    public void setMonthlyTrends(List<MonthlySummaryDTO> monthlyTrends) {
        this.monthlyTrends = monthlyTrends;
    }
}
