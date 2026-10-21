import React from 'react';
import { Filter, Layers, Utensils, Plane, ShoppingBag, MoreHorizontal } from 'lucide-react';

export default function CategoryFilter({
  activeCategory,
  onSelectCategory,
  categoryCounts = {},
  categoryTotals = {}
}) {
  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  const categories = [
    { id: 'ALL', label: 'All', icon: <Layers size={15} /> },
    { id: 'FOOD', label: 'Food', icon: <Utensils size={15} /> },
    { id: 'TRAVEL', label: 'Travel', icon: <Plane size={15} /> },
    { id: 'SHOPPING', label: 'Shopping', icon: <ShoppingBag size={15} /> },
    { id: 'OTHER', label: 'Other', icon: <MoreHorizontal size={15} /> },
  ];

  return (
    <div className="card filter-tabs-card" id="category-filter-section">
      <div className="filter-tabs-header">
        <div className="filter-header-title">
          <Filter size={18} className="text-indigo" />
          <span>Filter by Category</span>
        </div>
        <span className="text-muted text-sm">
          Active: <strong>{activeCategory === 'ALL' ? 'All Categories' : activeCategory}</strong>
        </span>
      </div>

      <div className="category-filter-tabs">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id] ?? 0;
          const total = categoryTotals[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              type="button"
              id={`filter-tab-${cat.id.toLowerCase()}`}
              className={`category-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span className="tab-icon">{cat.icon}</span>
              <span className="tab-label">{cat.label}</span>
              <span className="tab-badge">{count}</span>
              {total > 0 && (
                <span className="tab-total">{formatCurrency(total)}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
