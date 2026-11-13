import { api } from './api';

export const getEvaluationsByPatient = (patientId) => api(`/api/evaluation/patient/${patientId}`);

export const getEvaluationById = (id) => api(`/api/evaluation/${id}`);

export const createEvaluation = (patientId, data) =>
  api(`/api/evaluation/register/${patientId}`, { method: 'POST', body: data });

export const updateEvaluation = (id, data) =>
  api(`/api/evaluation/update/${id}`, { method: 'PUT', body: data });
