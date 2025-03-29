import axios from 'axios';

// Define API base URL - use environment variable in production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const contestsApi = {
  // Get all contests with optional filters
  getAllContests: async (params = {}) => {
    try {
      const response = await apiClient.get('/contests', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching all contests:', error);
      throw error;
    }
  },

  // Get upcoming contests
  getUpcomingContests: async (params = {}) => {
    try {
      const response = await apiClient.get('/contests/upcoming', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming contests:', error);
      throw error;
    }
  },

  // Get ongoing contests
  getOngoingContests: async (params = {}) => {
    try {
      const response = await apiClient.get('/contests/ongoing', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching ongoing contests:', error);
      throw error;
    }
  },

  // Get contests by platform
  getPlatformContests: async (platform, params = {}) => {
    try {
      const response = await apiClient.get(`/contests/${platform}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${platform} contests:`, error);
      throw error;
    }
  },
};

export default contestsApi; 