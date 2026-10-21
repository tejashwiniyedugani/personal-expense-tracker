import React from 'react';
import { PieChart, TrendingUp, AlertCircle } from 'lucide-react';

const CATEGORY_COLORS = {
  FOOD: '#f59e0b',
  TRANSPORTATION: '#3b82f6',
  HOUSING: '#8b5cf6',
  UTILITIES: '#10b981',
  ENTERTAINMENT: '#ec4899',
  HEALTHCARE: '#ef4444',
  EDUCATION: '#06b6d4',
  SHOPPING: '#f97316',
  OTHER: '#64748b',
};

export default function CategoryChart({ categories = [], totalSpend = 0, onSelectCategory }) {
  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="card category-chart-card">
      <div className="card-header">
        <div className="card-header-left">
          <PieChart size={20} className="text-indigo" />
          <h2 className="card-title">Spending by Category</h2>
        </div>
        <span className="badge badge-muted">
          {categories.length} Categories Active
        </span>
      </div>

      <div className="card-body">
        {(!categories || categories.length === 0) ? (
          <div className="empty-chart-state">
            <AlertCircle size={32} className="text-muted" />
            <p>No category expenses logged yet. Add your first expense to see the visual breakdown!</p>
          </div>
        ) : (
          <div className="category-bars-list">
            {categories.map((item) => {
              const color = CATEGORY_COLORS[item.category] || '#6366f1';
              const pct = item.percentage || 0;

              return (
                <div 
                  key={item.category} 
                  className="category-bar-item"
                  onClick={() => onSelectCategory && onSelectCategory(item.category)}
                  title={`Click to filter by ${item.categoryDisplayName}`}
                >
                  <div className="category-bar-header">
                    <div className="category-bar-title-group">
                      <span className="category-color-dot" style={{ backgroundColor: color }}></span>
                      <span className="category-bar-name">{item.categoryDisplayName}</span>
                      <span className="category-tx-count">({item.transactionCount} entries)</span>
                    </div>
                    <div className="category-bar-numbers">
                      <span className="category-bar-amount">{formatCurrency(item.totalAmount)}</span>
                      <span className="category-bar-pct">{pct}%</span>
                    </div>
                  </div>

                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${Math.min(pct, 100)}%`, 
                        backgroundColor: color 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
