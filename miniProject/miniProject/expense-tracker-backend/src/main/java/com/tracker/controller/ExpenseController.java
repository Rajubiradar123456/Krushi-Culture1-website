package com.tracker.controller;

import com.tracker.model.Expense;
import com.tracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {
    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return expenseService.addExpense(expense);
    }

    @GetMapping("/category/{category}")
    public List<Expense> getByCategory(@PathVariable String category) {
        return expenseService.getExpensesByCategory(category);
    }

    @GetMapping("/date")
    public List<Expense> getByDateRange(
            @RequestParam("start") String start,
            @RequestParam("end") String end) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        return expenseService.getExpensesByDateRange(startDate, endDate);
    }

    @DeleteMapping
    public void deleteAllExpenses() {
        expenseService.deleteAllExpenses();
    }

    @PostMapping("/resetMonthly")
    public void resetMonthlyExpenses() {
        expenseService.deleteAllExpenses();
    }
}
