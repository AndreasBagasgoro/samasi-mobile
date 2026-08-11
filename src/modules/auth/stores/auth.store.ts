import { create } from 'zustand';
import { storageService } from '@shared/services';
import { authService } from '../services';
import { AuthState, LoginRequest, RegisterRequest } from '../types';
import { TOKEN_KEY, REFRESH_TOKEN_KEY, AUTH_STORAGE_KEY } from '../constants';

interface AuthStore extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,
  error: null,

  login: async (data: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(data);
      const token = response.access_token || response.token;
      
      if (token) {
        await storageService.setItem(TOKEN_KEY, token);
      }
      if (response.refreshToken) {
        await storageService.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      }
      if (response.user) {
        await storageService.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.user));
      }
      
      set({
        user: response.user,
        token: token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      const token = response.access_token || response.token;
      
      if (token) {
        await storageService.setItem(TOKEN_KEY, token);
      }
      if (response.refreshToken) {
        await storageService.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      }
      if (response.user) {
        await storageService.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.user));
      }

      set({
        user: response.user,
        token: token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout().catch(() => {});
    } finally {
      await storageService.removeItem(TOKEN_KEY);
      await storageService.removeItem(REFRESH_TOKEN_KEY);
      await storageService.removeItem(AUTH_STORAGE_KEY);
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  hydrate: async () => {
    try {
      const token = await storageService.getItem(TOKEN_KEY);
      const userStr = await storageService.getItem(AUTH_STORAGE_KEY);
      
      if (token && userStr) {
        set({
          token,
          user: JSON.parse(userStr),
          isAuthenticated: true,
        });
      }
    } catch (error) {
      // Ignore hydration errors
    } finally {
      set({ isHydrated: true });
    }
  },

  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
}));
