import { api } from './api';

export const getPatient = (id) => api(`/api/paciente/${id}`);

export const listAnamneses = (patientId) => api(`/api/anamnesis/patient/${patientId}`);
export const createAnamnesis = (patientId, data) => api(`/api/anamnesis/register/${patientId}`, { method: 'POST', body: data });
export const updateAnamnesis = (id, data) => api(`/api/anamnesis/update/${id}`, { method: 'PUT', body: data });

export const listDiagnostics = (patientId) => api(`/api/diagnostic/patient/${patientId}`);
export const createDiagnostic = (patientId, data) => api(`/api/diagnostic/register/${patientId}`, { method: 'POST', body: data });
export const updateDiagnostic = (id, data) => api(`/api/diagnostic/update/${id}`, { method: 'PUT', body: data });

export const listEvaluations = (patientId) => api(`/api/evaluation/patient/${patientId}`);
export const createEvaluation = (patientId, data) => api(`/api/evaluation/register/${patientId}`, { method: 'POST', body: data });
export const updateEvaluation = (id, data) => api(`/api/evaluation/update/${id}`, { method: 'PUT', body: data });
export const concludeEvaluation = (id) => api(`/api/evaluation/${id}/conclude`, { method: 'PATCH' });
export const deleteEvaluation = (id) => api(`/api/evaluation/${id}/delete`, { method: 'DELETE' });
