import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Navbar from '../components/Navbar';

const Home = () => (
  <>
    <Navbar />
    <div style={{ paddingTop: '70px' }}>
      <section className="bg-dark text-white py-5">
        <Container className="py-5 text-center">
          <h1 className="display-4 fw-bold mb-3">
            Welcome to <span className="text-primary">TradeX</span>
          </h1>
          <p className="lead mb-4 col-lg-8 mx-auto">
            Create your own account — no demo required. Register with email, trade with virtual funds,
            and every trade is saved to your database.
          </p>
          <div>
            <Button as={Link} to="/register" variant="primary" size="lg" className="me-2">
              Sign Up Free
            </Button>
            <Button as={Link} to="/login" variant="outline-light" size="lg">
              Login
            </Button>
          </div>
        </Container>
      </section>
      <Container className="py-5">
        <Row className="g-4">
          {[
            { title: 'Live Market Data', desc: 'Real-time price updates every 30 seconds with trending stocks and market summary.' },
            { title: 'Virtual Trading', desc: 'Buy and sell stocks with $100,000 virtual balance. No real money at risk.' },
            { title: 'Portfolio Tracking', desc: 'Monitor holdings, profit/loss, and performance charts in one dashboard.' },
            { title: 'Admin Portal', desc: 'Full admin control over users, stocks, transactions, and platform analytics.' },
          ].map((f, i) => (
            <Col md={6} lg={3} key={i}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <h5>{f.title}</h5>
                  <p className="text-muted mb-0">{f.desc}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  </>
);

export default Home;
