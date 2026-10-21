import React from 'react';
import { Wallet, Plus, RefreshCw, Database } from 'lucide-react';

export default function Navbar({ onOpenAddModal, onReloadData, backendConnected }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="logo-icon-wrapper">
            <Wallet className="logo-icon" size={24} />
          </div>
          <div>
            <h1 className="brand-title">ExpensePulse</h1>
            <p className="brand-subtitle">Personal Expense Tracker &bull; Full Stack Java + React</p>
          </div>
        </div>

        <div className="navbar-actions">
          <div className={`status-pill ${backendConnected ? 'status-online' : 'status-offline'}`} id="backend-status-badge">
            <span className="status-dot"></span>
            <span>{backendConnected ? 'Backend Connected' : 'Connecting to API...'}</span>
          </div>

          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onReloadData}
            title="Reload or seed sample data"
            id="reload-sample-data-btn"
          >
            <RefreshCw size={16} />
            <span>Reset Demo Data</span>
          </button>

          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={onOpenAddModal}
            id="add-expense-modal-open-btn"
          >
            <Plus size={18} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>
    </header>
  );
}
