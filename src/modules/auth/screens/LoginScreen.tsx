import React from 'react';
import { View, StyleSheet } from 'react-native';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 2,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'flex-start',
    marginTop: 80,
  },
});
