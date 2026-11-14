import { api, getSession } from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const getAttachmentsByPatient = (patientId) => api(`/api/attachments/patient/${patientId}`);

export async function uploadAttachment(patientId, file, description = '') {
  const session = getSession();
  const formData = new FormData();
  formData.append('patientId', patientId);
  formData.append('file', file);
  if (description) {
    formData.append('description', description);
  }

  const headers = {};
  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const response = await fetch(`${API_URL}/api/attachments/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Falha ao enviar arquivo anexo.');
  }

  return response.json();
}

export function getAttachmentDownloadUrl(id) {
  return `${API_URL}/api/attachments/${id}/download`;
}
