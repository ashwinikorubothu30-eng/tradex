import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997', '#0dcaf0'];

const PortfolioChart = ({ holdings = [] }) => {
  if (!holdings.length) {
    return <p className="text-muted text-center py-4">No holdings to display</p>;
  }

  const data = {
    labels: holdings.map((h) => h.stockId?.symbol || 'Unknown'),
    datasets: [
      {
        data: holdings.map((h) => h.quantity * (h.stockId?.currentPrice || h.averagePrice)),
        backgroundColor: COLORS.slice(0, holdings.length),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Portfolio Allocation' },
    },
  };

  return (
    <div style={{ height: '280px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default PortfolioChart;
