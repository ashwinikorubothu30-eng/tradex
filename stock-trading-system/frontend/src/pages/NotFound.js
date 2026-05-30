import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import Navbar from '../components/Navbar';

const NotFound = () => (
  <>
    <Navbar />
    <Container className="text-center py-5" style={{ marginTop: '100px' }}>
      <h1 className="display-1 text-muted">404</h1>
      <h3>Page Not Found</h3>
      <p className="text-muted">The page you are looking for does not exist.</p>
      <Button as={Link} to="/" variant="primary">Go Home</Button>
    </Container>
  </>
);

export default NotFound;
