const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const SESSION_KEY = 'fonosync:sessao';

export function getSession() {
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function saveSession(session) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export async function api(path, { method = 'GET', body } = {}) {
  const session = getSession();
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (session?.token) headers.Authorization = `Bearer ${session.token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Confira se o back-end está rodando.');
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  // token vencido ou inválido: o back responde 401 ou 403 sem mensagem
  const expired = response.status === 401 || (response.status === 403 && !data?.message);
  if (expired && session && !path.startsWith('/api/auth')) {
    clearSession();
    window.dispatchEvent(new Event('fonosync:sessao-encerrada'));
    window.location.hash = '#/acesso';
    throw new Error('Sua sessão expirou. Entre novamente.');
  }

  if (!response.ok) {
    const fieldMessage = data?.fieldErrors?.[0]?.message;
    throw new Error(fieldMessage || data?.message || 'Não foi possível concluir a ação. Tente de novo.');
  }
  return data;
}
