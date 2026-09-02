// Psychiatrist API Service
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const psychiatristApi = {
  // Psychiatrist login
  login: async (username, password) => {
    const response = await api.post('/psychiatrist/login', { username, password });
    return response.data;
  },

  // Get critical queue
  getQueue: async (status = null, sortBy = 'created_at') => {
    const params = {};
    if (status) params.status = status;
    if (sortBy) params.sort_by = sortBy;
    const response = await api.get('/psychiatrist/queue', { params });
    return response.data;
  },

  // Update status (queued -> in_session -> resolved)
  updateQueueStatus: async (caseId, status, psychiatristId = null) => {
    const response = await api.patch(`/psychiatrist/queue/${caseId}/status`, {
      status,
      psychiatrist_id: psychiatristId,
    });
    return response.data;
  },

  // Fetch full case report for psychiatrist review
  getCaseReport: async (caseId) => {
    const response = await api.get(`/psychiatrist/cases/${caseId}/report`);
    return response.data;
  },

  // Add session notes
  addSessionNote: async (caseId, notes, psychiatristId = null, psychiatristName = 'Dr. Psychiatrist') => {
    const response = await api.post(`/psychiatrist/cases/${caseId}/notes`, {
      psychiatrist_id: psychiatristId,
      psychiatrist_name: psychiatristName,
      notes,
    });
    return response.data;
  },

  // Get session notes
  getSessionNotes: async (caseId) => {
    const response = await api.get(`/psychiatrist/cases/${caseId}/notes`);
    return response.data;
  },

  // Consultation Chat APIs
  sendChatMessage: async (caseId, senderType, senderName, message) => {
    const response = await api.post('/chat/send', {
      case_id: caseId,
      sender_type: senderType,
      sender_name: senderName,
      message,
    });
    return response.data;
  },

  getChatMessages: async (caseId) => {
    const response = await api.get(`/chat/messages/${caseId}`);
    return response.data;
  },
};
