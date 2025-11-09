import { apiClient } from './api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface ProfileResponse {
  user: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        '/auth/login',
        credentials
      );
      
      // Store tokens in localStorage
      if (response.data.accessToken) {
        localStorage.setItem('authToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        '/auth/register',
        data
      );
      
      // Store tokens in localStorage
      if (response.data.accessToken) {
        localStorage.setItem('authToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<ProfileResponse>>('/auth/profile');
      return response.data.user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(
        '/auth/refresh',
        { refreshToken }
      );
      
      // Update access token
      localStorage.setItem('authToken', response.data.accessToken);
      return response.data.accessToken;
    } catch (error) {
      console.error('Refresh token error:', error);
      // Clear tokens if refresh fails
      this.logout();
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};

