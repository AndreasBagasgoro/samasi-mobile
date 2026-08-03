import { ApiError, ApiResponse } from '../types';
import { storageService } from './storage.service';

const DEFAULT_BASE_URL = 'http://localhost:3010/api/v1';

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = DEFAULT_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const token = await storageService.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error: ApiError = {
        message: data?.message || 'An error occurred while fetching data',
        statusCode: response.status,
        errors: data?.errors,
      };
      throw error;
    }

    return data as T;
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    const url = `${this.baseURL}${endpoint}${queryString}`;
    const headers = await this.getHeaders();

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<ApiResponse<T>>(response);
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getHeaders();

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<ApiResponse<T>>(response);
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getHeaders();

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<ApiResponse<T>>(response);
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getHeaders();

    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<ApiResponse<T>>(response);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getHeaders();

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    return this.handleResponse<ApiResponse<T>>(response);
  }
}

export const apiService = new ApiService();
