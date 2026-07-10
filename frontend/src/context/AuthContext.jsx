import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: verify any stored token
  useEffect(() => {
    const storedToken = localStorage.getItem('jpa_token');

    if (!storedToken) {
      setLoading(false);
      return;
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

    api.get('/auth/me')
      .then(r => {
        console.log('✅ Auth check - user data:', r.data);
        // ✅ Fix: Backend sends user directly, not nested in 'data'
        setUser(r.data.user);
      })
      .catch(() => {
        console.log('❌ Auth check failed');
        localStorage.removeItem('jpa_token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((tokenValue, userData) => {
    console.log('🔐 Login called with:', { tokenValue, userData });
    localStorage.setItem('jpa_token', tokenValue);
    api.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`;
    setUser(userData);
    setLoading(false);
    console.log('✅ User set, loading set to false');
  }, []);

  const logout = useCallback(() => {
    console.log('🔓 Logout called');
    localStorage.removeItem('jpa_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};