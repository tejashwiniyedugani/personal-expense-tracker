package com.example.app.repository;

import com.example.app.model.Category;
import com.example.app.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Spring Data JPA Repository for Expense entity.
 * Provides CRUD methods and custom statistical queries.
 */
@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findAllByOrderByExpenseDateDesc();

    List<Expense> findByCategoryOrderByExpenseDateDesc(Category category);

    List<Expense> findByExpenseDateBetweenOrderByExpenseDateDesc(LocalDate startDate, LocalDate endDate);

    List<Expense> findByTitleContainingIgnoreCaseOrderByExpenseDateDesc(String keyword);

    @Query("SELECT e FROM Expense e WHERE " +
           "(:category IS NULL OR e.category = :category) AND " +
           "(:search IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.notes) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:startDate IS NULL OR e.expenseDate >= :startDate) AND " +
           "(:endDate IS NULL OR e.expenseDate <= :endDate) " +
           "ORDER BY e.expenseDate DESC")
    List<Expense> searchExpenses(
            @Param("category") Category category,
            @Param("search") String search,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT e.category, SUM(e.amount), COUNT(e) FROM Expense e GROUP BY e.category ORDER BY SUM(e.amount) DESC")
    List<Object[]> findCategorySpendingSummary();

    @Query("SELECT SUM(e.amount) FROM Expense e")
    Double getTotalExpenseAmount();

    @Query("SELECT MAX(e.amount) FROM Expense e")
    Double getMaximumExpenseAmount();

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.expenseDate BETWEEN :startDate AND :endDate")
    Double getTotalExpenseAmountBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
