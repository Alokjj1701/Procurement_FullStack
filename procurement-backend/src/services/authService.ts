import axios from 'axios';
import { LoginCredentials, User } from '../types/auth';

const API_URL = 'http://localhost:8081/api/auth/';

const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(API_URL + 'login', {
      email,
      password
    });
    
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data?.message || 'Login failed');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('An error occurred while setting up the request.');
    }
  }
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  // Clear any other auth-related items
  localStorage.clear();
  // Redirect to login page
  window.location.href = '/login';
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

const getToken = () => {
  return localStorage.getItem('token');
};

const isAuthenticated = () => {
  return !!getToken();
};

const authService = {
  login,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated
};

export default authService; 