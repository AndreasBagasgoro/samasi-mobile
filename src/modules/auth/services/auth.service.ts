import { authApiService } from '@shared/services';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from '../types';

class AuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const res = await authApiService.post<any>('/auth/login', data);
    const rawData = res.data || {};
    const token = rawData.access_token || rawData.token || '';
    const user: User = rawData.user || {};
    
    if (user && !user.name && user.full_name) {
      user.name = user.full_name;
    }
    if (user && !user.id && user.employee_id) {
      user.id = String(user.employee_id);
    }

    return {
      token,
      access_token: token,
      refreshToken: rawData.refreshToken || rawData.session_id || '',
      user,
    };
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const res = await authApiService.post<any>('/auth/register', data);
    const rawData = res.data || {};
    const token = rawData.access_token || rawData.token || '';
    const user: User = rawData.user || {};

    if (user && !user.name && user.full_name) {
      user.name = user.full_name;
    }

    return {
      token,
      access_token: token,
      refreshToken: rawData.refreshToken || '',
      user,
    };
  }

  async logout(): Promise<void> {
    const res = await authApiService.post<void>('/auth/logout');
    return res.data;
  }

  async getProfile(): Promise<User> {
    const res = await authApiService.get<User>('/auth/profile');
    return res.data;
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const res = await authApiService.post<{ token: string; refreshToken: string }>('/auth/refresh', {
      refreshToken,
    });
    return res.data;
  }
}

export const authService = new AuthService();
