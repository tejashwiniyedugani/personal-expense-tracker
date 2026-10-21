import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import SummaryCard from './components/SummaryCard';
import ExpenseForm from './components/ExpenseForm';
import CategoryFilter from './components/CategoryFilter';
import ExpenseList from './components/ExpenseList';
import DeleteModal from './components/DeleteModal';
import Toast from './components/Toast';
import { expenseService } from './services/api';
import { ServerCrash, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(true);

  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const [toast, setToast] = useState(null);
  const [bannerMessage, setBannerMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setBannerMessage({ message, type });
  };

  // Fetch all expenses from backend
  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await expenseService.getExpenses();
      if (res.success) {
        setExpenses(res.data || []);
        setBackendConnected(true);
      }
    } catch (err) {
      console.error('Error fetching expenses from backend:', err);
      setBackendConnected(false);
      showToast('Could not connect to Spring Boot backend on http://localhost:8080', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  // Calculate totals and statistics from the saved expense records
  const { totalSpent, totalCount, categoryCounts, categoryTotals } = useMemo(() => {
    let sum = 0;
    const counts = { ALL: expenses.length, FOOD: 0, TRAVEL: 0, SHOPPING: 0, OTHER: 0 };
    const totals = { ALL: 0, FOOD: 0, TRAVEL: 0, SHOPPING: 0, OTHER: 0 };

    expenses.forEach((item) => {
      const amt = Number(item.amount) || 0;
      sum += amt;

      const cat = item.category || 'OTHER';
      if (counts[cat] != null) {
        counts[cat] += 1;
        totals[cat] += amt;
      } else {
        counts.OTHER = (counts.OTHER || 0) + 1;
        totals.OTHER = (totals.OTHER || 0) + amt;
      }
    });

    totals.ALL = sum;

    return {
      totalSpent: sum,
      totalCount: expenses.length,
      categoryCounts: counts,
      categoryTotals: totals
    };
  }, [expenses]);

  // Filtered expenses based on active category
  const filteredExpenses = useMemo(() => {
    if (activeCategory === 'ALL') {
      return expenses;
    }
    return expenses.filter((item) => item.category === activeCategory);
  }, [expenses, activeCategory]);

  const filteredTotal = useMemo(() => {
    return filteredExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [filteredExpenses]);

  // Handle Save (Add or Update)
  const handleSaveExpense = async (formData) => {
    if (expenseToEdit?.id) {
      // Update existing expense
      const res = await expenseService.updateExpense(expenseToEdit.id, formData);
      if (res.success) {
        showToast(`Expense "${formData.title}" updated successfully!`, 'success');
        setExpenseToEdit(null);
      }
    } else {
      // Add new expense
      const res = await expenseService.createExpense(formData);
      if (res.success) {
        showToast(`Expense "${formData.title}" added successfully!`, 'success');
      }
    }
    // Refresh records after every successful operation
    await loadExpenses();
  };

  // Handle Delete
  const handleDeleteConfirm = async (id) => {
    try {
      const res = await expenseService.deleteExpense(id);
      if (res.success) {
        showToast('Expense deleted successfully.', 'success');
      }
      await loadExpenses();
    } catch (err) {
      showToast('Failed to delete expense: ' + (err.response?.data?.message || err.message), 'error');
      throw err;
    }
  };

  // Re-seed demo data if requested
  const handleSeedDemoData = async () => {
    try {
      setLoading(true);
      await expenseService.seedSampleData();
      showToast('Sample expenses verified and loaded!', 'success');
      await loadExpenses();
    } catch (err) {
      showToast('Failed to reset demo data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Trigger edit on a table row
  const handleStartEdit = (expense) => {
    setExpenseToEdit(expense);
    // Smooth scroll to form
    const formElement = document.getElementById('expense-form-container');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar
        onReloadData={handleSeedDemoData}
        backendConnected={backendConnected}
        onOpenAddModal={() => {
          setExpenseToEdit(null);
          const formElement = document.getElementById('expense-form-container');
          if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      <main className="main-content">
        <div className="container">
          {/* Connection Error Banner */}
          {!backendConnected && (
            <div className="connection-alert">
              <ServerCrash size={20} className="text-danger" />
              <div>
                <strong>Backend Not Connected!</strong>
                <p>
                  Ensure the Spring Boot backend is active on <code>http://localhost:8080</code> using:
                  <br />
                  <code>java -jar target/expense-tracker-backend-1.0.0.jar</code>
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={loadExpenses}
              >
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          )}

          {/* Success / Error Action Banner */}
          {bannerMessage && (
            <div className={`action-banner banner-${bannerMessage.type}`}>
              <div className="banner-content">
                {bannerMessage.type === 'success' ? (
                  <CheckCircle size={18} className="text-emerald" />
                ) : (
                  <AlertTriangle size={18} className="text-danger" />
                )}
                <span>{bannerMessage.message}</span>
              </div>
              <button
                type="button"
                className="banner-close-btn"
                onClick={() => setBannerMessage(null)}
              >
                &times;
              </button>
            </div>
          )}

          {/* 1. Summary Cards (Total Spent across all saved expenses) */}
          <section className="mb-6">
            <SummaryCard
              totalSpent={totalSpent}
              totalCount={totalCount}
              filteredTotal={filteredTotal}
              activeCategory={activeCategory}
            />
          </section>

          {/* 2. Inline Expense Form (Add / Edit) */}
          <section className="mb-6">
            <ExpenseForm
              onSaveExpense={handleSaveExpense}
              expenseToEdit={expenseToEdit}
              onCancelEdit={() => setExpenseToEdit(null)}
            />
          </section>

          {/* 3. Category Filter Tabs (Food, Travel, Shopping, Other) */}
          <section className="mb-4">
            <CategoryFilter
              activeCategory={activeCategory}
              onSelectCategory={(cat) => setActiveCategory(cat)}
              categoryCounts={categoryCounts}
              categoryTotals={categoryTotals}
            />
          </section>

          {/* 4. Responsive Expense Table */}
          <section className="mb-6">
            <ExpenseList
              expenses={filteredExpenses}
              loading={loading}
              onEdit={handleStartEdit}
              onDelete={(exp) => setExpenseToDelete(exp)}
              onOpenAddModal={() => {
                setExpenseToEdit(null);
                const formElement = document.getElementById('expense-form-container');
                if (formElement) {
                  formElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container footer-content">
          <p>
            Personal Expense Tracker &bull; B.Tech Full Stack Development Lab Practical
          </p>
          <div className="footer-tags">
            <span className="tech-tag">React.js</span>
            <span className="tech-tag">Vite</span>
            <span className="tech-tag">Axios</span>
            <span className="tech-tag">Spring Boot 3.2.3</span>
            <span className="tech-tag">Java 21</span>
            <span className="tech-tag">H2 Persistent DB</span>
          </div>
        </div>
      </footer>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(expenseToDelete)}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleDeleteConfirm}
        expense={expenseToDelete}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
