package com.example.app.dto;

import com.example.app.model.Category;

/**
 * Aggregated spending summary per category.
 */
public class CategorySummaryDTO {

    private Category category;
    private String categoryDisplayName;
    private Double totalAmount;
    private Long transactionCount;
    private Double percentage;

    public CategorySummaryDTO() {
    }

    public CategorySummaryDTO(Category category, Double totalAmount, Long transactionCount) {
        this.category = category;
        this.categoryDisplayName = category != null ? category.getDisplayName() : "Unknown";
        this.totalAmount = totalAmount != null ? Math.round(totalAmount * 100.0) / 100.0 : 0.0;
        this.transactionCount = transactionCount != null ? transactionCount : 0L;
        this.percentage = 0.0;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getCategoryDisplayName() {
        return categoryDisplayName;
    }

    public void setCategoryDisplayName(String categoryDisplayName) {
        this.categoryDisplayName = categoryDisplayName;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Long getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(Long transactionCount) {
        this.transactionCount = transactionCount;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }
}
