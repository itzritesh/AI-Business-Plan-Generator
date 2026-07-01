import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Configure Axios default headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const res = await axios.get('/api/auth/profile');
        setUser(res.data);
      } catch (error) {
        console.error('Session validation failed, logging out:', error.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    setToken(userData.token);
    setUser({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
    });
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  const register = (userData) => {
    login(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
