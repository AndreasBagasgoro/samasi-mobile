import { useState } from 'react';
import { useAuth } from './useAuth';
import { PASSWORD_MIN_LENGTH } from '../constants';

export const useLoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, isLoading } = useAuth();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!username.trim) {
      newErrors.username = 'Username is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < PASSWORD_MIN_LENGTH) {
      newErrors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        await login({ username, password });
      } catch (err) {
        // Error handled in store
      }
    }
  };

  return {
    username,
    password,
    errors,
    isLoading,
    setUsername,
    setPassword,
    handleSubmit,
  };
};
