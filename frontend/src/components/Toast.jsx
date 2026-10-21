import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className={`toast-notification toast-${toast.type || 'info'}`} id="app-toast">
      <div className="toast-icon">
        {isSuccess && <CheckCircle2 size={18} />}
        {isError && <AlertCircle size={18} />}
        {!isSuccess && !isError && <Info size={18} />}
      </div>
      <div className="toast-message">{toast.message}</div>
      <button 
        type="button" 
        className="toast-close" 
        onClick={onClose}
        title="Dismiss"
      >
        <X size={15} />
      </button>
    </div>
  );
}
