package com.example.app.dto;

/**
 * Monthly trend spending summary.
 */
public class MonthlySummaryDTO {

    private String month; // e.g. "2026-10"
    private Double totalAmount;
    private Long transactionCount;

    public MonthlySummaryDTO() {
    }

    public MonthlySummaryDTO(String month, Double totalAmount, Long transactionCount) {
        this.month = month;
        this.totalAmount = totalAmount != null ? Math.round(totalAmount * 100.0) / 100.0 : 0.0;
        this.transactionCount = transactionCount != null ? transactionCount : 0L;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
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
}
