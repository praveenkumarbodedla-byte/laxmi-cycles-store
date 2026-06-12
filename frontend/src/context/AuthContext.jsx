import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/api/auth/me');
      if (response.data.success) {
        const profile = response.data.data;
        setUser(profile);
        setIsAdmin(profile.role === 'admin');
        localStorage.setItem('user', JSON.stringify(profile));
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      console.error('Verify token failed:', error.message);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', {
      email,
      password
    });

    if (response.data.success) {
      const { token, user: loggedUser } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedUser));

      setUser(loggedUser);
      setIsAdmin(loggedUser.role === 'admin');

      return response.data;
    }

    throw new Error('Login failed');
  } catch (error) {
    const errMsg =
      error.response?.data?.message ||
      error.message ||
      'Login failed';

    throw new Error(errMsg);
  }
};

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/api/auth/register', { name, email, password });

      if (response.data.success) {
        const { token, user: loggedUser } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        setUser(loggedUser);
        setIsAdmin(false);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(errMsg);
    }
  };

  const forgotPassword = async (name, email, newPassword) => {
    try {
      const response = await api.post('/api/auth/forgot-password', { name, email, newPassword });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Password reset failed');
      }
      return response.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Password reset failed';
      throw new Error(errMsg);
    }
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, register, forgotPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
