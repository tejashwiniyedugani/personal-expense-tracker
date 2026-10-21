import React from 'react';
import { Search, Filter, RotateCcw, Calendar } from 'lucide-react';

export default function ExpenseFilters({
  filters,
  onChange,
  onReset,
  categories = [],
  totalCount = 0
}) {
  return (
    <div className="card filters-card">
      <div className="filters-grid">
        {/* Search Input */}
        <div className="filter-group filter-search">
          <label htmlFor="filter-search-input" className="filter-label">Search Expenses</label>
          <div className="input-with-icon">
            <Search size={16} className="input-icon" />
            <input
              id="filter-search-input"
              type="text"
              className="form-control"
              placeholder="Search title or notes..."
              value={filters.search || ''}
              onChange={(e) => onChange('search', e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="filter-category-select" className="filter-label">Category</label>
          <div className="input-with-icon">
            <Filter size={16} className="input-icon" />
            <select
              id="filter-category-select"
              className="form-control"
              value={filters.category || 'ALL'}
              onChange={(e) => onChange('category', e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.displayName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* From Date */}
        <div className="filter-group">
          <label htmlFor="filter-start-date" className="filter-label">From Date</label>
          <div className="input-with-icon">
            <Calendar size={16} className="input-icon" />
            <input
              id="filter-start-date"
              type="date"
              className="form-control"
              value={filters.startDate || ''}
              onChange={(e) => onChange('startDate', e.target.value)}
            />
          </div>
        </div>

        {/* To Date */}
        <div className="filter-group">
          <label htmlFor="filter-end-date" className="filter-label">To Date</label>
          <div className="input-with-icon">
            <Calendar size={16} className="input-icon" />
            <input
              id="filter-end-date"
              type="date"
              className="form-control"
              value={filters.endDate || ''}
              onChange={(e) => onChange('endDate', e.target.value)}
            />
          </div>
        </div>

        {/* Action / Reset */}
        <div className="filter-group filter-action">
          <span className="results-badge">
            {totalCount} {totalCount === 1 ? 'record' : 'records'}
          </span>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onReset}
            id="reset-filters-btn"
            title="Clear all filters"
          >
            <RotateCcw size={15} />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
}
