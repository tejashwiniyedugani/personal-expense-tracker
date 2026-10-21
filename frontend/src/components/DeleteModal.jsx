import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  expense
}) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !expense) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm(expense.id);
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-danger">
            <div className="danger-icon-circle">
              <AlertTriangle size={22} className="text-danger" />
            </div>
            <h3 className="modal-title">Confirm Deletion</h3>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            id="close-delete-modal-btn"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body text-center">
          <p className="delete-warning-text">
            Are you sure you want to permanently delete this expense?
          </p>
          <div className="delete-item-preview">
            <span className="preview-title">{expense.title}</span>
            <span className="preview-amount">{formatCurrency(expense.amount)}</span>
          </div>
          <p className="text-muted text-sm">
            This action cannot be undone and will update your database records immediately.
          </p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={deleting}
            id="cancel-delete-btn"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={deleting}
            id="confirm-delete-btn"
          >
            <Trash2 size={16} />
            <span>{deleting ? 'Deleting...' : 'Delete Expense'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
