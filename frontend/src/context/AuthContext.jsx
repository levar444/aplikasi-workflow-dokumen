import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.data || response.data);
        } catch (error) {
          console.error('Autentikasi gagal:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Mendukung struktur response.data.data ataupun response.data langsung[cite: 8]
      const resData = response.data.data || response.data;
      const token = resData.token;
      const userData = resData.user || resData; 
      
      if (token) {
        localStorage.setItem('token', token);
        setUser(userData);
        
        // Membersihkan spasi dan memastikan role menjadi huruf kapital
        const cleanRole = userData && userData.role ? String(userData.role).trim().toUpperCase() : '';
        
        return { success: true, role: cleanRole };
      } else {
        return { success: false, message: 'Token tidak ditemukan dari server.' };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login gagal, periksa kembali email dan password.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);