import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Row, Col } from 'react-bootstrap';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getStocks, createStock, updateStock, deleteStock } from '../../services/stockService';
import { toast } from 'react-toastify';
import { useCurrency } from '../../context/CurrencyContext';

const emptyStock = {
  symbol: '', companyName: '', currentPrice: '', openPrice: '', highPrice: '', lowPrice: '', volume: 0, marketCap: 0, description: '',
};

const ManageStocks = () => {
  const { formatMoney } = useCurrency();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyStock);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const { data } = await getStocks({ search, limit: 50 });
      setStocks(data.data);
    } catch {
      toast.error('Failed to load stocks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStocks(); }, [search]);

  const openCreate = () => {
    setForm(emptyStock);
    setModal('create');
  };

  const openEdit = (stock) => {
    setForm({ ...stock });
    setModal(stock._id);
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      currentPrice: parseFloat(form.currentPrice),
      openPrice: parseFloat(form.openPrice || form.currentPrice),
      highPrice: parseFloat(form.highPrice || form.currentPrice),
      lowPrice: parseFloat(form.lowPrice || form.currentPrice),
      volume: parseInt(form.volume) || 0,
      marketCap: parseFloat(form.marketCap) || 0,
    };
    try {
      if (modal === 'create') {
        await createStock(payload);
        toast.success('Stock created');
      } else {
        await updateStock(modal, payload);
        toast.success('Stock updated');
      }
      setModal(null);
      fetchStocks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this stock?')) return;
    try {
      await deleteStock(id);
      toast.success('Stock deleted');
      fetchStocks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between mb-4">
        <h2>Manage Stocks</h2>
        <div className="d-flex gap-2">
          <Form.Control placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: '200px' }} />
          <Button variant="primary" onClick={openCreate}>Add Stock</Button>
        </div>
      </div>
      <Card className="shadow-sm">
        {loading ? <LoadingSpinner /> : (
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr><th>Symbol</th><th>Company</th><th>Price</th><th>Volume</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {stocks.map((s) => (
                  <tr key={s._id}>
                    <td><strong>{s.symbol}</strong></td>
                    <td>{s.companyName}</td>
                    <td>{formatMoney(s.currentPrice)}</td>
                    <td>{s.volume?.toLocaleString()}</td>
                    <td>
                      <Button size="sm" variant="outline-primary" className="me-1" onClick={() => openEdit(s)}>Edit</Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(s._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      <Modal show={!!modal} onHide={() => setModal(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modal === 'create' ? 'Add Stock' : 'Edit Stock'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-2">
            <Col md={4}>
              <Form.Group><Form.Label>Symbol</Form.Label>
                <Form.Control value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })} /></Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group><Form.Label>Company Name</Form.Label>
                <Form.Control value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group><Form.Label>Current Price</Form.Label>
                <Form.Control type="number" step="0.01" value={form.currentPrice} onChange={(e) => setForm({ ...form, currentPrice: e.target.value })} /></Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group><Form.Label>Open</Form.Label>
                <Form.Control type="number" step="0.01" value={form.openPrice} onChange={(e) => setForm({ ...form, openPrice: e.target.value })} /></Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group><Form.Label>High</Form.Label>
                <Form.Control type="number" step="0.01" value={form.highPrice} onChange={(e) => setForm({ ...form, highPrice: e.target.value })} /></Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group><Form.Label>Low</Form.Label>
                <Form.Control type="number" step="0.01" value={form.lowPrice} onChange={(e) => setForm({ ...form, lowPrice: e.target.value })} /></Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group><Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default ManageStocks;
