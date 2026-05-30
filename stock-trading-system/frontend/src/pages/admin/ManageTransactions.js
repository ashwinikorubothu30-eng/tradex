import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form } from 'react-bootstrap';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getTradeHistory, updateTransactionStatus } from '../../services/tradeService';
import { toast } from 'react-toastify';
import { useCurrency } from '../../context/CurrencyContext';

const ManageTransactions = () => {
  const { formatMoney } = useCurrency();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data } = await getTradeHistory({ all: 'true', limit: 100 });
      setTransactions(data.data);
    } catch {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateTransactionStatus(id, status);
      toast.success(`Transaction ${status.toLowerCase()}`);
      fetchTransactions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const exportCSV = () => {
    const headers = ['Date', 'User', 'Type', 'Stock', 'Qty', 'Price', 'Total', 'Status'];
    const rows = transactions.map((t) => [
      new Date(t.timestamp).toISOString(),
      t.userId?.email,
      t.tradeType,
      t.stockId?.symbol,
      t.quantity,
      t.price,
      t.totalAmount,
      t.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tradex-transactions.csv';
    a.click();
    toast.success('Report exported');
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between mb-4">
        <h2>Transaction Monitoring</h2>
        <Button variant="outline-primary" onClick={exportCSV}>Export CSV</Button>
      </div>
      <Card className="shadow-sm">
        {loading ? <LoadingSpinner /> : (
          <div className="table-responsive">
            <Table hover className="mb-0" size="sm">
              <thead>
                <tr>
                  <th>Date</th><th>User</th><th>Type</th><th>Stock</th>
                  <th>Qty</th><th>Total</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id}>
                    <td>{new Date(t.timestamp).toLocaleString()}</td>
                    <td>{t.userId?.name}<br /><small className="text-muted">{t.userId?.email}</small></td>
                    <td><Badge bg={t.tradeType === 'BUY' ? 'success' : 'danger'}>{t.tradeType}</Badge></td>
                    <td>{t.stockId?.symbol}</td>
                    <td>{t.quantity}</td>
                    <td>{formatMoney(t.totalAmount)}</td>
                    <td><Badge bg="secondary">{t.status}</Badge></td>
                    <td>
                      {t.status !== 'COMPLETED' && (
                        <Button size="sm" variant="success" className="me-1" onClick={() => handleStatus(t._id, 'COMPLETED')}>Approve</Button>
                      )}
                      {t.status !== 'REJECTED' && (
                        <Button size="sm" variant="danger" onClick={() => handleStatus(t._id, 'REJECTED')}>Reject</Button>
                      )}
                    </td>
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

export default ManageTransactions;
