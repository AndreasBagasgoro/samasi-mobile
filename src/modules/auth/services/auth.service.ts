import { apiService } from '@shared/services';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from '../types';

class AuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const res = await apiService.post<LoginResponse>('/auth/login', data);
    return res.data;
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const res = await apiService.post<RegisterResponse>('/auth/register', data);
    return res.data;
  }

  async logout(): Promise<void> {
    const res = await apiService.post<void>('/auth/logout');
    return res.data;
  }

  async getProfile(): Promise<User> {
    const res = await apiService.get<User>('/auth/profile');
    return res.data;
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const res = await apiService.post<{ token: string; refreshToken: string }>('/auth/refresh', {
      refreshToken,
    });
    return res.data;
  }
}

export const authService = new AuthService();
