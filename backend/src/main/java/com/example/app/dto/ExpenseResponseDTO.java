package com.example.app.dto;

import com.example.app.model.Category;
import com.example.app.model.Expense;
import com.example.app.model.PaymentMethod;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for sending expense details to the client.
 */
public class ExpenseResponseDTO {

    private Long id;
    private String title;
    private Double amount;
    private Category category;
    private String categoryDisplayName;
    private LocalDate expenseDate;
    private PaymentMethod paymentMethod;
    private String paymentMethodDisplayName;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ExpenseResponseDTO() {
    }

    public static ExpenseResponseDTO fromEntity(Expense expense) {
        ExpenseResponseDTO dto = new ExpenseResponseDTO();
        dto.setId(expense.getId());
        dto.setTitle(expense.getTitle());
        dto.setAmount(expense.getAmount());
        dto.setCategory(expense.getCategory());
        dto.setCategoryDisplayName(expense.getCategory() != null ? expense.getCategory().getDisplayName() : "");
        dto.setExpenseDate(expense.getExpenseDate());
        dto.setPaymentMethod(expense.getPaymentMethod());
        dto.setPaymentMethodDisplayName(expense.getPaymentMethod() != null ? expense.getPaymentMethod().getDisplayName() : "");
        dto.setNotes(expense.getNotes());
        dto.setCreatedAt(expense.getCreatedAt());
        dto.setUpdatedAt(expense.getUpdatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
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

    public LocalDate getExpenseDate() {
        return expenseDate;
    }

    public void setExpenseDate(LocalDate expenseDate) {
        this.expenseDate = expenseDate;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentMethodDisplayName() {
        return paymentMethodDisplayName;
    }

    public void setPaymentMethodDisplayName(String paymentMethodDisplayName) {
        this.paymentMethodDisplayName = paymentMethodDisplayName;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
