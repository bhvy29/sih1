// API service for communication with backend

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiService = {
  // Submit assessment (text or voice)
  submitAssessment: async (text, language = "en") => {
    try {
      const response = await api.post("/assess", {
        text,
        language,
      });
      return response.data;
    } catch (error) {
      console.error("Assessment submission failed:", error);
      throw error;
    }
  },

  // Submit voice recording
  submitVoiceAssessment: async (audioBase64, language = "en") => {
    try {
      const response = await api.post("/assess", {
        audio_base64: audioBase64,
        language,
      });
      return response.data;
    } catch (error) {
      console.error("Voice assessment submission failed:", error);
      throw error;
    }
  },

  // Fetch all cases for dashboard
  fetchCases: async (limit = 50, offset = 0, category = null) => {
    try {
      const response = await api.get("/cases", {
        params: { limit, offset, category },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch cases:", error);
      throw error;
    }
  },

  // Get critical case count
  getCriticalCount: async () => {
    try {
      const response = await api.get("/cases/critical-count");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch critical count:", error);
      return { critical_count: 0 };
    }
  },

  // Mark case as reviewed
  markCaseReviewed: async (caseId, counsellorName) => {
    try {
      const response = await api.patch(`/cases/${caseId}/review`, {
        reviewed_by: counsellorName,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to mark case as reviewed:", error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      console.error("Health check failed:", error);
      return { status: "error" };
    }
  },
};
