import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAnalytics } from '../../services/analyticsService';
import { useCurrency } from '../../context/CurrencyContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
  const { formatMoney, convert, currency } = useCurrency();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><LoadingSpinner fullPage /></Layout>;

  const tradesChart = {
    labels: data?.tradesByType?.map((t) => t._id) || [],
    datasets: [
      {
        label: 'Trade Count',
        data: data?.tradesByType?.map((t) => t.count) || [],
        backgroundColor: ['#198754', '#dc3545'],
      },
      {
        label: `Volume (${currency})`,
        data: data?.tradesByType?.map((t) => convert(t.volume)) || [],
        backgroundColor: ['rgba(25,135,84,0.5)', 'rgba(220,53,69,0.5)'],
      },
    ],
  };

  const volumeChart = {
    labels: data?.tradesOverTime?.map((t) => t._id) || [],
    datasets: [
      {
        label: `Daily Volume (${currency})`,
        data: data?.tradesOverTime?.map((t) => convert(t.volume)) || [],
        backgroundColor: '#0d6efd',
      },
    ],
  };

  return (
    <Layout>
      <h2 className="mb-4">Platform Analytics</h2>
      <Row className="g-3 mb-4">
        {[
          { label: 'Total Users', value: data?.totalUsers },
          { label: 'Total Stocks', value: data?.totalStocks },
          { label: 'Total Trades', value: data?.totalTrades },
          { label: 'Trading Volume', value: formatMoney(data?.tradingVolume) },
        ].map((s, i) => (
          <Col key={i} md={3}>
            <Card className="shadow-sm stat-card text-center">
              <Card.Body>
                <h3>{s.value}</h3>
                <small className="text-muted">{s.label}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <h5>Trades by Type</h5>
            <div style={{ height: '250px' }}>
              <Bar data={tradesChart} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <h5>Volume Over Time</h5>
            <div style={{ height: '250px' }}>
              <Bar data={volumeChart} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </Card>
        </Col>
      </Row>
      <Card className="shadow-sm">
        <Card.Header>Recent Trades</Card.Header>
        <div className="table-responsive">
          <Table hover className="mb-0" size="sm">
            <thead>
              <tr><th>Date</th><th>User</th><th>Type</th><th>Stock</th><th>Total</th></tr>
            </thead>
            <tbody>
              {data?.recentTrades?.map((t) => (
                <tr key={t._id}>
                  <td>{new Date(t.timestamp).toLocaleString()}</td>
                  <td>{t.userId?.name}</td>
                  <td><Badge bg={t.tradeType === 'BUY' ? 'success' : 'danger'}>{t.tradeType}</Badge></td>
                  <td>{t.stockId?.symbol}</td>
                  <td>{formatMoney(t.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </Layout>
  );
};

export default Analytics;
