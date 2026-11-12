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

  const register = async (email, password, role, profile) => {
    const next = await authService.register(email, password, role, profile);
    setSession(next);
    return next;
  };

  const updateProfile = (profile) => {
    setSession((current) => authService.updateProfile(current, profile));
  };

  const logout = () => {
    authService.logout();
    setSession(null);
    window.location.hash = '#/';
  };

  return <AuthContext.Provider value={{ session, login, register, updateProfile, logout }}>{children}</AuthContext.Provider>;
}
