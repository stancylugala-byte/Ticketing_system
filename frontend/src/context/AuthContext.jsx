import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
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
      .then(r => setUser(r.data.data))
      .catch(() => {
        localStorage.removeItem('jpa_token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((tokenValue, userData) => {
    localStorage.setItem('jpa_token', tokenValue);
    api.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`;
    setUser(userData);
    setLoading(false); // ← critical: mark auth as resolved after login
  }, []);

  const logout = useCallback(() => {
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

export const useAuth = () => useContext(AuthContext);
