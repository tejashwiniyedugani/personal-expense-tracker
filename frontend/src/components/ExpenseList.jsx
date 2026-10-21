import React from 'react';
import { 
  Receipt, 
  Edit3, 
  Trash2, 
  Calendar as CalendarIcon, 
  CreditCard, 
  ArrowUpDown,
  FileText,
  Plus
} from 'lucide-react';

const CATEGORY_STYLES = {
  FOOD: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
  TRAVEL: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
  SHOPPING: { bg: 'rgba(249, 115, 22, 0.15)', color: '#fb923c', border: 'rgba(249, 115, 22, 0.3)' },
  OTHER: { bg: 'rgba(148, 163, 184, 0.15)', color: '#cbd5e1', border: 'rgba(148, 163, 184, 0.3)' },
};

export default function ExpenseList({
  expenses = [],
  loading,
  onEdit,
  onDelete,
  onOpenAddModal
}) {
  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-');
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="card expense-list-card">
        <div className="card-header">
          <div className="card-header-left">
            <Receipt size={20} className="text-indigo" />
            <h2 className="card-title">Transaction History</h2>
          </div>
        </div>
        <div className="table-loading-container">
          <div className="spinner"></div>
          <p>Fetching records from Spring Boot backend...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card expense-list-card">
      <div className="card-header">
        <div className="card-header-left">
          <Receipt size={20} className="text-indigo" />
          <h2 className="card-title">Transaction History</h2>
        </div>
        <span className="badge badge-primary">{expenses.length} Total</span>
      </div>

      <div className="card-body no-padding">
        {(!expenses || expenses.length === 0) ? (
          <div className="empty-expenses-state">
            <div className="empty-icon-circle">
              <Receipt size={40} className="text-indigo" />
            </div>
            <h3>No expenses found</h3>
            <p>No transactions match your current search or date filters.</p>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={onOpenAddModal}
              id="empty-state-add-btn"
            >
              <Plus size={16} />
              <span>Add New Expense</span>
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title & Description</th>
                  <th>Category</th>
                  <th>Payment Method</th>
                  <th className="text-right">Amount</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => {
                  const style = CATEGORY_STYLES[expense.category] || CATEGORY_STYLES.OTHER;

                  return (
                    <tr key={expense.id} className="expense-row" id={`expense-row-${expense.id}`}>
                      {/* Date */}
                      <td className="expense-date-cell">
                        <div className="date-badge">
                          <CalendarIcon size={14} className="text-muted" />
                          <span>{formatDate(expense.expenseDate)}</span>
                        </div>
                      </td>

                      {/* Title & Notes */}
                      <td className="expense-title-cell">
                        <div className="expense-title">{expense.title}</div>
                        {expense.notes && (
                          <div className="expense-notes" title={expense.notes}>
                            <FileText size={12} className="inline-icon" />
                            {expense.notes}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td>
                        <span 
                          className="category-pill"
                          style={{
                            backgroundColor: style.bg,
                            color: style.color,
                            borderColor: style.border
                          }}
                        >
                          {expense.categoryDisplayName || expense.category}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td>
                        <span className="payment-pill">
                          <CreditCard size={13} className="text-muted" />
                          {expense.paymentMethodDisplayName || expense.paymentMethod || 'UPI'}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="expense-amount-cell text-right">
                        <span className="amount-text">{formatCurrency(expense.amount)}</span>
                      </td>

                      {/* Actions */}
                      <td className="expense-actions-cell text-center">
                        <div className="action-buttons-group">
                          <button
                            type="button"
                            className="btn-icon btn-icon-edit"
                            onClick={() => onEdit(expense)}
                            title="Edit this expense"
                            id={`edit-btn-${expense.id}`}
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon btn-icon-delete"
                            onClick={() => onDelete(expense)}
                            title="Delete this expense"
                            id={`delete-btn-${expense.id}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
