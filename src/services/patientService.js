import { api } from './api';

export const listPatients = () => api('/api/paciente');

export const createPatient = (patient) => api('/api/paciente/register', { method: 'POST', body: patient });

export const updatePatient = (id, patient) => api(`/api/paciente/update/${id}`, { method: 'PUT', body: patient });

export const archivePatient = (id) => api(`/api/paciente/${id}/archive`, { method: 'PATCH' });

export const deletePatient = (id) => api(`/api/paciente/${id}/delete`, { method: 'DELETE' });

export const createGuardian = (guardian) => api('/api/guardians', { method: 'POST', body: guardian });
