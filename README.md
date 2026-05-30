# TradeX - MERN Stock Trading Platform

## Overview

TradeX is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) stock trading platform that enables users to explore stocks, monitor market trends, execute simulated trades, and manage investment portfolios in real time.

The application provides secure authentication, portfolio tracking, transaction management, real-time stock monitoring, and administrative controls through a responsive and modern user interface.

---

## Features

### User Features

* User Registration and Login
* JWT-based Authentication
* Stock Browsing and Search
* Real-Time Market Dashboard
* Buy and Sell Stock Simulation
* Portfolio Management
* Profit/Loss Tracking
* Transaction History
* Multi-Currency Support
* Responsive User Interface

### Admin Features

* User Management
* Stock Management
* Transaction Monitoring
* Platform Analytics Dashboard
* Role-Based Access Control

---

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Bootstrap
* Chart.js

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* dotenv
* cors

---

## Project Structure

```text
stock-trading-system/

├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   └── package.json
│
└── README.md
```

---

## Database Collections

### Users

* Name
* Email
* Password
* Role
* Virtual Balance

### Stocks

* Symbol
* Company Name
* Current Price
* Market Statistics

### Transactions

* Buy/Sell Records
* Quantity
* Price
* Timestamp

### Portfolio

* Holdings
* Total Investment
* Current Value
* Profit/Loss

---

## Installation

### Clone Repository

```bash
git clone https://github.com/ashwinikorubothu30-eng/tradex.git
cd tradex
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start backend server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## Authentication & Security

* JWT Authentication
* Password Hashing using bcryptjs
* Protected Routes
* Role-Based Authorization
* Secure API Endpoints
* Environment Variable Protection

---

## Multi-Currency Support

Users can select their preferred trading currency.

Supported currencies include:

* USD ($)
* INR (₹)
* EUR (€)
* GBP (£)

The application automatically updates stock prices, balances, portfolios, and transaction values according to the selected currency.

---

## Future Enhancements

* Live Stock Market API Integration
* Watchlist Functionality
* Stock Price Alerts
* Advanced Analytics
* Mobile Application
* AI-Based Investment Insights

---

## Author

**Ashwini Korubothu**

B.Tech Computer Science and Engineering

GitHub: https://github.com/ashwinikorubothu30-eng

---

## License

This project is developed for educational and portfolio purposes.
