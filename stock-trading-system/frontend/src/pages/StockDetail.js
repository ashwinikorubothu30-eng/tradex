import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, Table } from 'react-bootstrap';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import PriceChart from '../charts/PriceChart';
import TradeModal from '../components/TradeModal';
import { getStockById } from '../services/stockService';
import { getPortfolio } from '../services/portfolioService';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const StockDetail = () => {
  const { id } = useParams();
  const { user, updateUserState } = useAuth();
  const { formatMoney } = useCurrency();
  const [stock, setStock] = useState(null);
  const [holding, setHolding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tradeType, setTradeType] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchStock = useCallback(async () => {
    try {
      const [stockRes, portfolioRes] = await Promise.all([
        getStockById(id),
        getPortfolio(),
      ]);
      setStock(stockRes.data.data);
      const h = portfolioRes.data.data?.holdings?.find(
        (x) => x.stockId?._id === id || x.stockId === id
      );
      setHolding(h);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStock();
    const interval = setInterval(fetchStock, 30000);
    return () => clearInterval(interval);
  }, [fetchStock]);

  const openTrade = (type) => {
    setTradeType(type);
    setShowModal(true);
  };

  const handleTradeSuccess = (data) => {
    if (data.virtualBalance !== undefined) {
      updateUserState({ virtualBalance: data.virtualBalance });
    }
    fetchStock();
  };

  if (loading) return <Layout><LoadingSpinner fullPage /></Layout>;
  if (!stock) return <Layout><p>Stock not found</p></Layout>;

  const change = ((stock.currentPrice - stock.openPrice) / stock.openPrice) * 100;

  return (
    <Layout>
      <Row className="g-4">
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h2>{stock.symbol}</h2>
                  <p className="text-muted">{stock.companyName}</p>
                </div>
                <div className="text-end">
                  <h2 className={change >= 0 ? 'price-up' : 'price-down'}>
                    {formatMoney(stock.currentPrice)}
                  </h2>
                  <Badge bg={change >= 0 ? 'success' : 'danger'}>
                    {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                  </Badge>
                </div>
              </div>
              <PriceChart priceHistory={stock.priceHistory} currentPrice={stock.currentPrice} />
            </Card.Body>
          </Card>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>About</h5>
              <p>{stock.description || 'No description available.'}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow-sm mb-3">
            <Card.Header>Daily Statistics</Card.Header>
            <Table borderless className="mb-0">
              <tbody>
                <tr><td>Open</td><td className="text-end">{formatMoney(stock.openPrice)}</td></tr>
                <tr><td>High</td><td className="text-end">{formatMoney(stock.highPrice)}</td></tr>
                <tr><td>Low</td><td className="text-end">{formatMoney(stock.lowPrice)}</td></tr>
                <tr><td>Volume</td><td className="text-end">{stock.volume?.toLocaleString()}</td></tr>
                <tr><td>Market Cap</td><td className="text-end">{formatMoney(stock.marketCap, { compact: true })}</td></tr>
              </tbody>
            </Table>
          </Card>
          {holding && (
            <Card className="shadow-sm mb-3 border-info">
              <Card.Body>
                <small className="text-muted">Your Holdings</small>
                <h5>{holding.quantity} shares @ {formatMoney(holding.averagePrice)}</h5>
              </Card.Body>
            </Card>
          )}
          <div className="d-grid gap-2">
            <Button variant="success" size="lg" onClick={() => openTrade('BUY')}>
              Buy Stock
            </Button>
            <Button
              variant="danger"
              size="lg"
              onClick={() => openTrade('SELL')}
              disabled={!holding}
            >
              Sell Stock
            </Button>
          </div>
          <p className="text-muted small mt-2 text-center">
            Balance: {formatMoney(user?.virtualBalance)}
          </p>
        </Col>
      </Row>

      <TradeModal
        show={showModal}
        onHide={() => setShowModal(false)}
        stock={stock}
        type={tradeType}
        onSuccess={handleTradeSuccess}
        maxQuantity={holding?.quantity}
      />
    </Layout>
  );
};

export default StockDetail;
