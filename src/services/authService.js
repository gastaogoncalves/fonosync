import { api, clearSession, getSession, saveSession } from './api';

export async function login(email, password) {
  const session = await api('/api/auth/login', { method: 'POST', body: { email, password } });
  saveSession(session);
  return session;
}

export async function register(email, password, role) {
  const session = await api('/api/auth/register', { method: 'POST', body: { email, password, role } });
  saveSession(session);
  return session;
}

export function logout() {
  clearSession();
  window.location.hash = '#/';
}

export function homeFor(role) {
  return role === 'ROLE_PACIENTE' ? '#/paciente/inicio' : '#/profissional/dashboard';
}

export function currentRole() {
  return getSession()?.role ?? null;
}
