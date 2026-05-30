import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

const StockCard = ({ stock }) => {
  const navigate = useNavigate();
  const { formatMoney } = useCurrency();
  const change = ((stock.currentPrice - stock.openPrice) / stock.openPrice) * 100;
  const isPositive = change >= 0;

  return (
    <Card
      className="stock-card h-100 shadow-sm"
      onClick={() => navigate(`/stocks/${stock._id}`)}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="mb-0 fw-bold">{stock.symbol}</h5>
            <small className="text-muted text-truncate d-block" style={{ maxWidth: '180px' }}>
              {stock.companyName}
            </small>
          </div>
          <Badge bg={isPositive ? 'success' : 'danger'}>
            {isPositive ? '+' : ''}{change.toFixed(2)}%
          </Badge>
        </div>
        <h4 className={`mt-3 mb-1 ${isPositive ? 'price-up' : 'price-down'}`}>
          {formatMoney(stock.currentPrice)}
        </h4>
        <div className="d-flex justify-content-between text-muted small">
          <span>Vol: {(stock.volume / 1000000).toFixed(1)}M</span>
          <span>H: {formatMoney(stock.highPrice)}</span>
          <span>L: {formatMoney(stock.lowPrice)}</span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StockCard;
