import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAnalytics } from '../../services/analyticsService';
import { useCurrency } from '../../context/CurrencyContext';

const AdminDashboard = () => {
  const { formatMoney } = useCurrency();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then(({ data }) => setAnalytics(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><LoadingSpinner fullPage /></Layout>;

  const links = [
    { to: '/admin/users', label: 'Manage Users', icon: '👥' },
    { to: '/admin/stocks', label: 'Manage Stocks', icon: '📈' },
    { to: '/admin/transactions', label: 'Transactions', icon: '🔄' },
    { to: '/admin/analytics', label: 'Analytics', icon: '📊' },
  ];

  return (
    <Layout>
      <h2 className="mb-4">Admin Dashboard</h2>
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="shadow-sm stat-card text-center">
            <Card.Body>
              <h3>{analytics?.totalUsers}</h3>
              <small className="text-muted">Total Users</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm stat-card text-center">
            <Card.Body>
              <h3>{analytics?.totalStocks}</h3>
              <small className="text-muted">Total Stocks</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm stat-card text-center">
            <Card.Body>
              <h3>{analytics?.totalTrades}</h3>
              <small className="text-muted">Total Trades</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm stat-card text-center">
            <Card.Body>
              <h3>{formatMoney(analytics?.tradingVolume, { compact: true })}</h3>
              <small className="text-muted">Trading Volume</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="g-3">
        {links.map((l) => (
          <Col key={l.to} sm={6} md={3}>
            <Card as={Link} to={l.to} className="shadow-sm text-decoration-none text-dark h-100 stock-card">
              <Card.Body className="text-center py-4">
                <div style={{ fontSize: '2rem' }}>{l.icon}</div>
                <h5 className="mt-2">{l.label}</h5>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Layout>
  );
};

export default AdminDashboard;
