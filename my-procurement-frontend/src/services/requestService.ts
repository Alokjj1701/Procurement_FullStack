import axios from '../utils/axios';
import { Request, CreateRequestDTO, UpdateRequestDTO } from '../types/request';

class RequestError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'RequestError';
  }
}

export const requestService = {
  getAllRequests: async (userId?: string, email?: string): Promise<Request[]> => {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (email) params.append('email', email);
      
      const response = await axios.get('/api/requests', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      throw new RequestError(
        error.response?.data?.message || 'Failed to fetch requests',
        error.response?.status
      );
    }
  },

  getMyTasks: async (userId?: string, email?: string): Promise<Request[]> => {
    try {
      const params = new URLSearchParams();
      params.append('assignedTo', 'me');
      if (userId) params.append('userId', userId);
      if (email) params.append('email', email);
      
      const response = await axios.get('/api/requests', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      throw new RequestError(
        error.response?.data?.message || 'Failed to fetch tasks',
        error.response?.status
      );
    }
  },

  getRequestById: async (id: number): Promise<Request> => {
    try {
      const response = await axios.get(`/api/requests/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching request ${id}:`, error);
      throw new RequestError(
        error.response?.data?.message || 'Failed to fetch request',
        error.response?.status
      );
    }
  },

  createRequest: async (request: CreateRequestDTO): Promise<Request> => {
    try {
      const response = await axios.post('/api/requests', request);
      return response.data;
    } catch (error: any) {
      console.error('Error creating request:', error);
      throw new RequestError(
        error.response?.data?.message || 'Failed to create request',
        error.response?.status
      );
    }
  },

  updateRequest: async (id: number, request: UpdateRequestDTO): Promise<Request> => {
    try {
      const response = await axios.put(`/api/requests/${id}`, request);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating request ${id}:`, error);
      throw new RequestError(
        error.response?.data?.message || 'Failed to update request',
        error.response?.status
      );
    }
  },

  deleteRequest: async (id: number): Promise<void> => {
    try {
      await axios.delete(`/api/requests/${id}`);
    } catch (error: any) {
      console.error(`Error deleting request ${id}:`, error);
      throw new RequestError(
        error.response?.data?.message || 'Failed to delete request',
        error.response?.status
      );
    }
  }
}; 