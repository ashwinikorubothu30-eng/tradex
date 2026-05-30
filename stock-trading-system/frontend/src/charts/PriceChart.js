import React from 'react';
import { Line } from 'react-chartjs-2';
import { useCurrency } from '../context/CurrencyContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const PriceChart = ({ priceHistory = [], currentPrice }) => {
  const { convert, currency } = useCurrency();
  const history = priceHistory.length > 0
    ? priceHistory
    : Array.from({ length: 20 }, (_, i) => ({
        price: currentPrice * (1 + (Math.random() - 0.5) * 0.02),
        timestamp: new Date(Date.now() - (20 - i) * 3600000),
      }));

  const data = {
    labels: history.map((p) =>
      new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    ),
    datasets: [
      {
        label: `Price (${currency})`,
        data: history.map((p) => convert(p.price)),
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Price History' },
    },
    scales: {
      y: { beginAtZero: false },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default PriceChart;
