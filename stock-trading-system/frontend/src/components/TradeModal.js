import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { buyStock, sellStock } from '../services/tradeService';
import { useCurrency } from '../context/CurrencyContext';
import { toast } from 'react-toastify';

const TradeModal = ({ show, onHide, stock, type, onSuccess, maxQuantity }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { formatMoney } = useCurrency();

  const totalUsd = stock ? stock.currentPrice * quantity : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stock || quantity < 1) return;

    setLoading(true);
    try {
      const fn = type === 'BUY' ? buyStock : sellStock;
      const { data } = await fn({ stockId: stock._id, quantity: parseInt(quantity) });
      toast.success(`${type} order completed! Total: ${formatMoney(data.data.totalAmount)}`);
      onSuccess?.(data);
      onHide();
      setQuantity(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{type === 'BUY' ? 'Buy' : 'Sell'} {stock?.symbol}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p className="text-muted mb-3">
            Current Price: <strong>{formatMoney(stock?.currentPrice)}</strong>
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min={1}
              max={type === 'SELL' ? maxQuantity : undefined}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              required
            />
            {type === 'SELL' && maxQuantity !== undefined && (
              <Form.Text>Max available: {maxQuantity} shares</Form.Text>
            )}
          </Form.Group>
          <div className="bg-light p-3 rounded">
            <strong>Total: {formatMoney(totalUsd)}</strong>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button
            type="submit"
            variant={type === 'BUY' ? 'success' : 'danger'}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Confirm ${type}`}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TradeModal;
