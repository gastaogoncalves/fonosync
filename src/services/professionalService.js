import { api } from './api';

export const registerProfessional = (data) =>
  api('/api/professionals/register', { method: 'POST', body: data });

export const listProfessionals = () => api('/api/professionals');
