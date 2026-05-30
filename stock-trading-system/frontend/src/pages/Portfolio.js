import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import PortfolioChart from '../charts/PortfolioChart';
import { getPortfolio } from '../services/portfolioService';
import { useCurrency } from '../context/CurrencyContext';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { formatMoney, formatSignedMoney } = useCurrency();

  const fetchPortfolio = useCallback(async () => {
    try {
      const { data } = await getPortfolio();
      setPortfolio(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 30000);
    return () => clearInterval(interval);
  }, [fetchPortfolio]);

  if (loading) return <Layout><LoadingSpinner fullPage /></Layout>;

  const pl = portfolio?.profitLoss || 0;

  return (
    <Layout>
      <h2 className="mb-4">My Portfolio</h2>

      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="shadow-sm stat-card">
            <Card.Body>
              <small className="text-muted">Total Investment</small>
              <h4>{formatMoney(portfolio?.totalInvestment || 0)}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm stat-card">
            <Card.Body>
              <small className="text-muted">Current Value</small>
              <h4>{formatMoney(portfolio?.currentValue || 0)}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className={`shadow-sm stat-card border-${pl >= 0 ? 'success' : 'danger'}`}>
            <Card.Body>
              <small className="text-muted">Profit / Loss</small>
              <h4 className={pl >= 0 ? 'price-up' : 'price-down'}>
                {formatSignedMoney(pl)}
              </h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm">
            <Card.Body>
              <small className="text-muted">Holdings</small>
              <h4>{portfolio?.holdings?.length || 0}</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <PortfolioChart holdings={portfolio?.holdings || []} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={7}>
          <Card className="shadow-sm">
            <Card.Header>Current Holdings</Card.Header>
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Qty</th>
                    <th>Avg Price</th>
                    <th>Current</th>
                    <th>Value</th>
                    <th>P/L</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio?.holdings?.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-4">
                        No holdings yet. Start trading from the dashboard!
                      </td>
                    </tr>
                  )}
                  {portfolio?.holdings?.map((h) => {
                    const stock = h.stockId;
                    const currentVal = h.quantity * (stock?.currentPrice || 0);
                    const invested = h.quantity * h.averagePrice;
                    const holdingPL = currentVal - invested;
                    return (
                      <tr
                        key={h._id || stock?._id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/stocks/${stock?._id}`)}
                      >
                        <td><strong>{stock?.symbol}</strong></td>
                        <td>{h.quantity}</td>
                        <td>{formatMoney(h.averagePrice)}</td>
                        <td>{formatMoney(stock?.currentPrice)}</td>
                        <td>{formatMoney(currentVal)}</td>
                        <td>
                          <Badge bg={holdingPL >= 0 ? 'success' : 'danger'}>
                            {formatSignedMoney(holdingPL)}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Portfolio;
