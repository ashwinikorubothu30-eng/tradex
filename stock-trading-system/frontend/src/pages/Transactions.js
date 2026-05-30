import React, { useState, useEffect } from 'react';
import { Card, Table, Form, Row, Col, Badge } from 'react-bootstrap';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { getTradeHistory } from '../services/tradeService';
import { useCurrency } from '../context/CurrencyContext';

const Transactions = () => {
  const { formatMoney } = useCurrency();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ tradeType: '', sortOrder: 'desc' });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getTradeHistory({
          tradeType: filters.tradeType || undefined,
          sortOrder: filters.sortOrder,
          limit: 50,
        });
        setTransactions(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [filters]);

  return (
    <Layout>
      <h2 className="mb-4">Transaction History</h2>

      <Row className="g-3 mb-3">
        <Col md={3}>
          <Form.Select
            value={filters.tradeType}
            onChange={(e) => setFilters({ ...filters, tradeType: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filters.sortOrder}
            onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </Form.Select>
        </Col>
      </Row>

      <Card className="shadow-sm">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Stock</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      No transactions yet
                    </td>
                  </tr>
                )}
                {transactions.map((t) => (
                  <tr key={t._id}>
                    <td>{new Date(t.timestamp).toLocaleString()}</td>
                    <td>
                      <Badge bg={t.tradeType === 'BUY' ? 'success' : 'danger'}>
                        {t.tradeType}
                      </Badge>
                    </td>
                    <td>{t.stockId?.symbol} - {t.stockId?.companyName}</td>
                    <td>{t.quantity}</td>
                    <td>{formatMoney(t.price)}</td>
                    <td>{formatMoney(t.totalAmount)}</td>
                    <td><Badge bg="secondary">{t.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>
    </Layout>
  );
};

export default Transactions;
