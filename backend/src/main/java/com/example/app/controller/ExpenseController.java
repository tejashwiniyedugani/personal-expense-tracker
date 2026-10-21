package com.example.app.controller;

import com.example.app.dto.ApiResponse;
import com.example.app.dto.ExpenseRequestDTO;
import com.example.app.dto.ExpenseResponseDTO;
import com.example.app.dto.ExpenseSummaryDTO;
import com.example.app.model.Category;
import com.example.app.model.PaymentMethod;
import com.example.app.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

/**
 * REST Controller exposing API endpoints for managing expenses and retrieving analytics.
 */
@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"})
public class ExpenseController {

    private final ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    /**
     * GET /api/expenses
     * Retrieves all expenses with optional filtering by category, search text, and date range.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseResponseDTO>>> getAllExpenses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<ExpenseResponseDTO> list = expenseService.getAllExpenses(category, search, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.ok("Expenses retrieved successfully", list));
    }

    /**
     * GET /api/expenses/{id}
     * Retrieves a single expense by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseResponseDTO>> getExpenseById(@PathVariable Long id) {
        ExpenseResponseDTO dto = expenseService.getExpenseById(id);
        return ResponseEntity.ok(ApiResponse.ok("Expense found", dto));
    }

    /**
     * POST /api/expenses
     * Creates a new expense entry.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseResponseDTO>> createExpense(@Valid @RequestBody ExpenseRequestDTO requestDTO) {
        ExpenseResponseDTO created = expenseService.createExpense(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Expense recorded successfully", created));
    }

    /**
     * PUT /api/expenses/{id}
     * Updates an existing expense.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseResponseDTO>> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequestDTO requestDTO) {
        
        ExpenseResponseDTO updated = expenseService.updateExpense(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.ok("Expense updated successfully", updated));
    }

    /**
     * DELETE /api/expenses/{id}
     * Deletes an expense by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok(ApiResponse.ok("Expense deleted successfully", null));
    }

    /**
     * GET /api/expenses/summary
     * Retrieves statistical overview, category breakdowns, and monthly trends.
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<ExpenseSummaryDTO>> getSummary() {
        ExpenseSummaryDTO summary = expenseService.getExpenseSummary();
        return ResponseEntity.ok(ApiResponse.ok("Summary retrieved successfully", summary));
    }

    /**
     * GET /api/expenses/meta
     * Provides category and payment method metadata for UI dropdown options.
     */
    @GetMapping("/meta")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMetadata() {
        Map<String, Object> meta = new HashMap<>();

        List<Map<String, String>> categories = new ArrayList<>();
        for (Category c : Category.values()) {
            Map<String, String> item = new HashMap<>();
            item.put("name", c.name());
            item.put("displayName", c.getDisplayName());
            categories.add(item);
        }

        List<Map<String, String>> paymentMethods = new ArrayList<>();
        for (PaymentMethod pm : PaymentMethod.values()) {
            Map<String, String> item = new HashMap<>();
            item.put("name", pm.name());
            item.put("displayName", pm.getDisplayName());
            paymentMethods.add(item);
        }

        meta.put("categories", categories);
        meta.put("paymentMethods", paymentMethods);

        return ResponseEntity.ok(ApiResponse.ok("Metadata retrieved successfully", meta));
    }

    /**
     * POST /api/expenses/seed
     * Seeds sample data if needed for testing or viva evaluation.
     */
    @PostMapping("/seed")
    public ResponseEntity<ApiResponse<String>> seedSampleData() {
        expenseService.seedSampleData();
        return ResponseEntity.ok(ApiResponse.ok("Sample data verified/seeded successfully", "Done"));
    }
}
