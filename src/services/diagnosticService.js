import { api } from './api';

export const getDiagnosticsByPatient = (patientId) => api(`/api/diagnostic/patient/${patientId}`);

export const getDiagnosticById = (id) => api(`/api/diagnostic/${id}`);

export const createDiagnostic = (patientId, data) =>
  api(`/api/diagnostic/register/${patientId}`, { method: 'POST', body: data });

export const updateDiagnostic = (id, data) =>
  api(`/api/diagnostic/update/${id}`, { method: 'PUT', body: data });
