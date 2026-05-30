import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import CurrencySelector from './CurrencySelector';

const Navbar = ({ showAuth = true }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { formatMoney } = useCurrency();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BSNavbar bg="dark" variant="dark" fixed="top" expand="lg" className="shadow-sm">
      <Container fluid>
        <BSNavbar.Brand as={Link} to={isAuthenticated ? '/dashboard' : '/'}>
          <strong className="text-primary">Trade</strong>X
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="navbar-nav" />
        <BSNavbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-lg-center gap-2">
            <CurrencySelector className="me-lg-2" />
            {isAuthenticated && user && (
              <>
                <span className="text-white me-lg-2 d-none d-lg-inline">
                  Balance: <Badge bg="success">{formatMoney(user.virtualBalance)}</Badge>
                </span>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                {!user.role || user.role === 'USER' ? (
                  <>
                    <Nav.Link as={Link} to="/portfolio">Portfolio</Nav.Link>
                    <Nav.Link as={Link} to="/transactions">Transactions</Nav.Link>
                  </>
                ) : (
                  <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
                )}
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
            {showAuth && !isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <Button variant="primary" size="sm">Register</Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
