import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Form, InputGroup, Badge } from 'react-bootstrap';
import Layout from '../components/Layout';
import StockCard from '../components/StockCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getMarketDashboard, getStocks } from '../services/stockService';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { formatMoney } = useCurrency();
  const [market, setMarket] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [marketRes, stocksRes] = await Promise.all([
        getMarketDashboard(),
        getStocks({ search, limit: 12 }),
      ]);
      setMarket(marketRes.data.data);
      setStocks(stocksRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) return <Layout><LoadingSpinner fullPage /></Layout>;

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Market Dashboard</h2>
          <p className="text-muted mb-0">
            Welcome, {user?.name}{' '}
            <Badge bg={market?.priceMode === 'live' ? 'success' : 'secondary'} className="ms-1">
              {market?.priceMode === 'live' ? 'Live prices' : 'Simulated prices'}
            </Badge>
          </p>
        </div>
        <InputGroup style={{ maxWidth: '300px' }}>
          <Form.Control
            placeholder="Search stocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </div>

      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="stat-card shadow-sm">
            <Card.Body>
              <small className="text-muted">Total Stocks</small>
              <h3>{market?.totalStocks}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card shadow-sm">
            <Card.Body>
              <small className="text-muted">Avg Price</small>
              <h3>{formatMoney(market?.avgPrice)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card shadow-sm border-success">
            <Card.Body>
              <small className="text-muted">Virtual Balance</small>
              <h3 className="text-success">{formatMoney(user?.virtualBalance)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card shadow-sm">
            <Card.Body>
              <small className="text-muted">Live Updates</small>
              <h3 className="text-primary">30s</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h5 className="mb-3">Trending Stocks</h5>
      <Row className="g-3 mb-4">
        {market?.trending?.map((stock) => (
          <Col key={stock._id} sm={6} md={4} lg={2}>
            <StockCard stock={stock} />
          </Col>
        ))}
      </Row>

      <Row className="g-4 mb-4">
        <Col md={6}>
          <h5>Top Gainers</h5>
          <Row className="g-3">
            {market?.topGainers?.slice(0, 3).map((s) => (
              <Col key={s._id} sm={6}>
                <StockCard stock={s} />
              </Col>
            ))}
          </Row>
        </Col>
        <Col md={6}>
          <h5>Top Losers</h5>
          <Row className="g-3">
            {market?.topLosers?.slice(0, 3).map((s) => (
              <Col key={s._id} sm={6}>
                <StockCard stock={s} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <h5 className="mb-3">All Stocks</h5>
      <Row className="g-3">
        {stocks.map((stock) => (
          <Col key={stock._id} sm={6} md={4} lg={3}>
            <StockCard stock={stock} />
          </Col>
        ))}
      </Row>
    </Layout>
  );
};

export default Dashboard;
