import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Row, Col, Badge } from 'react-bootstrap';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getUsers, updateUser, deleteUser } from '../../services/userService';
import { toast } from 'react-toastify';
import { useCurrency } from '../../context/CurrencyContext';

const ManageUsers = () => {
  const { formatMoney } = useCurrency();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({});

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getUsers({ search, limit: 50 });
      setUsers(data.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [search]);

  const handleEdit = (user) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, role: user.role, virtualBalance: user.virtualBalance });
  };

  const handleSave = async () => {
    try {
      await updateUser(editUser._id, form);
      toast.success('User updated');
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between mb-4">
        <h2>Manage Users</h2>
        <Form.Control
          style={{ maxWidth: '250px' }}
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Card className="shadow-sm">
        {loading ? <LoadingSpinner /> : (
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Balance</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><Badge bg={u.role === 'ADMIN' ? 'danger' : 'primary'}>{u.role}</Badge></td>
                    <td>{formatMoney(u.virtualBalance)}</td>
                    <td>
                      <Button size="sm" variant="outline-primary" className="me-1" onClick={() => handleEdit(u)}>Edit</Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(u._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      <Modal show={!!editUser} onHide={() => setEditUser(null)}>
        <Modal.Header closeButton><Modal.Title>Edit User</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label>Role</Form.Label>
                <Form.Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label>Balance</Form.Label>
                <Form.Control type="number" value={form.virtualBalance} onChange={(e) => setForm({ ...form, virtualBalance: parseFloat(e.target.value) })} />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditUser(null)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default ManageUsers;
