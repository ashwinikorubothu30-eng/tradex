import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import Layout from '../components/Layout';
import CurrencySelector from '../components/CurrencySelector';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { updateProfile } from '../services/authService';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUserState } = useAuth();
  const { formatMoney, currency, baseCurrency } = useCurrency();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password && form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, preferredCurrency: currency };
      if (form.password) payload.password = form.password;
      const { data } = await updateProfile(payload);
      updateUserState(data.data);
      toast.success('Profile updated');
      setForm({ ...form, password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h2 className="mb-4">My Profile</h2>
      <Card className="shadow-sm" style={{ maxWidth: '500px' }}>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Preferred currency</Form.Label>
              <CurrencySelector size="md" className="w-100" />
              <Form.Text className="text-muted">
                Prices and balances are stored in {baseCurrency} and shown in {currency} using live exchange rates.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password (optional)</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </Form.Group>
            <p className="text-muted">
              Role: <strong>{user?.role}</strong> | Balance:{' '}
              <strong>{formatMoney(user?.virtualBalance)}</strong>
            </p>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default Profile;
