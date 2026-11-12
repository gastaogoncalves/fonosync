import { api, clearSession, saveSession } from './api';

const PROFILES_KEY = 'fonosync:perfis';

// o back ainda não guarda nome e CRFa junto do usuário, então o perfil do cadastro fica salvo neste navegador
function readProfiles() {
  try {
    return JSON.parse(window.localStorage.getItem(PROFILES_KEY)) ?? {};
  } catch {
    return {};
  }
}

function saveProfile(email, profile) {
  window.localStorage.setItem(PROFILES_KEY, JSON.stringify({ ...readProfiles(), [email]: profile }));
}

export async function login(email, password) {
  const session = await api('/api/auth/login', { method: 'POST', body: { email, password } });
  const full = { ...session, profile: readProfiles()[session.email] ?? null };
  saveSession(full);
  return full;
}

export async function register(email, password, role, profile) {
  const session = await api('/api/auth/register', { method: 'POST', body: { email, password, role } });
  saveProfile(session.email, profile);
  const full = { ...session, profile };
  saveSession(full);
  return full;
}

export function updateProfile(session, profile) {
  saveProfile(session.email, profile);
  const full = { ...session, profile };
  saveSession(full);
  return full;
}

export function logout() {
  clearSession();
}

export function homeFor(role) {
  return role === 'ROLE_PACIENTE' ? '#/paciente/inicio' : '#/profissional/dashboard';
}

export function displayName(session) {
  return session?.profile?.name || session?.email || '';
}
