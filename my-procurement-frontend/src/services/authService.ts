import axios from '../utils/axios';
import { LoginCredentials, LoginResponse, User } from '../types/auth';

class AuthError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'AuthError';
  }
}

const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post('/api/auth/login', credentials);
    const data = response.data as LoginResponse;
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }
    
    return data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new AuthError(
      error.response?.data?.message || 'Login failed',
      error.response?.status
    );
  }
};

const logout = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  // Clear any other auth-related items
  localStorage.clear();
  // Redirect to login page
  window.location.href = '/login';
};

const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr) as User;
    }
    return null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

const getToken = (): string | null => {
  return localStorage.getItem('token');
};

const isAuthenticated = (): boolean => {
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