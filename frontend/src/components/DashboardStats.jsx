import React from 'react';
import { IndianRupee, Calendar, Tag, TrendingUp, Layers } from 'lucide-react';

export default function DashboardStats({ summary, loading }) {
  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const stats = [
    {
      id: 'stat-total-spend',
      title: 'Total Expenses',
      value: formatCurrency(summary?.totalSpend),
      subtitle: 'All-time recorded spend',
      icon: <IndianRupee size={22} className="stat-icon-svg text-indigo" />,
      accentClass: 'accent-indigo',
    },
    {
      id: 'stat-month-spend',
      title: 'This Month',
      value: formatCurrency(summary?.currentMonthSpend),
      subtitle: 'Current billing period',
      icon: <Calendar size={22} className="stat-icon-svg text-emerald" />,
      accentClass: 'accent-emerald',
    },
    {
      id: 'stat-top-category',
      title: 'Top Category',
      value: summary?.topCategory || 'None',
      subtitle: 'Highest aggregate spending',
      icon: <Tag size={22} className="stat-icon-svg text-amber" />,
      accentClass: 'accent-amber',
    },
    {
      id: 'stat-total-tx',
      title: 'Transactions',
      value: summary?.totalTransactions ?? 0,
      subtitle: `Peak single: ${formatCurrency(summary?.highestExpense)}`,
      icon: <Layers size={22} className="stat-icon-svg text-cyan" />,
      accentClass: 'accent-cyan',
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div key={stat.id} id={stat.id} className={`stat-card ${stat.accentClass} ${loading ? 'skeleton-loading' : ''}`}>
          <div className="stat-card-header">
            <span className="stat-card-title">{stat.title}</span>
            <div className="stat-icon-box">{stat.icon}</div>
          </div>
          <div className="stat-card-value">{stat.value}</div>
          <div className="stat-card-subtitle">{stat.subtitle}</div>
        </div>
      ))}
    </div>
  );
}
