import { useEffect, useState } from 'react';
import { AuthContext } from '../hooks/useAuth';
import { getSession } from '../services/api';
import * as authService from '../services/authService';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getSession);

  useEffect(() => {
    const handleExpired = () => setSession(null);
    window.addEventListener('fonosync:sessao-encerrada', handleExpired);
    return () => window.removeEventListener('fonosync:sessao-encerrada', handleExpired);
  }, []);

  const login = async (email, password) => {
    const next = await authService.login(email, password);
    setSession(next);
    return next;
  };

  const register = async (email, password, role) => {
    const next = await authService.register(email, password, role);
    setSession(next);
    return next;
  };

  const updateSession = (data) => {
    const next = authService.updateCurrentSession(data);
    setSession(next);
    return next;
  };

  const logout = () => {
    authService.logout();
    setSession(null);
    window.location.hash = '#/';
  };

  return (
    <AuthContext.Provider value={{ session, login, register, updateSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
