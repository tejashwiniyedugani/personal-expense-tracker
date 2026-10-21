import React, { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle, RotateCcw, AlertCircle, IndianRupee, Calendar, Tag, FileText } from 'lucide-react';

export default function ExpenseForm({
  onSaveExpense,
  expenseToEdit,
  onCancelEdit,
  categories = []
}) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('FOOD');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(expenseToEdit?.id);

  useEffect(() => {
    if (expenseToEdit) {
      setTitle(expenseToEdit.title || '');
      setAmount(expenseToEdit.amount != null ? String(expenseToEdit.amount) : '');
      setCategory(expenseToEdit.category || 'FOOD');
      setExpenseDate(expenseToEdit.expenseDate || new Date().toISOString().split('T')[0]);
      setNotes(expenseToEdit.notes || '');
      setValidationError('');
    } else {
      resetForm();
    }
  }, [expenseToEdit]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory('FOOD');
    setExpenseDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Title validation
    if (!title || !title.trim()) {
      setValidationError('Title must not be empty.');
      return;
    }

    // 2. Amount validation
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setValidationError('Amount must be a positive number greater than zero.');
      return;
    }

    // 3. Category validation
    if (!category) {
      setValidationError('Please select a valid category.');
      return;
    }

    // 4. Date validation
    if (!expenseDate) {
      setValidationError('Please select a valid expense date.');
      return;
    }

    setValidationError('');
    setIsSubmitting(true);

    try {
      await onSaveExpense({
        title: title.trim(),
        amount: parsedAmount,
        category,
        expenseDate,
        paymentMethod: expenseToEdit?.paymentMethod || 'UPI',
        notes: notes.trim()
      });

      if (!isEditing) {
        resetForm();
      }
    } catch (err) {
      setValidationError(err.response?.data?.message || 'Error saving expense record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card form-card" id="expense-form-container">
      <div className="card-header">
        <div className="card-header-left">
          {isEditing ? (
            <CheckCircle size={20} className="text-amber" />
          ) : (
            <PlusCircle size={20} className="text-indigo" />
          )}
          <h2 className="card-title">
            {isEditing ? `Edit Expense #${expenseToEdit.id}` : 'Add New Expense'}
          </h2>
        </div>
        {isEditing && (
          <span className="badge badge-warning">Editing Mode</span>
        )}
      </div>

      <div className="card-body">
        {validationError && (
          <div className="form-error-banner" id="form-error-banner">
            <AlertCircle size={18} />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} id="expense-form" noValidate>
          <div className="form-grid-layout">
            {/* Title */}
            <div className="form-group form-group-title">
              <label htmlFor="expense-title" className="form-label">
                Expense Title <span className="text-danger">*</span>
              </label>
              <input
                id="expense-title"
                type="text"
                className="form-control"
                placeholder="e.g., Grocery Store, Metro Card, College Books"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (validationError) setValidationError('');
                }}
                required
              />
            </div>

            {/* Amount */}
            <div className="form-group">
              <label htmlFor="expense-amount" className="form-label">
                Amount (₹) <span className="text-danger">*</span>
              </label>
              <div className="input-with-icon">
                <IndianRupee size={16} className="input-icon" />
                <input
                  id="expense-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="form-control"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="expense-category" className="form-label">
                Category <span className="text-danger">*</span>
              </label>
              <div className="input-with-icon">
                <Tag size={16} className="input-icon" />
                <select
                  id="expense-category"
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="FOOD">Food</option>
                  <option value="TRAVEL">Travel</option>
                  <option value="SHOPPING">Shopping</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="form-group">
              <label htmlFor="expense-date" className="form-label">
                Date <span className="text-danger">*</span>
              </label>
              <div className="input-with-icon">
                <Calendar size={16} className="input-icon" />
                <input
                  id="expense-date"
                  type="date"
                  className="form-control"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions-row">
            <button
              type="submit"
              className="btn btn-primary"
              id="submit-expense-btn"
              disabled={isSubmitting}
            >
              {isEditing ? (
                <>
                  <CheckCircle size={16} />
                  <span>{isSubmitting ? 'Updating...' : 'Update Expense'}</span>
                </>
              ) : (
                <>
                  <PlusCircle size={16} />
                  <span>{isSubmitting ? 'Saving...' : 'Add Expense'}</span>
                </>
              )}
            </button>

            {isEditing ? (
              <button
                type="button"
                className="btn btn-secondary"
                id="cancel-edit-btn"
                onClick={onCancelEdit}
              >
                Cancel Edit
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-outline"
                id="clear-form-btn"
                onClick={resetForm}
              >
                <RotateCcw size={15} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
