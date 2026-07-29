import { useEffect } from 'react';
import { useAuthStore } from '../stores';

export const useAuth = () => {
  const store = useAuthStore();

  useEffect(() => {
    if (!store.isHydrated) {
      store.hydrate();
    }
  }, [store.isHydrated, store.hydrate]);

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    isHydrated: store.isHydrated,
    error: store.error,
    login: store.login,
    logout: store.logout,
    register: store.register,
    setError: store.setError,
    clearError: store.clearError,
  };
};
