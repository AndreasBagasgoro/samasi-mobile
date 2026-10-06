import React from 'react';
import { AuthHeader, LoginForm } from '../components';

export const LoginScreen: React.FC = () => {
  return (
    <AuthHeader
      title="Welcome Back"
      subtitle="Login to continue your work"
    >
      <LoginForm />
    </AuthHeader>
  );
};
