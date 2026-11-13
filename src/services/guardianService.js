import { api } from './api';

export const getGuardianById = (id) => api(`/api/guardians/${id}`);

export const createGuardian = (guardian) => api('/api/guardians', { method: 'POST', body: guardian });

export const listGuardians = () => api('/api/guardians');
