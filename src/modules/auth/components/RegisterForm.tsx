import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Input, Button } from '@shared/components';
import { Colors } from '@shared/constants';
import { useAuth } from '../hooks';
import { EMAIL_REGEX, PASSWORD_MIN_LENGTH } from '../constants';

export const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { register, isLoading, error: storeError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = 'Name is required';
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < PASSWORD_MIN_LENGTH) {
      newErrors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
    }

    if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        await register({ name, email, password, passwordConfirmation });
      } catch (err) {
        // Handled in store
      }
    }
  };

  return (
    <View style={styles.container}>
      {storeError && (
        <Text style={styles.errorText}>{storeError}</Text>
      )}

      <Input
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter your full name"
        error={errors.name}
      />

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

      <Input
        label="Confirm Password"
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        placeholder="Confirm your password"
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        error={errors.passwordConfirmation}
      />

      <Button
        title="Register"
        onPress={handleSubmit}
        loading={isLoading}
        style={styles.submitButton}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.linkText}>Login</Text>
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
