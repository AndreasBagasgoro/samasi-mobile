import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';

class StorageService {
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }

  async setToken(token: string): Promise<void> {
    await this.setItem(TOKEN_KEY, token);
  }

  async getToken(): Promise<string | null> {
    return await this.getItem(TOKEN_KEY);
  }

  async removeToken(): Promise<void> {
    await this.removeItem(TOKEN_KEY);
  }
}

export const storageService = new StorageService();
