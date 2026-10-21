import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, IndianRupee, Calendar, Tag, CreditCard, AlignLeft } from 'lucide-react';

export default function ExpenseModal({
  isOpen,
  onClose,
  onSave,
  expenseToEdit,
  categories = [],
  paymentMethods = []
}) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'FOOD',
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        title: expenseToEdit.title || '',
        amount: expenseToEdit.amount || '',
        category: expenseToEdit.category || 'FOOD',
        expenseDate: expenseToEdit.expenseDate || new Date().toISOString().split('T')[0],
        paymentMethod: expenseToEdit.paymentMethod || 'UPI',
        notes: expenseToEdit.notes || ''
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: categories.length > 0 ? categories[0].name : 'FOOD',
        expenseDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI',
        notes: ''
      });
    }
    setErrors({});
  }, [expenseToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title || !formData.title.trim()) {
      errs.title = 'Title is required';
    } else if (formData.title.length > 100) {
      errs.title = 'Title cannot exceed 100 characters';
    }

    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      errs.amount = 'Please enter a valid amount greater than 0';
    }

    if (!formData.category) {
      errs.category = 'Category is required';
    }

    if (!formData.expenseDate) {
      errs.expenseDate = 'Date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSave({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      onClose();
    } catch (err) {
      // Backend validation error handling
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: err.response?.data?.message || 'Failed to save expense.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isEdit = Boolean(expenseToEdit?.id);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {isEdit ? 'Edit Expense Record' : 'Record New Expense'}
          </h3>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            id="close-expense-modal-btn"
          >
            <X size={20} />
          </button>
        </div>

        {errors.general && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="expense-title-input" className="form-label">
              Expense Title <span className="text-danger">*</span>
            </label>
            <div className="input-with-icon">
              <input
                id="expense-title-input"
                type="text"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                placeholder="e.g. Grocery Shopping, Metro Recharge, Electric Bill"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            {errors.title && <span className="field-error-text">{errors.title}</span>}
          </div>

          {/* Amount & Date (2 columns) */}
          <div className="form-row">
            <div className="form-group col-half">
              <label htmlFor="expense-amount-input" className="form-label">
                Amount (₹) <span className="text-danger">*</span>
              </label>
              <div className="input-with-icon">
                <IndianRupee size={16} className="input-icon" />
                <input
                  id="expense-amount-input"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              {errors.amount && <span className="field-error-text">{errors.amount}</span>}
            </div>

            <div className="form-group col-half">
              <label htmlFor="expense-date-input" className="form-label">
                Expense Date <span className="text-danger">*</span>
              </label>
              <div className="input-with-icon">
                <Calendar size={16} className="input-icon" />
                <input
                  id="expense-date-input"
                  type="date"
                  className={`form-control ${errors.expenseDate ? 'is-invalid' : ''}`}
                  value={formData.expenseDate}
                  onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                  required
                />
              </div>
              {errors.expenseDate && <span className="field-error-text">{errors.expenseDate}</span>}
            </div>
          </div>

          {/* Category & Payment Method (2 columns) */}
          <div className="form-row">
            <div className="form-group col-half">
              <label htmlFor="expense-category-input" className="form-label">
                Category <span className="text-danger">*</span>
              </label>
              <div className="input-with-icon">
                <Tag size={16} className="input-icon" />
                <select
                  id="expense-category-input"
                  className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.displayName}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && <span className="field-error-text">{errors.category}</span>}
            </div>

            <div className="form-group col-half">
              <label htmlFor="expense-payment-input" className="form-label">
                Payment Method
              </label>
              <div className="input-with-icon">
                <CreditCard size={16} className="input-icon" />
                <select
                  id="expense-payment-input"
                  className="form-control"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                >
                  {paymentMethods.map((pm) => (
                    <option key={pm.name} value={pm.name}>
                      {pm.displayName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="expense-notes-input" className="form-label">
              Notes / Remarks <span className="text-muted">(Optional)</span>
            </label>
            <div className="input-with-icon">
              <textarea
                id="expense-notes-input"
                className="form-control textarea-control"
                rows="3"
                placeholder="Add any specific context, store name, or receipt remarks..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              ></textarea>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={submitting}
              id="cancel-expense-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              id="save-expense-btn"
            >
              <Check size={16} />
              <span>{submitting ? 'Saving...' : isEdit ? 'Update Expense' : 'Save Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
