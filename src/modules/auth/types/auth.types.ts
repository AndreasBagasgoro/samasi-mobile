export interface User {
  id?: string;
  employee_id?: string;
  name?: string;
  full_name?: string;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: any;
  createdAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  access_token?: string;
  refreshToken?: string;
  session_id?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
  access_token?: string;
  refreshToken?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
}
