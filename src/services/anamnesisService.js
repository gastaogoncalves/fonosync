import { api } from './api';

export const getAnamnesesByPatient = (patientId) => api(`/api/anamnesis/patient/${patientId}`);

export const getAnamnesisById = (id) => api(`/api/anamnesis/${id}`);

export const createAnamnesis = (patientId, data) =>
  api(`/api/anamnesis/register/${patientId}`, { method: 'POST', body: data });

export const updateAnamnesis = (id, data) =>
  api(`/api/anamnesis/update/${id}`, { method: 'PUT', body: data });

export const deleteAnamnesis = (id) =>
  api(`/api/anamnesis/${id}/delete`, { method: 'DELETE' });
