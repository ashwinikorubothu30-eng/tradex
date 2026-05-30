import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as loginApi, register as registerApi, getProfile } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await getProfile();
      setUser(data.data);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
      }
    }
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await loginApi(credentials);
    const userData = data.data;
    localStorage.setItem('token', userData.token);
    const { token, ...userWithoutToken } = userData;
    localStorage.setItem('user', JSON.stringify(userWithoutToken));
    setUser(userWithoutToken);
    return userWithoutToken;
  };

  const register = async (userData) => {
    const { data } = await registerApi(userData);
    const newUser = data.data;
    localStorage.setItem('token', newUser.token);
    const { token, ...userWithoutToken } = newUser;
    localStorage.setItem('user', JSON.stringify(userWithoutToken));
    setUser(userWithoutToken);
    return userWithoutToken;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUserState = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUserState,
        isAdmin: user?.role === 'ADMIN',
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
