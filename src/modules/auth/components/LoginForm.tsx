import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Input, Button } from '@shared/components';
import { Colors } from '@shared/constants';
import { useLoginForm } from '../hooks';
import { useAuth } from '../hooks';

export const LoginForm = () => {
  const { 
    email, 
    password, 
    errors, 
    isLoading, 
    setEmail, 
    setPassword, 
    handleSubmit 
  } = useLoginForm();
  
  const { error: storeError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {storeError && (
        <Text style={styles.errorText}>{storeError}</Text>
      )}

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />
      
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        error={errors.password}
        rightIcon={
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        }
      />

      <Button
        title="Login"
        onPress={handleSubmit}
        loading={isLoading}
        style={styles.submitButton}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.linkText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
  },
  submitButton: {
    marginTop: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  toggleText: {
    color: Colors.primary,
    fontSize: 12,
  },
  errorText: {
    color: Colors.semantic.error,
    marginBottom: 16,
    textAlign: 'center',
  },
});
