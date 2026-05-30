import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, isAdmin } = useAuth();

  const userLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/portfolio', label: 'Portfolio', icon: '💼' },
    { to: '/transactions', label: 'Transactions', icon: '📋' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Dashboard', icon: '⚙️' },
    { to: '/admin/users', label: 'Manage Users', icon: '👥' },
    { to: '/admin/stocks', label: 'Manage Stocks', icon: '📈' },
    { to: '/admin/transactions', label: 'Transactions', icon: '🔄' },
    { to: '/admin/analytics', label: 'Analytics', icon: '📉' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <div
      className="position-fixed top-0 start-0 h-100 text-white d-none d-md-block"
      style={{ width: '250px', backgroundColor: '#212529', zIndex: 1000, paddingTop: '70px' }}
    >
      <div className="px-3 py-2 border-bottom border-secondary">
        <small className="text-muted">Logged in as</small>
        <div className="fw-semibold text-truncate">{user?.name}</div>
        <span className="badge bg-primary">{user?.role}</span>
      </div>
      <nav className="nav flex-column p-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `nav-link text-white mb-1 rounded ${isActive ? 'bg-primary' : ''}`
            }
          >
            <span className="me-2">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
