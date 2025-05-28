export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  REQUESTER = 'REQUESTER',
  REVIEWER = 'REVIEWER',
  SOURCING_MANAGER = 'SOURCING_MANAGER'
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  token: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
} 