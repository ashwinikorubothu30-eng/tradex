# TradeX - MERN Stock Trading & Portfolio Management System

A full-stack stock trading simulation platform built with the MERN stack. Users can browse stocks, simulate buy/sell trades with virtual currency, track portfolios, and monitor profit/loss. Admins manage users, stocks, transactions, and platform analytics.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, React Router, Axios, Bootstrap, Chart.js |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT, bcryptjs |

## Project Structure

```
stock-trading-system/
├── backend/          # Express API (MVC)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── utils/seed.js
└── frontend/         # React SPA
    └── src/
        ├── pages/
        ├── components/
        ├── services/
        ├── context/
        └── charts/
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Setup Instructions

### 1. Clone & Install

```bash
cd stock-trading-system

# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

### 2. Configure Environment

**backend/.env**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tradex
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
INITIAL_VIRTUAL_BALANCE=100000
```

**frontend/.env**
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Connect real database (MongoDB Atlas)

See **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** for cloud setup. Put your connection string in `backend/.env` as `MONGODB_URI`.

**Do not paste database passwords in chat** — only in your local `.env` file.

### 4. Seed stock catalog (once)

```bash
cd backend
npm run seed
```

This adds stocks if the DB is empty. It does **not** delete registered users. Optional demo accounts: set `SEED_DEMO_USERS=true` in `.env` first.

### 5. Run Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

- Frontend: http://localhost:3000
- API: http://localhost:5000/api

## New user registration (real accounts)

1. Open **http://localhost:3000/register**
2. Enter name, email, password → account is saved in MongoDB
3. User receives **$100,000** virtual balance and can trade immediately

Demo accounts are **optional** (`SEED_DEMO_USERS=true` then `npm run seed`):

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@tradex.com | admin123 |
| User | user@tradex.com | user1234 |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Stocks
- `GET /api/stocks` - List stocks (pagination, search)
- `GET /api/stocks/:id` - Stock details
- `GET /api/stocks/market/dashboard` - Market summary
- `POST /api/stocks` - Create stock (admin)
- `PUT /api/stocks/:id` - Update stock (admin)
- `DELETE /api/stocks/:id` - Delete stock (admin)

### Trading
- `POST /api/trade/buy` - Buy stock
- `POST /api/trade/sell` - Sell stock
- `GET /api/trade/history` - Transaction history

### Portfolio
- `GET /api/portfolio` - User portfolio

### Admin
- `GET /api/users` - List users
- `GET /api/analytics` - Platform analytics

## Features

- JWT authentication with role-based access (USER / ADMIN)
- Live price simulation (updates every 30 seconds)
- Virtual trading with balance validation
- Portfolio tracking with P/L calculations
- Transaction history with filtering
- Admin dashboard with user/stock/transaction management
- Charts: price history, portfolio allocation, analytics
- CSV export for transaction reports

## Security

- Password hashing with bcryptjs
- JWT-protected routes
- Admin-only middleware
- CORS enabled
- Environment variables for secrets

## License

MIT
