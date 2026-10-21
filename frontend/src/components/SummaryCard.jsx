import React from 'react';
import { IndianRupee, Layers, TrendingUp, PiggyBank } from 'lucide-react';

export default function SummaryCard({
  totalSpent = 0,
  totalCount = 0,
  filteredTotal = 0,
  activeCategory = 'ALL'
}) {
  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const avgSpend = totalCount > 0 ? totalSpent / totalCount : 0;

  return (
    <div className="summary-cards-container" id="summary-section">
      {/* Total Spent Across All Saved Expenses */}
      <div className="summary-kpi-card kpi-primary" id="kpi-total-spent">
        <div className="kpi-icon-wrap">
          <IndianRupee size={26} className="text-indigo" />
        </div>
        <div className="kpi-content">
          <span className="kpi-title">Total Amount Spent</span>
          <div className="kpi-value">{formatCurrency(totalSpent)}</div>
          <span className="kpi-subtext">Across {totalCount} saved {totalCount === 1 ? 'expense' : 'expenses'}</span>
        </div>
      </div>

      {/* Filtered Total / Active Category Spend */}
      <div className="summary-kpi-card kpi-emerald" id="kpi-filtered-spent">
        <div className="kpi-icon-wrap">
          <PiggyBank size={26} className="text-emerald" />
        </div>
        <div className="kpi-content">
          <span className="kpi-title">
            {activeCategory === 'ALL' ? 'All Categories Total' : `${activeCategory} Category Total`}
          </span>
          <div className="kpi-value">{formatCurrency(filteredTotal)}</div>
          <span className="kpi-subtext">
            {activeCategory === 'ALL' ? 'Complete database records' : `Filtered by ${activeCategory}`}
          </span>
        </div>
      </div>

      {/* Average Transaction */}
      <div className="summary-kpi-card kpi-amber" id="kpi-average-spend">
        <div className="kpi-icon-wrap">
          <TrendingUp size={26} className="text-amber" />
        </div>
        <div className="kpi-content">
          <span className="kpi-title">Average per Expense</span>
          <div className="kpi-value">{formatCurrency(avgSpend)}</div>
          <span className="kpi-subtext">Mean expenditure</span>
        </div>
      </div>
    </div>
  );
}
